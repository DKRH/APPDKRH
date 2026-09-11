#!/usr/bin/env bash
set -e

echo "==> Installing Rust"

if command -v rustc >/dev/null 2>&1; then
    echo "Rust already installed:"
    rustc --version
else
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
fi

echo "Rust:"
rustc --version