# backend/routes/endpoints/user_routes.py
from fastapi import APIRouter, Form, HTTPException
from backend.init_db import init_db
from backend.routes.crud.user_crud import (
    get_user_by_id,
    get_user_by_username,
    get_all_users,
    create_user,
    update_user,
    delete_user,
    get_user_by_query
)
from backend.models.user import User as UserModel
from typing import List, Optional

router = APIRouter(tags=["Users"])

# List all users
@router.get("/", response_model=List[UserModel])
def users_list():
    return get_all_users()

# get user by query (username, name or surname)
@router.get("/search", response_model=List[UserModel])
def users_by_query(query: str):
    user = get_user_by_query(query)
    if not user:
        raise HTTPException(status_code=404, detail="No users found")
    return user

# Get user by ID
@router.get("/id/{user_id}", response_model=UserModel)
def user_by_id(user_id: int):
    user = get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# Get user by username
@router.get("/username/{username}", response_model=UserModel)
def user_by_name(username: str):
    user = get_user_by_username(username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# Create a new user
@router.post("/", response_model=UserModel)
async def user_create(
    username: str = Form(...),
    name: str = Form(...),
    surname: str = Form(...),
    email: str = Form(...),
):
    user = create_user(username, name, surname, email)
    return user

# PUT /users/{user_id} → update user
@router.put("/{user_id}", response_model=UserModel)
async def update_user_api(
    user_id: int,
    email: Optional[str] = Form(None),
    surname: Optional[str] = Form(None)
):
    user = update_user(user_id, email=email, surname=surname)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# Delete a user by ID
@router.delete("/{user_id}")
def user_delete_by_id(user_id: int):
    success = delete_user(user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return {"detail": "User deleted successfully"}
