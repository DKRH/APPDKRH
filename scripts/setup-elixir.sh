#!/usr/bin/env bash

set -e

ERLANG_VERSION="28.1"
ELIXIR_VERSION="1.19.4-otp-28"
ASDF_VERSION="0.18.0"

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

    curl -L \
        "https://github.com/asdf-vm/asdf/releases/download/v${ASDF_VERSION}/asdf-v${ASDF_VERSION}-linux-amd64.tar.gz" \
        -o /tmp/asdf.tar.gz

    tar -xzf /tmp/asdf.tar.gz \
        -C "$HOME/.asdf/bin"

    rm /tmp/asdf.tar.gz

    if ! grep -q 'HOME/.asdf/bin' "$HOME/.bashrc"; then
        cat >> "$HOME/.bashrc" <<'EOF'

# asdf
export PATH="$HOME/.asdf/bin:$HOME/.asdf/shims:$PATH"
EOF
    fi

    export PATH="$HOME/.asdf/bin:$HOME/.asdf/shims:$PATH"
else
    echo "asdf already installed."
fi

echo
echo "asdf version:"
asdf version

echo
echo "==> Installing Erlang plugin..."

if ! asdf plugin list | grep -q '^erlang$'; then
    asdf plugin add erlang https://github.com/asdf-vm/asdf-erlang.git
else
    echo "Erlang plugin already installed."
fi

echo
echo "==> Installing Elixir plugin..."

if ! asdf plugin list | grep -q '^elixir$'; then
    asdf plugin add elixir https://github.com/asdf-vm/asdf-elixir.git
else
    echo "Elixir plugin already installed."
fi

echo
echo "==> Installing Erlang ${ERLANG_VERSION}..."

if ! asdf list erlang 2>/dev/null | grep -q "^${ERLANG_VERSION}$"; then
    asdf install erlang "$ERLANG_VERSION"
else
    echo "Erlang ${ERLANG_VERSION} already installed."
fi

echo
echo "==> Installing Elixir ${ELIXIR_VERSION}..."

if ! asdf list elixir 2>/dev/null | grep -q "^${ELIXIR_VERSION}$"; then
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