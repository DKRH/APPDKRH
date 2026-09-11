#!/usr/bin/env bash
set -e

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
APP="$ROOT/apps/elysia"
DIST="$ROOT/dist/elysia"

echo "==> Building Elysia"

mkdir -p "$DIST"

cd "$APP"

bun install

bun build \
    src/main.ts \
    --compile \
    --target=bun-linux-x64 \
    --outfile="$DIST/serverElysia"

echo "==> Elysia build complete"
echo "    $DIST/serverElysia"