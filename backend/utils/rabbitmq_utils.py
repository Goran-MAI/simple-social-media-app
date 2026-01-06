import os
import pika
import time
import logging
import json

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

RABBITMQ_DEFAULT_USER = os.getenv("RABBITMQ_DEFAULT_USER")
RABBITMQ_DEFAULT_PASS = os.getenv("RABBITMQ_DEFAULT_PASS")
RABBITMQ_QUEUE = os.getenv("RABBITMQ_QUEUE")
RABBITMQ_PORT = os.getenv("RABBITMQ_PORT")
RABBITMQ_HOST= os.getenv("RABBITMQ_HOST")

# --- Low-level RabbitMQ sender ---
def send_message(queue_name: str, message: dict):
    retries = 5
    for _ in range(retries):
        try:
            credentials = pika.PlainCredentials(
                RABBITMQ_DEFAULT_USER,
                RABBITMQ_DEFAULT_PASS
            )

            connection = pika.BlockingConnection(
                pika.ConnectionParameters(
                    host=os.getenv("RABBITMQ_HOST"),  # Docker Compose Service-Name #host='localhost',
                    port=int(os.getenv("RABBITMQ_PORT")),
                    credentials=credentials
                )
            )

            channel = connection.channel()
            channel.queue_declare(queue=queue_name, durable=True)

            channel.basic_publish(
                exchange="",
                routing_key=queue_name,
                body=json.dumps(message),
                properties=pika.BasicProperties(
                    delivery_mode=2
                )
            )

            logging.info(f"Sent message to '{queue_name}': {message}")
            connection.close()
            return

        except pika.exceptions.AMQPConnectionError as e:
            logging.error(f"Connection error: {e}")
            time.sleep(5)
