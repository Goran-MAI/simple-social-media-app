from fastapi import APIRouter, Form, HTTPException
from backend.routes.crud.user_crud import get_user_by_id, get_user_by_username, get_all_users, create_user, delete_user, get_user_by_query
from backend.models.user import User as UserModel
from typing import List


user_router = APIRouter(prefix="/users", tags=["Users"])

# List all users
@user_router.get("", response_model=List[UserModel], tags=["Users"])
def users_list():
    return get_all_users()

# get user by query (username, name or surname)
# /users/search?query=...
@user_router.get("/search", response_model=List[UserModel], tags=["Users"])
def users_by_query(query: str):
    user = get_user_by_query(query)
    if not user:
        raise HTTPException(status_code=404, detail="No posts found")
    return user

# Get user by ID
@user_router.get("/{user_id}", response_model=UserModel, tags=["Users"])
def user_by_id(user_id: int):
    user = get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# Optional: Get user by surname, name
@user_router.get("/username/{username}", response_model=UserModel, tags=["Users"])
def user_by_name(username: str):
    user = get_user_by_username(username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# Create a new user
@user_router.post("", response_model=UserModel, tags=["Users"])
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
@user_router.delete("/{user_id}", tags=["Users"])
def user_delete_by_id(user_id: int):
    success = delete_user(user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return {"detail": "User deleted successfully"}