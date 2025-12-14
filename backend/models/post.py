# backend/models/post.py
from typing import Optional, TYPE_CHECKING
from datetime import datetime
from zoneinfo import ZoneInfo  # Python 3.9+
from sqlmodel import SQLModel, Field, Relationship

if TYPE_CHECKING:
    from user import User

class Post(SQLModel, table=True):
    id: Optional[int] =  Field(default=None, primary_key=True)
    title: str
    comment: str
    img_path: str                   # original path
    img_small_path: Optional[str] = Field(default=None)   # small image path
    creation_date: datetime = Field(default_factory=lambda: datetime.now(tz=ZoneInfo("Europe/Vienna")))  # current Vienna time
    update_date: Optional[datetime] = None # update timestamp
    user_id: int = Field(foreign_key="user.id")  # relation to User

    # Many-to-one relationship: each post belongs to one user
    user: Optional["User"] = Relationship(back_populates="posts")