#!/usr/bin/env bash
set -e

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
APP="$ROOT/wrappers/mobile"
DIST="$ROOT/dist/wrapper-win64"

echo "==> Building Wrapper Mobile Android"

mkdir -p "$DIST"

cd "$APP"

bun x cap sync android

cd android

./gradlew assembleDebug

mv "app/build/outputs/apk/debug/app-debug.apk" "$DIST/"

echo "==> Wrapper-Mobile-Android build complete"