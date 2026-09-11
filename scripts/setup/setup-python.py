#!/usr/bin/env bash
set -e

echo "==> Installing uv"

if command -v uv >/dev/null 2>&1; then
    echo "uv already installed:"
    uv --version
else
    curl -LsSf https://astral.sh/uv/install.sh | sh
fi

export PATH="$HOME/.local/bin:$PATH"

echo "uv:"
uv --version

echo "==> Installing Python through uv"

uv python install 3.12

echo "Python:"
uv run --python 3.12 python --version