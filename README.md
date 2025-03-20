# Clone the project repository
[git clone https://github.com/yourusername/your-web-application.git](https://github.com/huylx222/sit737-2025-prac4c)
cd your-web-application (sit737-2025-prac4c)

# Create the Dockerfile

# Build the Docker image
docker build -t lehuy222/calculator-app:5.1p .

# Create a Docker Compose file
version: '3.8'
services:
  calculator-app:
    image: lehuy222/calculator-app:5.1p
    ports:
      - "3000:3000"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      retries: 3
      start_period: 30s
      timeout: 10s
      
# Start the Docker Compose environment
docker-compose up -d

# Test the application
curl http://localhost:3000

# Push the Docker image to Docker Hub
docker push lehuy222/calculator-app:5.1p
