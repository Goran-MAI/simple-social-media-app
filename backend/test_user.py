# tests/test_user.py
import sys, os
from datetime import datetime

current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(current_dir, ".."))
sys.path.append(project_root)

import pytest
from sqlmodel import Session, select
from sqlalchemy import text

from backend.init_db import engine
from backend.models.user import User

@pytest.fixture(name="session")
def session_fixture():
    """Open a new session for each test and clean up afterwards."""
    with Session(engine) as session:
        yield session
        # Cleanup dummy data
        session.exec(text('DELETE FROM "user" WHERE username LIKE \'dummy%\''))  
        session.commit()


def test_read_users(session: Session):
    user1 = User(username="dummy_read1", name="A", surname="B", email="read1@test.com")
    user2 = User(username="dummy_read2", name="A", surname="B", email="read2@test.com")

    session.add(user1)
    session.add(user2)
    session.commit()

    users = session.exec(select(User)).all()

    assert len(users) >= 2
    assert any(u.username == "dummy_read1" for u in users)
    assert any(u.username == "dummy_read2" for u in users)


def test_update_user(session: Session):
    user = User(
        username="dummy_update",
        name="Original",
        surname="User",
        email="update@test.com"
    )
    session.add(user)
    session.commit()
    session.refresh(user)

    user.name = "UpdatedName"
    user.surname = "UpdatedSurname"
    session.add(user)
    session.commit()

    updated = session.exec(select(User).where(User.id == user.id)).first()

    assert updated is not None
    assert updated.name == "UpdatedName"
    assert updated.surname == "UpdatedSurname"


def test_delete_user(session: Session):
    user = User(
        username="dummy_delete",
        name="Delete",
        surname="Me",
        email="delete@test.com"
    )

    session.add(user)
    session.commit()
    session.refresh(user)

    session.delete(user)
    session.commit()

    result = session.exec(select(User).where(User.id == user.id)).first()

    assert result is None