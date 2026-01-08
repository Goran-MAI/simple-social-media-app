FROM python:3.11-slim
LABEL authors="Goran Janosevic (ai25m030)"

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
# Python soll /app als Root kennen
ENV PYTHONPATH=/app

# System deps (psycopg2, torch)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Torch CPU (wichtig!)
RUN pip install --no-cache-dir torch==2.9.1

# Requirements installieren
COPY sentiment_service/sentiment_requirements.txt .
RUN pip install --no-cache-dir -r sentiment_requirements.txt

# Backend + Sentiment-Service kopieren
COPY backend/models/ backend/models/
COPY backend/routes/crud/posts_crud.py backend/routes/crud/posts_crud.py
COPY backend/init_db.py backend/init_db.py


# Sentiment-Service
COPY sentiment_service/ sentiment_service/

# Start
CMD ["python", "sentiment_service/sentimentalizer.py"]
