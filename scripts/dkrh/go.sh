#!/usr/bin/env bash
set -e

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
APP="$ROOT/apps/2-goapi"
DIST="$ROOT/dist/go"

usage() {
    echo "Usage: $0 {build|dev|init|setup}"
    echo
    echo "Commands:"
    echo "  build   Build Go"
    echo "  dev     Start Go development server"
    echo "  init    Initialize Go dependencies"
    echo "  setup   Install Go if needed"
}

build() {
    echo "==> Building Go"

    mkdir -p "$DIST"

    cd "$APP"

    go mod tidy

    go build \
        -o "$DIST/serverGo" \
        ./cmd/main

    echo "==> Go build complete"
    echo "    $DIST/serverGo"
}

dev() {
    cd "$APP"

    echo "==> Starting Go development server"

    air
}

init() {
    cd "$APP"

    echo "==> Initializing Go"

    go mod tidy
}

setup() {
    echo "==> Installing Go"

    if command -v go >/dev/null 2>&1; then
        echo "Go already installed:"
        go version
    else
        sudo apt install -y golang-go
    fi

    echo "Go:"
    go version

    echo "==> Installing Air"

    go install github.com/air-verse/air@latest

    export PATH="$HOME/go/bin:$PATH"

    echo "Air:"
    air -v || true
}

case "${1:-}" in
    build)
        build
        ;;
    dev)
        dev
        ;;
    init)
        init
        ;;
    setup)
        setup
        ;;
    *)
        usage
        exit 1
        ;;
esac