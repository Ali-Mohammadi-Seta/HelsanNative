#!/bin/bash
set -e

echo "Building Docker image with tag: $IMAGE_NAME"
docker buildx build --build-arg VITE_API_URL="https://inhs.ir/api" \
                 --build-arg VITE_SOCKET_DOMAIN="https://inhs.ir" \
                 --build-arg VITE_PROJECT_VERSION="1.0.0" \
                 -t "$IMAGE_NAME" . --push 