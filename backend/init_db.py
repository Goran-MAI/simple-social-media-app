# backend/init_db.py
import os
import time
from sqlalchemy.exc import OperationalError
from sqlmodel import SQLModel, create_engine
from backend.models.user import User
from backend.models.post import Post

# PostgreSQL connection URL
# DATABASE_URL = "postgresql+psycopg2://ssma_admin:ssma_2025@localhost/ssma_db"

# Unterschiedliche URLs für lokal und CI
DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL is None:
    # lokal
    DATABASE_URL = "postgresql+psycopg2://ssma_admin:ssma_pass@localhost:5432/ssma_test"
else:
    # CI-Umgebung (GitHub Actions)
    DATABASE_URL = DATABASE_URL

engine = create_engine(DATABASE_URL, echo=True)

# Retry loop für GitHub Actions / CI (optional, schadet lokal nicht)
for i in range(30):
    try:
        with engine.connect():
            break
    except OperationalError:
        print("PostgreSQL not ready, retrying in 2s...")
        time.sleep(2)
else:
    raise RuntimeError("Cannot connect to PostgreSQL")

SQLModel.metadata.create_all(engine)
print("PostgreSQL database and tables created successfully!")