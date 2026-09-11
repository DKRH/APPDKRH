#!/usr/bin/env bash
set -e

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
APP="$ROOT/apps/goapi"
DIST="$ROOT/dist/go"

echo "==> Building Go"

mkdir -p "$DIST"

cd "$APP"

go mod tidy

go build \
    -o "$DIST/serverGo" \
    ./cmd/main

echo "==> Go build complete"
echo "    $DIST/serverGo"