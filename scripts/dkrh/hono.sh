#!/usr/bin/env bash

set -e

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
APP="$ROOT/apps/1-hono"
DIST="$ROOT/dist/hono"

usage() {
    echo "Usage: $0 {build|dev|init|setup}"
    echo
    echo "Commands:"
    echo "  build               Build Bun+Hono"
    echo "  dev                 Start the Hono development server"
    echo "  init                Initialize Hono dependencies"
    echo "  setup               Install Bun"
    echo "  generate            Drizzle generate migrations"
    echo "  migrate             Drizzle run migrations"
    echo "  format              Run Prettier"
    echo "  formatcheck         Run Prettier Only Check"
    echo "  add <packages...>   Add Bun dependencies"
}

build() {
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
}

dev() {
    cd "$APP"

    echo "==> Starting Hono development server"

    APP_ENV=development bun run dev
}

init() {
    cd "$APP"

    echo "==> Initializing Hono"

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

generate() {
    cd "$APP"

    echo "==> Hono Drizzle generate migrations"

    bun x drizzle-kit generate
}

migrate() {
    cd "$APP"
    
    echo "==> Hono Drizzle run migrations"

    bun x drizzle-kit migrate
}

format() {
    cd "$APP"
    
    echo "==> Hono Prettier Running"

    bun x prettier --write .
}

formatcheck() {
    cd "$APP"
    
    echo "==> Hono Prettier Only Check"

    bun x prettier --check .
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
    generate)
        generate
        ;;
    migrate)
        migrate
        ;;
    format)
        format
        ;;
    formatcheck)
        formatcheck
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