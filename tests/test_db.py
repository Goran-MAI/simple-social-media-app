# tests/test_db.py
# script execution: pytest tests/test_db.py -v

import pytest
from datetime import datetime, timedelta
from sqlmodel import Session, select

from backend.init_db import engine
from backend.models.user import User
from backend.models.post import Post
from sqlalchemy import text


@pytest.fixture(name="session")
def session_fixture():
    """Open a new session for each test and roll back after the test."""
    with Session(engine) as session:
        yield session
        # Cleanup test data
        session.exec(text("DELETE FROM post WHERE comment LIKE 'Dummy%'"))
        session.exec(text('DELETE FROM "user" WHERE username LIKE \'dummy%\''))
        session.commit()
        session.commit()


def test_create_user_and_posts(session: Session):
    # Create a new user
    user = User(
        username="dummy",
        name="dummy",
        surname="dummy",
        email="dummy@technikum-wien.at"
    )
    session.add(user)
    session.commit()
    session.refresh(user)  # ensure ID is available after commit

    # Insert multiple posts
    now = datetime.now()
    posts = [
        Post(title="First Dummy", comment="Dummy1", img_path="https://example.com/dummy1.png", post_date=now - timedelta(days=2), user_id=user.id),
        Post(title="Second Dummy", comment="Dummy2", img_path="https://example.com/dummy2.png", post_date=now - timedelta(days=1), user_id=user.id),
        Post(title="Third Dummy", comment="Dummy3", img_path="https://example.com/dummy3.png", post_date=now, user_id=user.id)
    ]
    session.add_all(posts)
    session.commit()

    # Retrieve the last post based on post_date
    last_post = session.exec(
        select(Post).where(Post.user_id == user.id).order_by(Post.post_date.desc())
    ).first()

    assert last_post is not None
    assert last_post.title == "Third Dummy"
    assert last_post.comment.startswith("Dummy3")

    # Optional: returning last post
    print(f"Last post from {user.username}: {last_post.title} ({last_post.post_date})")


def test_create_user(session: Session):
    # Create a new user
    user = User(username="dummy2", name="dummy2", surname="dummy2", email="dummy2@domain.com")
    session.add(user)
    session.commit()

    # Test: ensure users can be selected
    users = session.exec(select(User)).all()
    assert users is not None
    assert any(u.username.startswith("dummy") for u in users)

