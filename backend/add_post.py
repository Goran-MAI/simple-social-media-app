# backend/add_post.py
# script execution: python -m backend.add_post


from sqlmodel import Session, select
from backend.models.user import User
from backend.models.post import Post
from datetime import datetime
from backend.init_db import engine  # <-- reuse engine

# Start session
with Session(engine) as session:
    # example: add user (if it does not already exist)
    user = session.exec(select(User).where(User.username == "Goggy")).first()
    if not user:
        user = User(username="Goggy", name="Goran", surname="Janosevic", email="ai25m030@technikum-wien.at")
        session.add(user)
        session.commit()
        session.refresh(user)  # returns ID from db

    # add some example posts
    posts_data = [
        {"title": "Hello World", "comment": "My first post!", "img_path": "uploads/kanban_grey.png"},
        {"title": "Second Post", "comment": "I really like SQLModel.", "img_path": "uploads/frozen_reports_grey.png"},
        {"title": "Third Post", "comment": "Once again. I. REALLY. LIKE. SQLMODEL.", "img_path": "uploads/handshake_grey.png"},
    ]

    for post_data in posts_data:
        post = Post(
            title=post_data["title"],
            comment=post_data["comment"],
            img_path=post_data["img_path"],
            user_id=user.id
        )
        session.add(post)
    session.commit()

    # Select last post after inserts
    last_post = session.exec(
        select(Post).where(Post.user_id == user.id).order_by(Post.creation_date.desc())
    ).first()

    print("\nLast post:")
    print(f"ID: {last_post.id}, title: {last_post.title}, date: {last_post.creation_date}, Img-Path: {last_post.img_path}")