from fastapi import FastAPI, Form, HTTPException
from ..init_db import init_db
from .user_crud import get_user_by_id, get_user_by_username, get_all_users, create_user, delete_user
from ..models.user import User as UserModel
from typing import List

app = FastAPI(title="Simple Social Media API")

@app.on_event("startup")
def on_startup():
    init_db()

# List all users
@app.get("/users/", response_model=List[UserModel])
def users_list():
    return get_all_users()

# Get user by ID
@app.get("/users/{user_id}", response_model=UserModel)
def user_by_id(user_id: int):
    user = get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# Optional: Get user by surname, name, or email
@app.get("/users/username/{username}", response_model=UserModel)
def user_by_name(username: str):
    user = get_user_by_username(username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# Create a new user
@app.post("/users/", response_model=UserModel)
async def user_create(
    username: str = Form(...),
    name: str = Form(...),
    surname: str = Form(...),
    email: str = Form(...)
):
    user = create_user(username, name, surname, email)
    return user

# Delete a user by ID
@app.delete("/users/{user_id}")
def user_delete_by_id(user_id: int):
    success = delete_user(user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return {"detail": "User deleted successfully"}