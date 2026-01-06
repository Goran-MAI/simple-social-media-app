FROM python:3.11-slim

WORKDIR /app

# Python soll /app als Root kennen
ENV PYTHONPATH=/app

# Requirements installieren
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Backend + Sentiment-Service kopieren
COPY backend/ /app/backend
COPY sentiment_service/ /app/sentiment_service

# Start
CMD ["python", "sentiment_service/sentimentalizer.py"]
