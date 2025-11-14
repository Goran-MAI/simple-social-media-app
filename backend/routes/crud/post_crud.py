from sqlmodel import Session, select
from backend.models.post import Post
from backend.init_db import engine
from typing import List, Optional
from datetime import datetime
from zoneinfo import ZoneInfo  # Python 3.9+
from sqlmodel import SQLModel, Field, Relationship

# get all posts
def get_all_posts() -> List['Post']:
    with Session(engine) as session:
        return session.exec(select(Post)).all()

# get all posts by user
def get_posts_by_user_id(user_id: int) -> List[Post]:
    with Session(engine) as session:
        return session.exec(select(Post).where(Post.user_id == user_id)).all()

# get posts by query (title or comment)
def get_posts_by_query(query: str) -> List[Post]:
    with Session(engine) as session:
        statement = select(Post).where(
            (Post.title.ilike(f"%{query}%")) | (Post.comment.ilike(f"%{query}%"))
        )
        return session.exec(statement).all()

# get post by id
def get_post_by_id(post_id: int) -> Optional['Post']:
    with Session(engine) as session:
        return session.get(Post, post_id)



# create post
def create_post(user_id: int, title: str, comment: str, img_path: str) -> Post:
    post = Post(
        user_id=user_id,
        title=title,
        comment=comment,
        img_path=img_path
    )
    with Session(engine) as session:
        session.add(post)
        session.commit()
        session.refresh(post)
    return post

# update post
def update_post(post_id: int, title: Optional[str] = None, comment: Optional[str] = None,
                img_path: Optional[str] = None) -> Optional[Post]:
    with Session(engine) as session:
        post = session.get(Post, post_id)

        # check if post exists
        if not post:
            return None

        # update cols if param values are not none
        if title is not None:
            post.title = title
        if comment is not None:
            post.comment = comment
        if img_path is not None:
            post.img_path = img_path

        # set update_date
        post.update_date = datetime.now(tz=ZoneInfo("Europe/Vienna"))

        # save changes to db
        session.add(post)
        session.commit()
        session.refresh(post)

        return post


# delete post by post_id
def delete_post(post_id: int) -> bool:
    with Session(engine) as session:
        post = session.get(Post, post_id)
        if post:
            session.delete(post)
            session.commit()
            return True
    return False