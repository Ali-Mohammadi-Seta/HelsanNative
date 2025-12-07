#!/bin/bash
set -e

echo "Building Docker image with tag: $IMAGE"
docker buildx build --build-arg VITE_API_URL="${VITE_API_URL}" \
                 --build-arg VITE_PROJECT_VERSION="${VITE_PROJECT_VERSION}" \
                 --build-arg VITE_BEHDASHT_CALLBACK_URL="${VITE_BEHDASHT_CALLBACK_URL}" \
                 -t "$IMAGE" . --push 