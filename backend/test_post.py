# tests/test_post.py
import sys, os
from datetime import datetime
from zoneinfo import ZoneInfo

current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(current_dir, ".."))
sys.path.append(project_root)

import pytest
from sqlmodel import Session, select
from sqlalchemy import text

from backend.init_db import engine
from backend.models.user import User
from backend.models.post import Post

@pytest.fixture(name="session")
def session_fixture():
    """Creates a fresh session and cleans up test data afterwards."""
    with Session(engine) as session:
        yield session

        # ensure session is usable after Foreign Key test
        session.rollback()
        
        # Cleanup dummy test data
        session.exec(text("DELETE FROM post WHERE title LIKE 'dummy%'"))
        session.exec(text("DELETE FROM post WHERE comment LIKE 'dummy%'"))
        session.exec(text("DELETE FROM post WHERE img_path LIKE 'https://dummy%'"))
        session.exec(text("DELETE FROM \"user\" WHERE username LIKE 'dummy%'"))
        session.commit()

def create_test_user(session: Session) -> User:
    """Helper function to ensure each test has a valid user."""
    user = User(
        username="dummy_user",
        name="Test",
        surname="User",
        email="dummy_user@test.com",
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

def test_create_post(session: Session):
    
    user = create_test_user(session)

    post = Post(
        title="dummy_post",
        comment="dummy_comment",
        img_path="https://dummy.img/test.png",
        user_id=user.id,
    )

    session.add(post)
    session.commit()
    session.refresh(post)

    assert post.id is not None
    assert post.user_id == user.id
    assert isinstance(post.creation_date, datetime)


def test_read_posts_by_user(session: Session):
    
    user = create_test_user(session)

    post1 = Post(title="dummy1", comment="dummy1", img_path="https://dummy1", user_id=user.id)
    post2 = Post(title="dummy2", comment="dummy2", img_path="https://dummy2", user_id=user.id)

    session.add(post1)
    session.add(post2)
    session.commit()

    posts = session.exec(select(Post).where(Post.user_id == user.id)).all()

    assert len(posts) >= 2
    assert any(p.title == "dummy1" for p in posts)
    assert any(p.title == "dummy2" for p in posts)


def test_update_post(session: Session):
    
    user = create_test_user(session)

    post = Post(
        title="dummy_update",
        comment="before update",
        img_path="https://dummy.update",
        user_id=user.id
    )

    session.add(post)
    session.commit()
    session.refresh(post)

    # Update fields
    post.comment = "after update"
    post.update_date = datetime.now(tz=ZoneInfo("Europe/Vienna"))
    session.add(post)
    session.commit()

    updated = session.exec(select(Post).where(Post.id == post.id)).first()

    assert updated is not None
    assert updated.comment == "after update"
    assert updated.update_date is not None


def test_delete_post(session: Session):
    
    user = create_test_user(session)

    post = Post(
        title="dummy_delete",
        comment="dummy_delete",
        img_path="https://dummy.delete",
        user_id=user.id
    )

    session.add(post)
    session.commit()
    session.refresh(post)

    session.delete(post)
    session.commit()

    deleted = session.exec(select(Post).where(Post.id == post.id)).first()
    assert deleted is None


def test_post_requires_user(session: Session):

    post = Post(
        title="dummy_fail",
        comment="dummy_fail",
        img_path="https://dummy.fail",
        user_id=999999  # invalid
    )

    session.add(post)

    with pytest.raises(Exception):
        session.commit()