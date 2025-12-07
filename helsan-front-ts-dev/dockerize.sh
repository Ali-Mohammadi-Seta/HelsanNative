#!/bin/bash

# Script Title: Deployment Script
# Description: Deploys the application on Production or Development Zone HUB
# Usage: Run the script and choose between 'dev' or 'prod' mode

set -e  # Exit immediately if a command exits with a non-zero status

# Function to display an error and exit
function error_exit() {
    echo "❌ Error: $1"
    exit 1
}

# Function to prompt user for deployment mode
function get_mode() {
    read -p "Select deployment mode (dev/prod): " MODE
    case "$MODE" in
        dev)
            echo "🔧 Deploying in Development mode..."
            VITE_API_URL="https://inhso.ir/api"
            IMAGE_TAG="192.168.1.230:5001/hub/helsan-front:1.0.0"
            ;;
        prod)
            echo "🚀 Deploying in Production mode..."
            VITE_API_URL="https://inhsoeval.ir/api"
            IMAGE_TAG="192.168.1.230:5000/hub/helsan-front:1.0.0"
            ;;
        *)
            error_exit "Invalid mode selected! Please choose 'dev' or 'prod'."
            ;;
    esac
}

# Function to build and push the Docker image
function deploy() {
    echo "Building Docker image..."
    docker build -t "$IMAGE_TAG" . || error_exit "Docker build failed!"

    echo "Pushing Docker image..."
    docker push "$IMAGE_TAG" || error_exit "Docker push failed!"

    echo "Deployment successful!"
}

# Main script execution
echo "=============================="
echo "🌍 Deployment Script for HUB"
echo "=============================="

get_mode
deploy

