FROM python:3.11-slim

# Install system dependencies for Chrome
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    unzip \
    curl \
    xvfb \
    && rm -rf /var/lib/apt/lists/*

# Install Google Chrome
RUN wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list \
    && apt-get update \
    && apt-get install -y google-chrome-stable \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements and install Python dependencies
COPY Python_server/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the Python server code
COPY Python_server/ .

# Create a non-root user for security
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

# Expose the port
EXPOSE 8888

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV DISPLAY=:99

# Start Xvfb and the application
CMD ["sh", "-c", "Xvfb :99 -screen 0 1024x768x24 & uvicorn main:app --host 0.0.0.0 --port 8888"]
