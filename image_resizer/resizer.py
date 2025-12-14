import os
import pika
from PIL import Image
import logging

# --- Configuration ---
UPLOAD_DIR = "/app/backend/uploads"

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")


# --- Ensure upload directory exists ---
os.makedirs(UPLOAD_DIR, exist_ok=True)

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


# --- Image resize function ---
def create_small_image(filename):
    original_path = os.path.join(UPLOAD_DIR, filename)
    name, ext = os.path.splitext(filename)
    small_path = os.path.join(UPLOAD_DIR, f"{name}_small{ext}")

    if not os.path.exists(original_path):
        logging.warning(f"Original image not found: {original_path}")
        return

#    try:
#        with Image.open(original_path) as img:
#            # save color mode
#            img = img.convert("RGB")
#
#            # Calculate new image-size to 25% of the original size
#            width, height = img.size
#            new_width = max(1, int(width * 0.25))
#            new_height = max(1, int(height * 0.25))
#            new_size = (new_width, new_height)

#            # Scale image down.
#            img_resized = img.resize(new_size, Image.Resampling.LANCZOS)

#            # Speichere das Bild
#            img_resized.save(small_path)
#        logging.info(f"Created small image: {small_path}")
#    except Exception as e:
#        logging.error(f"Failed to resize {filename}: {e}")

    try:
        with Image.open(original_path) as img:
            img = img.convert("RGB")

            max_size = (250, 10000)  # Breite = 250px, Höhe unbeschränkt
            img.thumbnail(max_size, Image.Resampling.LANCZOS)

            img.save(small_path)

            logging.info(f"Created small image: {small_path}")
    except Exception as e:
        logging.error(f"Failed to resize {filename}: {e}")




# --- Callback for RabbitMQ messages ---
def callback(ch, method, properties, body):
    filename = body.decode()
    logging.info(f"Received message for image: {filename}")
    create_small_image(filename)
    ch.basic_ack(delivery_tag=method.delivery_tag)

# --- Main loop ---
def main():
    # Get RabbitMQ queue name from environment
    rabbitmq_queue = os.getenv("RABBITMQ_QUEUE")  # Default to "image_resize" if not set

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

