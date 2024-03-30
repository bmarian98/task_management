# Dockerfile for Flask app
FROM python:3.10-slim

# Set work directory
WORKDIR /usr/src

# Install dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy the Flask app code into the container
COPY . ./app

# Command to run the Flask app
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
# CMD ["python", "-m", "app"]
