# Use lightweight official Python image
FROM python:3.12-slim

# Set working directory inside container
WORKDIR /app

# Install system dependencies required for pandas/scikit-learn if needed
RUN apt-get update && apt-get install -y --no-install-recommends build-essential

# Copy and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all code, models (.pkl), and datasets into the container
COPY . .

# Expose the Flask port
EXPOSE 5001

# Run the Flask app
CMD ["python", "app.py"]