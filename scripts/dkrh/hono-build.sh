#!/usr/bin/env bash
set -e

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
APP="$ROOT/apps/hono"
DIST="$ROOT/dist/hono"

echo "==> Building Hono"

mkdir -p "$DIST"

cd "$APP"

bun install

bun build \
    src/index.ts \
    --compile \
    --target=bun-linux-x64 \
    --outfile="$DIST/serverHono"

echo "==> Hono build complete"
echo "    $DIST/serverHono"