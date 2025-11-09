# backend/init_db.py
from sqlmodel import SQLModel, create_engine
from backend.models.user import User
from backend.models.post import Post

# PostgreSQL connection URL
DATABASE_URL = "postgresql+psycopg2://ssma_admin:ssma_2025@localhost/ssma_db"

# Create database engine
engine = create_engine(DATABASE_URL, echo=True)  # echo=True zeigt SQL-Statements

# Create all tables defined in SQLModel metadata
SQLModel.metadata.create_all(engine)

print("PostgreSQL database and tables created successfully!")
