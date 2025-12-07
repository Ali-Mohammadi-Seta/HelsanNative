#!/bin/bash
set -e

# ---- Step 0: Set Proxy and Git Config ----
export http_proxy="${HUB_PROXY:-}"
export https_proxy="${HUB_PROXY:-}"
echo "Proxy set to: $HUB_PROXY"
echo "No proxy for: $no_proxy"

git config --global user.name "runner"
git config --global http.sslVerify false
echo "Git global config set"


# ---- Step 1: Validate Variables and Clone Central Repository ----
if [ -z "$ZONE37_GITEA_USERNAME" ]; then
  echo "Error: ZONE37_GITEA_USERNAME is not set"
  exit 1
fi
if [ -z "$ZONE37_GITEA_TOKEN" ]; then
  echo "Error: ZONE37_GITEA_TOKEN is not set"
  exit 1
fi
if [ -z "$ZONE37_GITEA_URL" ]; then
  echo "Error: ZONE37_GITEA_URL is not set"
  exit 1
fi
if [ -z "$ZONE37_GITEA_STACK" ]; then
  echo "Error: ZONE37_GITEA_STACK is not set"
  exit 1
fi

CENTRAL_REPO_CLONE_URL="https://${ZONE37_GITEA_USERNAME}:${ZONE37_GITEA_TOKEN}@${ZONE37_GITEA_URL}/${ZONE37_GITEA_STACK}/${STACK}.git"
TEMP_DIR="/tmp/${STACK}"

echo "Cloning central repository: $CENTRAL_REPO_CLONE_URL"
rm -rf "$TEMP_DIR"
for i in {1..3}; do
  echo "Attempt $i to clone repository"
  git clone "$CENTRAL_REPO_CLONE_URL" "$TEMP_DIR" && break
  sleep 5
  if [ $i -eq 3 ]; then
    echo "Error: Failed to clone repository after 3 attempts"
    exit 1
  fi
done
cd "$TEMP_DIR"

# ---- Step 2: Determine Image Tag ----
IMAGE_TAG=${REAL_IMAGE:-$IMAGE_NAME}
if [ -z "$IMAGE_TAG" ]; then
  echo "Error: Neither IMAGE nor IMAGE_NAME is set"
  exit 1
fi
echo "Deploying using image: $IMAGE_TAG"

# ---- Step 3: Update docker-compose.yml ----
COMPOSE_FILE="${TEMP_DIR}/docker-compose.yml"
if  [ ! -f "$COMPOSE_FILE" ]; then
  echo "Error: $COMPOSE_FILE not found"
  exit 1
fi

PREV_IMAGE=$(grep 'image:' "$COMPOSE_FILE" | grep "${COMPOSE_SERVICE}" | awk '{print $2}' | head -n 1)
if [ -z "$PREV_IMAGE" ]; then
  echo "Error: Could not find image for service ${COMPOSE_SERVICE} in $COMPOSE_FILE"
  exit 1
fi
echo "Previous image: $PREV_IMAGE"

sed -i "s|$PREV_IMAGE|$IMAGE_TAG|g" "$COMPOSE_FILE"
echo "Updated image for service ${COMPOSE_SERVICE} to $IMAGE_TAG in $COMPOSE_FILE"

# # ---- Step 4: Commit and Push Changes ----
git add "$COMPOSE_FILE"
git commit -m "Update ${COMPOSE_SERVICE} image to $IMAGE_TAG"
for i in {1..3}; do
  echo "Attempt $i to push repository"
  git push origin main && break
  sleep 5
  if [ $i -eq 3 ]; then
    echo "Error: Failed to push repository after 3 attempts"
    exit 1
  fi
done
echo "Pushed changes to central repository"

# # ---- Step 5: Clean Up ----
cd -
rm -rf "$TEMP_DIR"
echo "Cleaned up temporary directory"