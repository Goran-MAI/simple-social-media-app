# Use lightweight Python image
#FROM python:3.11-slim

#WORKDIR /app/backend

# Copy requirements from project root
##COPY requirements.txt .

# Install dependencies
#RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code to /app/backend
#COPY backend/ /app/backend

# Expose FastAPI port
#EXPOSE 8000

# Production-ready start command
#CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

# Use lightweight Python image
FROM python:3.11-slim

WORKDIR /app/backend

# Install PostgreSQL client (provides pg_isready)
RUN apt-get update && apt-get install -y postgresql-client && rm -rf /var/lib/apt/lists/*

# Copy requirements from project root
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ /app/backend

# Expose FastAPI port
EXPOSE 8000

# Start the backend app
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
