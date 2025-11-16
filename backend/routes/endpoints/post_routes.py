import os
import yaml
from fastapi import APIRouter, Form, HTTPException
from backend.routes.crud.post_crud import get_all_posts, get_posts_by_user_id, get_post_by_id, get_posts_by_query, create_post, update_post, delete_post
from backend.models.post import Post as PostModel
from typing import List, Optional


post_router = APIRouter(prefix="/posts", tags=["Posts"])

# get all posts
@post_router.get("", response_model=List[PostModel], tags=["Posts"])
def posts_list():
    return get_all_posts()

# get posts by query (title or comment)
# /posts/search?query=...
@post_router.get("/search", response_model=List[PostModel], tags=["Posts"])
def posts_by_query(query: str):
    post = get_posts_by_query(query)
    if not post:
        raise HTTPException(status_code=404, detail="No posts found")
    return post


# get post by id
@post_router.get("/{post_id}", response_model=PostModel, tags=["Posts"])
def post_by_id(post_id: int):
    post = get_post_by_id(post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post


# get all posts by user
@post_router.get("/users/{user_id}", response_model=List[PostModel], tags=["Posts"])
def posts_by_user_id(user_id: int):
    post = get_posts_by_user_id(user_id)
    if not post:
        raise HTTPException(status_code=404, detail="User has no posts")
    return post



# create post
@post_router.post("", response_model=PostModel, tags=["Posts"])
async def create_post_api(
        user_id: int = Form(...),
        title: str = Form(...),
        comment: str = Form(...),
        img_path: str = Form(...)
):
    post = create_post(user_id, title, comment, img_path)
    return post


# update post
@post_router.put("/{post_id}", response_model=PostModel, tags=["Posts"])
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
@post_router.delete("/{post_id}", tags=["Posts"])
def delete_post_by_id(post_id: int):
    success = delete_post(post_id)
    if not success:
        raise HTTPException(status_code=404, detail="Post not found")
    return {"detail": "Post deleted successfully"}