#!/usr/bin/env bash

set -e

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
APP="$ROOT/apps/svelte"

usage() {
    echo "Usage: $0 {add|dev|init|build}"
    echo
    echo "Commands:"
    echo "  add <packages...>   Add Svelte dependencies"
    echo "  dev                 Start Svelte development server"
    echo "  init                Install Svelte dependencies"
    echo "  build               Build Svelte application"
    echo "  setup               Install Bun"
}

add() {
    if [ "$#" -eq 0 ]; then
        echo "Error: no package specified"
        echo "Usage: $0 add <package> [package...]"
        exit 1
    fi

    cd "$APP"

    echo "==> Adding Svelte dependencies:"
    printf '    %s\n' "$@"

    bun add "$@"
}

dev() {
    cd "$APP"

    echo "==> Starting Svelte development server"

    bun run dev
}

init() {
    cd "$APP"

    echo "==> Installing Svelte dependencies"

    bun install
}

build() {
    cd "$APP"

    echo "==> Building Svelte"

    bun run build

    echo "==> Moving Svelte build output"

    cd "$ROOT"

    bun scripts/mv_svelte.ts

    echo "==> Svelte build complete"
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

case "${1:-}" in
    add)
        shift
        add "$@"
        ;;
    dev)
        dev
        ;;
    init)
        init
        ;;
    build)
        build
        ;;
    setup)
        setup
        ;;
    *)
        usage
        exit 1
        ;;
esac