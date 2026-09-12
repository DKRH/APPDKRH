#!/usr/bin/env bash

set -e

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

usage() {
    echo "Usage: $0 {android|win64}"
    echo
    echo "Targets:"
    echo "  android   Build Android wrapper"
    echo "  win64     Build Windows x64 wrapper"
}

android() {
    APP="$ROOT/wrappers/mobile"
    DIST="$ROOT/dist/wrapper-android"

    echo "==> Building Wrapper Mobile Android"

    mkdir -p "$DIST"

    cd "$APP"

    bun x cap sync android

    cd android

    ./gradlew assembleDebug

    mv \
        "app/build/outputs/apk/debug/app-debug.apk" \
        "$DIST/"

    echo "==> Wrapper-Mobile-Android build complete"
    echo "    $DIST/app-debug.apk"
}

win64() {
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
    echo "    $DIST"
}

case "${1:-}" in
    android)
        android
        ;;
    win64)
        win64
        ;;
    *)
        usage
        exit 1
        ;;
esac