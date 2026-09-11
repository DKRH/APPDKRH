#!/usr/bin/env bash
set -e

echo "==> Installing Go"

if command -v go >/dev/null 2>&1; then
    echo "Go already installed:"
    go version
else
    sudo apt install -y golang-go
fi

echo "Go:"
go version

echo "==> Installing Air"

go install github.com/air-verse/air@latest

export PATH="$HOME/go/bin:$PATH"

echo "Air:"
air -v || true