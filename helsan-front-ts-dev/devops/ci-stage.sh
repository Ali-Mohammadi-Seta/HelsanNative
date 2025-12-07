#!/bin/bash
set -e

echo "Building Docker image with tag: $IMAGE and build arg -- VITE_API_URL=$VITE_API_URL --- --VITE_BEHDASHT_CALLBACK_URL=$VITE_BEHDASHT_CALLBACK_URL"

docker buildx build -t "$IMAGE" --build-arg VITE_API_URL=$VITE_API_URL  --build-arg VITE_BEHDASHT_CALLBACK_URL=$VITE_BEHDASHT_CALLBACK_URL -f Dockerfile . --push
