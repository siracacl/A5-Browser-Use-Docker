FROM python:3.11-slim

# Install system dependencies for Chromium
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    unzip \
    curl \
    xvfb \
    chromium \
    chromium-driver \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libatspi2.0-0 \
    libdrm2 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    libu2f-udev \
    libvulkan1 \
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
