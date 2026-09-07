#!/usr/bin/env bash

set -euo pipefail

cd "$(dirname "$0")"

echo "==> Local Building..."
bun run hono:build
bun run sv:build
bun run dotnet:build
bun run goapi:build
bun run springkt:build

# Load .env
#if [ -f .env ]; then
#    export $(grep -v '^#' .env | xargs)
#fi

DEPLOY_NAME="${DEPLOY_NAME}"
DEPLOY_HOST="${DEPLOY_HOST}"
DEPLOY_PORT="${DEPLOY_PORT:-22}"
DEPLOY_USER="${DEPLOY_USER}"
DEPLOY_APP_DIR="${DEPLOY_APP_DIR}"

echo "==> Deploying to ${DEPLOY_NAME} (${DEPLOY_HOST})..."
echo "==> Target: ${DEPLOY_APP_DIR}"

tar \
    -C dist . \
    --exclude='.env' \
    --exclude='.env.*' \
	--exclude='wrapper-android' \
	--exclude='wrapper-win64' \
	--exclude='dotnet' \
	--exclude='go' \
	--exclude='spring' \
	#--exclude='dotnet/appsettings.Development.json' \
	#--exclude='dotnet/serverDotnet.pdb' \
	#--exclude='dotnet/serverDotnet.staticwebassets.endpoints.json' \
    -czf - |
ssh -p "${DEPLOY_PORT}" "${DEPLOY_USER}@${DEPLOY_HOST}" "

set -e

echo '==> Preparing application directory...'
mkdir -p '${DEPLOY_APP_DIR}'

echo '==> Stopping service...'
systemctl stop dkrh

echo '==> Extracting deployment...'
tar -xzf - -C '${DEPLOY_APP_DIR}'

echo '==> Setting executable permissions...'
chmod +x '${DEPLOY_APP_DIR}/hono/serverHono'
chmod +x '${DEPLOY_APP_DIR}/go/serverGO'
chmod +x '${DEPLOY_APP_DIR}/dotnet/serverDotnet'

echo '==> Starting service...'
systemctl start dkrh

echo '==> Service status...'
systemctl --no-pager --lines=5 status dkrh
"

echo "==> Deployment completed."