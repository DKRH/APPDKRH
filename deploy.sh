#!/usr/bin/env bash

set -e

cd "$(dirname "$0")"

echo "==> Local Building..."
bun run hono:build
bun run sv:build

# Load .env
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

DEPLOY_NAME="${DEPLOY_NAME}"
DEPLOY_HOST="${DEPLOY_HOST}"
DEPLOY_PORT="${DEPLOY_PORT:-22}"
DEPLOY_USER="${DEPLOY_USER}"
DEPLOY_APP_DIR="${DEPLOY_APP_DIR}"

echo "==> Deploying to ${DEPLOY_NAME} (${DEPLOY_HOST})..."

tar \
    --exclude='.env' \
    --exclude='.env.*' \
    -czf - \
    -C dist . \
    -C ../dist_server serverHono |
ssh -p "${DEPLOY_PORT}" "${DEPLOY_USER}@${DEPLOY_HOST}" "

set -e

mkdir -p '${DEPLOY_APP_DIR}'

systemctl stop dkrh

tar -xzf - -C '${DEPLOY_APP_DIR}'

chmod +x '${DEPLOY_APP_DIR}/serverHono'

systemctl start dkrh

systemctl --no-pager --lines=5 status dkrh
"

echo "==> Deployment completed."