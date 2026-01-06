import os
import json
import logging
import pika
from transformers import pipeline
from backend.routes.crud.posts_crud import update_post_sentiment

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

# --- Connect to RabbitMQ ---
def connect_rabbit():
    RABBITMQ_DEFAULT_USER = os.getenv("RABBITMQ_DEFAULT_USER")
    RABBITMQ_DEFAULT_PASS = os.getenv("RABBITMQ_DEFAULT_PASS")
    RABBITMQ_HOST = os.getenv("RABBITMQ_HOST")
    RABBITMQ_PORT = os.getenv("RABBITMQ_PORT")
    RABBITMQ_QUEUE = os.getenv("RABBITMQ_QUEUE")

    if not all([RABBITMQ_DEFAULT_USER, RABBITMQ_DEFAULT_PASS, RABBITMQ_HOST, RABBITMQ_PORT, RABBITMQ_QUEUE]):
        raise ValueError("One or more RabbitMQ environment variables are missing!")

#    print("#######################", RABBITMQ_DEFAULT_USER, "####",
#            RABBITMQ_DEFAULT_PASS, "####", RABBITMQ_QUEUE, "####",
#            RABBITMQ_HOST, "####", RABBITMQ_PORT,
#          "#########################")

    credentials = pika.PlainCredentials(RABBITMQ_DEFAULT_USER, RABBITMQ_DEFAULT_PASS)
    parameters = pika.ConnectionParameters(
        host=RABBITMQ_HOST,
        port=int(RABBITMQ_PORT),
        virtual_host="/",
        credentials=credentials
    )

    connection = pika.BlockingConnection(parameters)
    channel = connection.channel()

    # Declare the queue, just in case
    channel.queue_declare(queue=RABBITMQ_QUEUE, durable=True)

    return connection, channel



# --- HuggingFace Sentiment-Analysis ---
classifier = pipeline(
    "sentiment-analysis",
    model="cardiffnlp/twitter-roberta-base-sentiment" # cardiffnlp/twitter-roberta-base-sentiment     distilbert-base-uncased-finetuned-sst-2-english
)

# --- Callback-Funktion für Messages ---
def callback(ch, method, properties, body):
    try:
        event = json.loads(body)
        event_type = event.get("event")
        post_id = event.get("post_id")
        text = event.get("text", "")

        if event_type != "POST":
            logging.info(f"Ignoring event type: {event_type}")
            return

        if not post_id or not text:
            logging.warning(f"Invalid POST event received: {event}")
            return

        label_map = {
            "LABEL_0": "NEGATIVE",
            "LABEL_1": "NEUTRAL",
            "LABEL_2": "POSITIVE"
        }

        sentiment_result = classifier(text, truncation=True, max_length=100)[0] # {'label': 'POSITIVE', 'score': 0.99}
        sentiment = label_map.get(sentiment_result["label"], "PENDING")
        score = round(sentiment_result["score"], 3)  # optional für Confidence

        logging.info(f"Post {post_id} sentiment: {sentiment_result}")

        # --- update post-table with sentiment values ---
        success = update_post_sentiment(
            post_id=post_id,
            sentiment=sentiment,
            sentiment_score=score
        )

        if not success:
            logging.warning(f"Post {post_id} not found in DB")

    except Exception as e:
        logging.error(f"Error processing message: {e}")

    finally:
        ch.basic_ack(delivery_tag=method.delivery_tag)


# --- Message Consumption starten ---
# --- Main loop ---
def main():
    # Get RabbitMQ queue name from environment
    rabbitmq_queue = os.getenv("RABBITMQ_QUEUE")

    if not rabbitmq_queue:
        logging.error("RABBITMQ_QUEUE is not set. Exiting.")
        return

    connection, channel = connect_rabbit()
    channel.basic_qos(prefetch_count=1)
    channel.basic_consume(queue=rabbitmq_queue, on_message_callback=callback)
    logging.info(f" [*] Waiting for messages in queue: {rabbitmq_queue}. To exit press CTRL+C")
    channel.start_consuming()

if __name__ == "__main__":
    main()
