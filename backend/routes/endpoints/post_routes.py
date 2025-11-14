import os
import yaml
from fastapi import FastAPI, Form, HTTPException
from backend.init_db import init_db
from backend.routes.crud.post_crud import get_all_posts, get_posts_by_user_id, get_post_by_id, get_posts_by_query, create_post, update_post, delete_post
from backend.models.post import Post as PostModel
from typing import List, Optional


app = FastAPI(
    title="Simple Social Media API",
    description="This is an API for a small project called 'Simple Social Media', which is being developed as part of the 'Software Engineering' course.",
    version="0.1",)



@app.on_event("startup")
def on_startup():
    init_db()

    openapi_schema = app.openapi()  # export open api-spec as python-dict
    folder_path = "./backend/routes/doc/"
    os.makedirs(folder_path, exist_ok=True)
    yaml_file_path = os.path.join(folder_path, "openapi_post_spec.yaml")

    with open(yaml_file_path, "w") as file:
        yaml.dump(openapi_schema, file, default_flow_style=False)  # save api spec as YAML
    print("OpenAPI-spec for POST written to {} successfully".format(yaml_file_path))

# get all posts
@app.get("/posts/", response_model=List[PostModel], tags=["Posts"])
def posts_list():
    return get_all_posts()

# get posts by query (title or comment)
# /posts/search?query=...
@app.get("/posts/search", response_model=List[PostModel], tags=["Posts"])
def posts_by_query(query: str):
    post = get_posts_by_query(query)
    if not post:
        raise HTTPException(status_code=404, detail="No posts found")
    return post


# get post by id
@app.get("/posts/{post_id}", response_model=PostModel, tags=["Posts"])
def post_by_id(post_id: int):
    post = get_post_by_id(post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post


# get all posts by user
@app.get("/users/{user_id}/posts", response_model=List[PostModel], tags=["Posts"])
def posts_by_user_id(user_id: int):
    post = get_posts_by_user_id(user_id)
    if not post:
        raise HTTPException(status_code=404, detail="User has no posts")
    return post



# create post
@app.post("/posts/", response_model=PostModel, tags=["Posts"])
async def create_post_api(
        user_id: int = Form(...),
        title: str = Form(...),
        comment: str = Form(...),
        img_path: str = Form(...)
):
    post = create_post(user_id, title, comment, img_path)
    return post


# update post
@app.put("/posts/{post_id}", response_model=PostModel, tags=["Posts"])
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
@app.delete("/posts/{post_id}", tags=["Posts"])
def delete_post_by_id(post_id: int):
    success = delete_post(post_id)
    if not success:
        raise HTTPException(status_code=404, detail="Post not found")
    return {"detail": "Post deleted successfully"}