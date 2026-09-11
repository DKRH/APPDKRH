#!/usr/bin/env bash
set -e

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
APP="$ROOT/apps/dotnetwebapi"
DIST="$ROOT/dist/dotnet"

echo "==> Building .NET"

mkdir -p "$DIST"

cd "$APP"

dotnet restore

dotnet publish \
    -c Release \
    -r linux-x64 \
    --self-contained true \
    -p:PublishSingleFile=true \
    -p:AssemblyName=serverDotnet \
    -o "$DIST"

echo "==> .NET build complete"
echo "    $DIST/serverDotnet"