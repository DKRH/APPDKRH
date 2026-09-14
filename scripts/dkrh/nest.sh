#!/usr/bin/env bash

set -e

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
APP="$ROOT/apps/5-nestjs"
DIST="$ROOT/dist/nest"

usage() {
    echo "Usage: $0 {build|dev|init|setup}"
    echo
    echo "Commands:"
    echo "  build               Build Bun+NestJS"
    echo "  dev                 Start the NestJS development server"
    echo "  init                Initialize NestJS dependencies"
    echo "  setup               Install Bun"
    echo "  add <packages...>   Add Bun dependencies"
}

build() {
    mkdir -p "$DIST"

    cd "$APP"

    echo "==> Installing dependencies"
    bun install

    echo "==> Compiling NestJS"
    bun run build

    echo "==> Compiling standalone binary"
    bun build \
        dist/main.js \
        --compile \
        --target=bun-linux-x64 \
        --outfile="$DIST/serverNest"

    echo "==> NestJS build complete"
    echo "    $DIST/serverNest"
}

dev() {
    cd "$APP"

    echo "==> Starting NestJS development server"

    APP_ENV=development bun --env-file=../../.env  run start:dev
}

init() {
    cd "$APP"

    echo "==> Initializing NestJS"

    bun install
}

setup() {
    echo "==> Installing Bun"

    if command -v bun >/dev/null 2>&1; then
        echo "Bun already installed:"
        bun --version
    else
        curl -fsSL https://bun.sh/install | bash
    fi

    export BUN_INSTALL="$HOME/.bun"
    export PATH="$BUN_INSTALL/bin:$PATH"

    echo "Bun:"
    bun --version
}

add() {
    if [ "$#" -eq 0 ]; then
        echo "Error: no package specified"
        echo "Usage: $0 add <package> [package...]"
        exit 1
    fi

    cd "$APP"

    echo "==> Adding Bun dependencies:"
    printf '    %s\n' "$@"

    bun add "$@"
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
    add)
        shift
        add "$@"
        ;;
    *)
        usage
        exit 1
        ;;
esac