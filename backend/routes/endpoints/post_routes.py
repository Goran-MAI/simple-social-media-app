# backend/routes/endpoints/post_routes.py
from fastapi import APIRouter, Form, HTTPException, UploadFile, File
import shutil
import os
import pika
import logging
from backend.routes.crud.posts_crud import (
    get_all_posts,
    get_posts_by_user_id,
    get_post_by_id,
    get_posts_by_query,
    create_post,
    update_post,
    delete_post
)
from backend.models.post import Post as PostModel
from typing import List, Optional

router = APIRouter(tags=["Posts"])

def running_in_docker():
    return os.path.exists("/.dockerenv")

# Set upload directory depending on environment
UPLOAD_DIR = "/app/backend/uploads" if running_in_docker() else "backend/uploads"


# --- Send message to RabbitMQ ---
def send_to_queue(filename: str):
    RABBITMQ_HOST = os.getenv("RABBITMQ_HOST")
    RABBITMQ_PORT = int(os.getenv("RABBITMQ_PORT"))
    RABBITMQ_USER = os.getenv("RABBITMQ_USER")
    RABBITMQ_PASS = os.getenv("RABBITMQ_PASS")
    RABBITMQ_QUEUE = os.getenv("RABBITMQ_QUEUE")

#    print("#######################", RABBITMQ_USER, "###", RABBITMQ_PASS, "###",
#          RABBITMQ_QUEUE, "####", RABBITMQ_HOST, "####", RABBITMQ_PORT,
#          "#########################")

    if not RABBITMQ_USER or not RABBITMQ_PASS:
        raise RuntimeError("RabbitMQ credentials missing in backend!")

    credentials = pika.PlainCredentials(RABBITMQ_USER, RABBITMQ_PASS)

    try:
        connection = pika.BlockingConnection(
            pika.ConnectionParameters(
                host=RABBITMQ_HOST,
                port=RABBITMQ_PORT,
                credentials=credentials
            )
        )
        channel = connection.channel()
        channel.queue_declare(queue=RABBITMQ_QUEUE, durable=True)
        channel.basic_publish(
            exchange='',
            routing_key=RABBITMQ_QUEUE,
            body=filename,
            properties=pika.BasicProperties(delivery_mode=2)
        )
        logging.info(f"Sent '{filename}' to RabbitMQ queue '{RABBITMQ_QUEUE}'")
    except Exception as e:
        logging.error(f"Failed to send '{filename}' to RabbitMQ: {e}")
    finally:
        if 'connection' in locals() and connection.is_open:
            connection.close()



# --- CRUD endpoints ---

@router.get("/", response_model=List[PostModel])
def posts_list():
    return get_all_posts()


@router.get("/search", response_model=List[PostModel])
def posts_by_query(query: str):
    post = get_posts_by_query(query)
    if not post:
        raise HTTPException(status_code=404, detail="No posts found")
    return post


@router.get("/{post_id}", response_model=PostModel)
def post_by_id(post_id: int):
    post = get_post_by_id(post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post


@router.get("/user/{user_id}", response_model=List[PostModel])
def posts_by_user_id(user_id: int):
    post = get_posts_by_user_id(user_id)
    if not post:
        raise HTTPException(status_code=404, detail="User has no posts")
    return post

# --- Create Post ---
@router.post("/", response_model=PostModel)
async def create_post_api(
        user_id: int = Form(...),
        title: str = Form(...),
        comment: str = Form(...),
        img: UploadFile = File(None)
):
    img_path = ""

    if img:
        os.makedirs(UPLOAD_DIR, exist_ok=True)
        file_location = os.path.join(UPLOAD_DIR, img.filename)

        # Save original image
        with open(file_location, "wb") as f:
            shutil.copyfileobj(img.file, f)

        # relative path for frontend
        img_path = f"uploads/{img.filename}"

        # send filename to RabbitMQ for async resizing
        send_to_queue(img.filename)

    post = create_post(user_id, title, comment, img_path)


    return post


# --- Update Post ---
@router.put("/{post_id}", response_model=PostModel)
async def update_post_api(
        post_id: int,
        title: Optional[str] = Form(None),
        comment: Optional[str] = Form(None),
        img: Optional[UploadFile] = File(None)
):
    img_path = None

    if img:
        os.makedirs(UPLOAD_DIR, exist_ok=True)
        file_location = os.path.join(UPLOAD_DIR, img.filename)

        # Save new original image
        with open(file_location, "wb") as f:
            shutil.copyfileobj(img.file, f)

        img_path = f"uploads/{img.filename}"

        # send filename to RabbitMQ for async resizing
        send_to_queue(img.filename)

    post = update_post(post_id=post_id, title=title, comment=comment, img_path=img_path)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    return post


# --- Delete Post ---
@router.delete("/{post_id}")
def delete_post_by_id(post_id: int):
    success = delete_post(post_id)
    if not success:
        raise HTTPException(status_code=404, detail="Post not found")
    return {"detail": "Post deleted successfully"}
