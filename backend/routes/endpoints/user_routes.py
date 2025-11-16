import os
import yaml
from fastapi import FastAPI, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from backend.init_db import init_db
from backend.routes.crud.user_crud import get_user_by_id, get_user_by_username, get_all_users, create_user, delete_user, get_user_by_query
from backend.models.user import User as UserModel
from typing import List

app = FastAPI(
    title="Simple Social Media API",
    description="This is an API for a small project called 'Simple Social Media', which is being developed as part of the 'Software Engineering' course.",
    version="0.1",)

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.on_event("startup")
def on_startup():
    init_db()

    openapi_schema = app.openapi()  # export open api-spec as python-dict
    folder_path = "./backend/routes/doc/"
    os.makedirs(folder_path, exist_ok=True)
    yaml_file_path = os.path.join(folder_path, "openapi_user_spec.yaml")

    with open(yaml_file_path, "w") as file:
        yaml.dump(openapi_schema, file, default_flow_style=False)  # save api spec as YAML
    print("OpenAPI-spec for USER written to {} successfully".format(yaml_file_path))

# List all users
@app.get("/users/", response_model=List[UserModel], tags=["Users"])
def users_list():
    return get_all_users()

# get user by query (username, name or surname)
# /users/search?query=...
@app.get("/users/search", response_model=List[UserModel], tags=["Users"])
def users_by_query(query: str):
    user = get_user_by_query(query)
    if not user:
        raise HTTPException(status_code=404, detail="No posts found")
    return user

# Get user by ID
@app.get("/users/{user_id}", response_model=UserModel, tags=["Users"])
def user_by_id(user_id: int):
    user = get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# Optional: Get user by surname, name
@app.get("/users/username/{username}", response_model=UserModel, tags=["Users"])
def user_by_name(username: str):
    user = get_user_by_username(username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# Create a new user
@app.post("/users/", response_model=UserModel, tags=["Users"])
async def user_create(
    username: str = Form(...),
    name: str = Form(...),
    surname: str = Form(...),
    email: str = Form(...)
):
    print("Creating user with:", username, name, surname, email)
    user = create_user(username, name, surname, email)
    return user

# Delete a user by ID
@app.delete("/users/{user_id}", tags=["Users"])
def user_delete_by_id(user_id: int):
    success = delete_user(user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return {"detail": "User deleted successfully"}