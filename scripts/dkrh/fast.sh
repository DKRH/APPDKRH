#!/usr/bin/env bash

set -e

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
APP="$ROOT/apps/fast"

usage() {
    echo "Usage: $0 {build|dev|init|setup}"
    echo
    echo "Commands:"
    echo "  build   Build Fast Python server"
    echo "  dev     Start Fast development server"
    echo "  init    Initialize Python dependencies"
    echo "  setup   Install uv and Python"
}

build() {
    echo "==> Building Fast"

    cd "$APP"

    uv run python -m nuitka \
        --onefile \
        --standalone \
        --output-filename=serverFast \
        app/server.py

    echo "==> Fast build complete"
}

dev() {
    echo "==> Starting Fast development server"

    cd "$APP"

    uv run python -m app.dev
}

init() {
    echo "==> Initializing Fast"

    cd "$APP"

    uv sync
}

setup() {
    echo "==> Installing uv"

    if command -v uv >/dev/null 2>&1; then
        echo "uv already installed:"
        uv --version
    else
        curl -LsSf https://astral.sh/uv/install.sh | sh
    fi

    export PATH="$HOME/.local/bin:$PATH"

    echo
    echo "uv:"
    uv --version

    echo
    echo "==> Installing Python through uv"

    uv python install 3.12

    echo
    echo "Python:"
    uv run --python 3.12 python --version

    echo
    echo "==> Installing Nuitka"

    if uv tool list | grep -q '^nuitka '; then
        echo "Nuitka already installed:"
        nuitka --version
    else
        uv tool install nuitka
    fi

    echo
    echo "Nuitka:"
    nuitka --version
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