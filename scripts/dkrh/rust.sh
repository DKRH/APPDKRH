#!/usr/bin/env bash
set -e

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
APP="$ROOT/apps/6-axumrust"
DIST="$ROOT/dist/rust"

usage() {
    echo "Usage: $0 {build|dev|init|setup}"
    echo
    echo "Commands:"
    echo "  build               Build Rust"
    echo "  dev                 Start Rust development server"
    echo "  init                Initialize Rust dependencies"
    echo "  setup               Install Rust if needed"
    echo "  add <packages...>   Add Rust dependencies"
}

build() {
    echo "==> Building Rust"

    mkdir -p "$DIST"

    cd "$APP"

    cargo build \
        --release \
        --target-dir "$DIST"

    echo "==> Rust build complete"
}

dev() {
    cd "$APP"

    echo "==> Starting Rust development server"

    cargo watch -x run
}

init() {
    cd "$APP"

    echo "==> Initializing Rust"

    cargo fetch

    cargo install cargo-watch
}

setup() {
    echo "==> Installing Rust"

    if command -v rustc >/dev/null 2>&1; then
        echo "Rust already installed:"
        rustc --version
    else
        curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
    fi

    echo "Rust:"
    rustc --version
}

add() {
    if [ "$#" -eq 0 ]; then
        echo "Error: no package specified"
        echo "Usage: $0 add <package> [package...]"
        exit 1
    fi

    cd "$APP"

    echo "==> Adding Rust dependencies:"
    printf '    %s\n' "$@"

    cargo add "$@"
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