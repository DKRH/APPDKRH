#!/usr/bin/env bash
set -e

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
APP="$ROOT/wrappers/win64"
DIST="$ROOT/dist/wrapper-win64"

echo "==> Building Wrapper Win64"

mkdir -p "$DIST"

cd "$APP"

dotnet publish \
    -c Release \
    -r win-x64 \
    --self-contained true \
    -p:PublishSingleFile=true \
    -o "$DIST"

echo "==> Wrapper-Win64 build complete"