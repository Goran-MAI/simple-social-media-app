# Use lightweight Python image
FROM python:3.11-slim
LABEL authors="Goran Janosevic (ai25m030)"

WORKDIR /app

COPY requirements.txt .

# install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# copy service into  /app/text_generator_service
COPY text_generator_service/ /app/text_generator_service

# start uvicorn
CMD ["uvicorn", "text_generator_service.text_generator:app", "--host", "0.0.0.0", "--port", "8001"]
