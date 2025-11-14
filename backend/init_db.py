# backend/init_db.py
import os
import time
from sqlalchemy.exc import OperationalError
from sqlmodel import SQLModel, create_engine
from backend.models.user import User # do not delete this line!!!
from backend.models.post import Post # do not delete this line!!!

# PostgreSQL connection URL
default_url = "postgresql+psycopg2://ssma_admin:ssma_2025@localhost/ssma_db"

DATABASE_URL = os.getenv("DATABASE_URL", default_url)
# print(f"############################ {DATABASE_URL} #############################")
# https://docs.github.com/de/actions/tutorials/use-containerized-services/create-postgresql-service-containers

engine = create_engine(DATABASE_URL, echo=True)

def init_db():
    SQLModel.metadata.create_all(engine)
    print("PostgreSQL database and tables created successfully!")

init_db()