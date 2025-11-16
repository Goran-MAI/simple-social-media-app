from sqlmodel import Session, select
from backend.models.user import User
from backend.init_db import engine
from typing import List, Optional

def create_user(username: str, name: str, surname: str, email: str):
    user = User(username=username, name=name, surname=surname, email=email)
    with Session(engine) as session:
        session.add(user)
        session.commit()
        session.refresh(user)
    return user

# get user by query (username, name or surname)
def get_user_by_query(query: str) -> List[User]:
    with Session(engine) as session:
        statement = select(User).where(
            (User.username.ilike(f"%{query}%")) | (User.name.ilike(f"%{query}%")) | (User.surname.ilike(f"%{query}%"))
        )
        return session.exec(statement).all()

def get_user_by_id(user_id: int) -> Optional['User']:
    with Session(engine) as session:
        return session.get(User, user_id)

def get_user_by_username(username: str) -> Optional['User']:
    with Session(engine) as session:
        return session.exec(select(User).where(User.username == username)).first()

def get_all_users() -> List['User']:
    with Session(engine) as session:
        return session.exec(select(User)).all()

def delete_user(user_id: int) -> bool:
    with Session(engine) as session:
        user = session.get(User, user_id)
        if user:
            session.delete(user)
            session.commit()
            return True
    return False

