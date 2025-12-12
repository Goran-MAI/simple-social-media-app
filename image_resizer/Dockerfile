# Use lightweight Python image
FROM python:3.11-slim

WORKDIR /app/image_resizer

# Copy requirements from project root
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy image_resizer code
COPY image_resizer/ /app/image_resizer

# Set entrypoint to run the resizer worker
CMD ["python", "resizer.py"]