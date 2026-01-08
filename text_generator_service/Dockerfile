# Use lightweight Python image
FROM python:3.11-slim
LABEL authors="Goran Janosevic (ai25m030)"

WORKDIR /app
ENV PYTHONPATH=/app
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# System dependencies für Torch
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Torch CPU
RUN pip install --no-cache-dir torch==2.9.1

# install dependencies
COPY text_generator_service/text_generator_requirements.txt .
RUN pip install --no-cache-dir -r text_generator_requirements.txt

# copy service into  /app/text_generator_service
COPY text_generator_service/ /app/text_generator_service

# start uvicorn
CMD ["uvicorn", "text_generator_service.text_generator:app", "--host", "0.0.0.0", "--port", "8001"]
