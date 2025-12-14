import os
import pika
import time
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

RABBITMQ_DEFAULT_USER = os.getenv("RABBITMQ_DEFAULT_USER")
RABBITMQ_DEFAULT_PASS = os.getenv("RABBITMQ_DEFAULT_PASS")
RABBITMQ_QUEUE = os.getenv("RABBITMQ_QUEUE")
RABBITMQ_PORT = os.getenv("RABBITMQ_PORT")

def send_to_queue(filename: str):
    retries = 5
    for _ in range(retries):
        try:
#            print("#######################", RABBITMQ_USER, "####", RABBITMQ_PASS, "####",
#                  RABBITMQ_QUEUE, '####', RABBITMQ_HOST, '####', RABBITMQ_PORT, "#########################")
            credentials = pika.PlainCredentials(RABBITMQ_DEFAULT_USER, RABBITMQ_DEFAULT_PASS)
            connection = pika.BlockingConnection(
                pika.ConnectionParameters(
                    host='localhost',
                    credentials=credentials
                )
            )
            channel = connection.channel()
            channel.queue_declare(queue=RABBITMQ_QUEUE, durable=True)
            channel.basic_publish(
                exchange='',
                routing_key=RABBITMQ_QUEUE,
                body=filename,
                properties=pika.BasicProperties(
                    delivery_mode=2,  # persistent message
                )
            )
            logging.info(f"Sent file '{filename}' to the queue")
            connection.close()
            break  # Exit the loop if the connection is successful.

        except pika.exceptions.AMQPConnectionError as e:
            logging.error(f"Connection error: {e}")
            time.sleep(5)  # Warten und erneut versuchen
        except Exception as e:
            logging.error(f"Failed to send message: {e}")
            break  # Bei anderen Fehlern die Schleife beenden

