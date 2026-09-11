#!/usr/bin/env bash
set -e

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