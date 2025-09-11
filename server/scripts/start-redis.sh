#!/bin/bash

# Pull the latest redis image
source ../.env

docker pull redis

# Check if redis container already exists
if [ "$(docker ps -a -q -f name=redis)" ]; then
  # Start the container if it exists but is not running
  if [ ! "$(docker ps -q -f name=redis)" ]; then
    echo "Starting existing Redis container..."
    docker start redis
  else
    echo "Redis container is already running."
  fi
else
  # Create and start a new Redis container
  echo "Creating and starting Redis container..."
  docker run --name redis -p $REDIS_PORT:6379 -d redis --requirepass $redisPassword
fi

echo "Redis is now available on port 6379"