# backend/routes/endpoints/post_routes.py
from fastapi import APIRouter, Form, HTTPException, UploadFile, File
import shutil
import os
import pika
import logging
from backend.utils.rabbitmq_utils import send_message
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

    # --- Create post in DB ---
    post = create_post(user_id, title, comment, img_path)

    # --- Send RabbitMQ event AFTER post is updated ---
    # For Image-Resizer
    if img:
        send_message("image_resize", {
            "event": "POST",
            "filename": img.filename,
            "post_id": post.id
        })

    # For Sentiment
    if comment:
        send_message("sentiment", {
            "event": "POST",
            "post_id": post.id,
            "text": comment
        })

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

    # --- Update post in DB ---
    post = update_post(post_id=post_id, title=title, comment=comment, img_path=img_path)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    # --- Send RabbitMQ event AFTER post is updated ---
    # For Image-Resizer
    if img:
        send_message("image_resize", {
            "event": "POST",
            "filename": img.filename,
            "post_id": post.id
        })

    # For Sentiment
    if comment:
        send_message("sentiment", {
            "event": "POST",
            "post_id": post.id,
            "text": comment
        })

    return post


# --- Delete Post ---
@router.delete("/{post_id}")
def delete_post_by_id(post_id: int):
    success = delete_post(post_id)
    if not success:
        raise HTTPException(status_code=404, detail="Post not found")
    return {"detail": "Post deleted successfully"}
