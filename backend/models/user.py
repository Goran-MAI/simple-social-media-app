# backend/models/user.py
from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship
from post import Post

class User(SQLModel, table=True):
    id: Optional[int] =  Field(default=None, primary_key=True)
    username: str
    name: str
    surname: str
    email: str

    # One-to-many relationship: one user can have many posts
    posts: List["Post"] = Relationship(back_populates="user")

