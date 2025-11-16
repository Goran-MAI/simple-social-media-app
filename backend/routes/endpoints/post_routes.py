# backend/routes/endpoints/post_routes.py
from fastapi import APIRouter, Form, HTTPException
import os, yaml
from backend.init_db import init_db
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


# get all posts
@router.get("/", response_model=List[PostModel])
def posts_list():
    return get_all_posts()

# get posts by query
@router.get("/search", response_model=List[PostModel])
def posts_by_query(query: str):
    post = get_posts_by_query(query)
    if not post:
        raise HTTPException(status_code=404, detail="No posts found")
    return post

# get post by id
@router.get("/{post_id}", response_model=PostModel)
def post_by_id(post_id: int):
    post = get_post_by_id(post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

# get all posts by user
@router.get("/user/{user_id}", response_model=List[PostModel])
def posts_by_user_id(user_id: int):
    post = get_posts_by_user_id(user_id)
    if not post:
        raise HTTPException(status_code=404, detail="User has no posts")
    return post

# create post
@router.post("/", response_model=PostModel)
async def create_post_api(
        user_id: int = Form(...),
        title: str = Form(...),
        comment: str = Form(...),
        img_path: str = Form(...)
):
    post = create_post(user_id, title, comment, img_path)
    return post

# update post
@router.put("/{post_id}", response_model=PostModel)
async def update_post_api(
        post_id: int,
        title: Optional[str] = Form(None),
        comment: Optional[str] = Form(None),
        img_path: Optional[str] = Form(None)
):
    post = update_post(
        post_id=post_id,
        title=title,
        comment=comment,
        img_path=img_path
    )
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

# delete post by post_id
@router.delete("/{post_id}")
def delete_post_by_id(post_id: int):
    success = delete_post(post_id)
    if not success:
        raise HTTPException(status_code=404, detail="Post not found")
    return {"detail": "Post deleted successfully"}
