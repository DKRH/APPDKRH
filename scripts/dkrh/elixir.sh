#!/usr/bin/env bash

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
APP="$ROOT/apps/7-elixirphoenix"
DIST="$ROOT/dist/elixir"

usage() {
    echo "Usage: $0 {build|dev|init|setup|test}"
    echo
    echo "Commands:"
    echo "  build   Build Phoenix release"
    echo "  dev     Start Phoenix development server"
    echo "  init    Initialize Phoenix dependencies"
    echo "  setup   Install Elixir & Erlang"
    echo "  test    Run Phoenix tests"
}

error() {
    echo
    echo "ERROR: $1"
    exit 1
}

check_app() {
    if [ ! -d "$APP" ]; then
        error "Phoenix application not found: $APP"
    fi
}

build() {
    check_app

    echo "==> Building Elixir"

    cd "$APP"

    echo "==> Getting production dependencies..."
    MIX_ENV=prod mix deps.get

    echo "==> Building Phoenix release..."
    MIX_ENV=prod mix release

    echo "==> Preparing distribution..."

    mkdir -p "$DIST"

    # Remove previous release if it exists
    rm -rf "$DIST/elixirphoenix"

    mv "_build/prod/rel/elixirphoenix" "$DIST/"

    echo
    echo "==> Elixir build complete"
    echo "    $DIST/elixirphoenix/bin/elixirphoenix"
}

dev() {
    check_app

    echo "==> Starting Phoenix development server"

    if [ ! -f "$ROOT/.env" ]; then
        error ".env not found: $ROOT/.env"
    fi

    cd "$ROOT"

    echo "==> Loading environment from .env"

    set -a
    source "$ROOT/.env"
    set +a

    cd "$APP"

    mix phx.server
}

init() {
    check_app

    echo "==> Initializing Phoenix"

    cd "$APP"

    mix deps.get
}

test() {
    check_app

    echo "==> Running Phoenix tests"

    cd "$APP"

    mix test
}

setup() {
    local ERLANG_VERSION="28.1"
    local ELIXIR_VERSION="1.19.4-otp-28"
    local ASDF_VERSION="0.18.0"

    echo "======================================"
    echo " Elixir Development Environment Setup"
    echo "======================================"

    echo
    echo "==> Updating apt..."

    sudo apt -o Acquire::ForceIPv4=true update

    echo
    echo "==> Installing system dependencies..."

    sudo apt -o Acquire::ForceIPv4=true install -y \
        curl \
        git \
        build-essential \
        autoconf \
        m4 \
        libncurses5-dev \
        libssl-dev \
        libssh-dev \
        unixodbc-dev \
        xsltproc \
        fop \
        libxml2-utils \
        inotify-tools

    echo
    echo "==> Installing asdf ${ASDF_VERSION}..."

    if ! command -v asdf >/dev/null 2>&1; then
        mkdir -p "$HOME/.asdf/bin"

        curl -fL \
            "https://github.com/asdf-vm/asdf/releases/download/v${ASDF_VERSION}/asdf-v${ASDF_VERSION}-linux-amd64.tar.gz" \
            -o /tmp/asdf.tar.gz

        tar -xzf /tmp/asdf.tar.gz \
            -C "$HOME/.asdf/bin"

        rm -f /tmp/asdf.tar.gz

        if ! grep -q 'HOME/.asdf/bin' "$HOME/.bashrc" 2>/dev/null; then
            cat >> "$HOME/.bashrc" <<'EOF'

# asdf
export PATH="$HOME/.asdf/bin:$HOME/.asdf/shims:$PATH"
EOF
        fi
    else
        echo "asdf already installed."
    fi

    # Make asdf available in this script immediately
    export PATH="$HOME/.asdf/bin:$HOME/.asdf/shims:$PATH"

    echo
    echo "asdf version:"
    asdf version

    echo
    echo "==> Installing Erlang plugin..."

    if ! asdf plugin list | grep -qx 'erlang'; then
        asdf plugin add erlang \
            https://github.com/asdf-vm/asdf-erlang.git
    else
        echo "Erlang plugin already installed."
    fi

    echo
    echo "==> Installing Elixir plugin..."

    if ! asdf plugin list | grep -qx 'elixir'; then
        asdf plugin add elixir \
            https://github.com/asdf-vm/asdf-elixir.git
    else
        echo "Elixir plugin already installed."
    fi

    echo
    echo "==> Installing Erlang ${ERLANG_VERSION}..."

    if ! asdf list erlang 2>/dev/null | grep -qx "${ERLANG_VERSION}"; then
        asdf install erlang "$ERLANG_VERSION"
    else
        echo "Erlang ${ERLANG_VERSION} already installed."
    fi

    echo
    echo "==> Installing Elixir ${ELIXIR_VERSION}..."

    if ! asdf list elixir 2>/dev/null | grep -qx "${ELIXIR_VERSION}"; then
        asdf install elixir "$ELIXIR_VERSION"
    else
        echo "Elixir ${ELIXIR_VERSION} already installed."
    fi

    echo
    echo "==> Setting global versions..."

    asdf set -u erlang "$ERLANG_VERSION"
    asdf set -u elixir "$ELIXIR_VERSION"

    echo
    echo "==> Installing Hex..."

    mix local.hex --force

    echo
    echo "==> Installing Rebar..."

    mix local.rebar --force

    echo
    echo "==> Installing Phoenix..."

    if ! mix archive list | grep -q 'phx_new'; then
        mix archive.install hex phx_new --force
    else
        echo "Phoenix generator already installed."
    fi

    echo
    echo "======================================"
    echo " Verification"
    echo "======================================"

    echo
    echo "asdf:"
    asdf version

    echo
    echo "Erlang:"
    erl -version

    echo
    echo "Elixir:"
    elixir --version

    echo
    echo "Mix:"
    mix --version

    echo
    echo "Phoenix:"
    mix phx.new --version

    echo
    echo "======================================"
    echo " Elixir setup complete!"
    echo "======================================"
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
    test)
        test
        ;;
    *)
        usage
        exit 1
        ;;
esac