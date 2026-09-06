#!/usr/bin/env bash
set -e

echo "==> Updating packages"
sudo apt update
sudo apt upgrade -y

echo "==> Installing system dependencies"
sudo apt install -y \
    curl \
    wget \
    git \
    unzip \
    zip \
    build-essential \
    ca-certificates \
    pkg-config \
    libssl-dev \
    openssl \
    dos2unix \
    jq \
    ripgrep \
    fd-find \
    htop \
    patchelf

# ============================================================
# Bun
# ============================================================

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

# ============================================================
# uv / Python
# ============================================================

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

# ============================================================
# Python
# ============================================================

echo
echo "==> Installing Python through uv"

uv python install 3.12

echo "Python:"
uv run --python 3.12 python --version

# ============================================================
# Go
# ============================================================

echo "==> Installing Go"

if command -v go >/dev/null 2>&1; then
    echo "Go already installed:"
    go version
else
    sudo apt install -y golang-go
fi

echo "Go:"
go version

# ============================================================
# Air for Go hot reload
# ============================================================

echo "==> Installing Air"

go install github.com/air-verse/air@latest

export PATH="$HOME/go/bin:$PATH"

echo "Air:"
air -v || true

# ============================================================
# Java
# ============================================================

echo "==> Installing Java"

if command -v java >/dev/null 2>&1; then
    echo "Java already installed:"
    java -version
else
    sudo apt install -y openjdk-25-jdk
fi

echo "Java:"
java -version

# ============================================================
# Environment
# ============================================================

echo "==> Adding environment variables"

cat >> "$HOME/.bashrc" <<'EOF'

# DKRH development tools
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$HOME/.local/bin:$HOME/go/bin:$PATH"
EOF

# Reload for current shell
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$HOME/.local/bin:$HOME/go/bin:$PATH"

# ============================================================
# Versions
# ============================================================

echo
echo "========================================"
echo "Installed development environment"
echo "========================================"

echo "Bun:"
bun --version

echo "uv:"
uv --version

echo
echo "Python:"
uv run --python 3.12 python --version

echo "Go:"
go version

echo "Java:"
java -version 2>&1 | head -n 1

echo "Gradle:"
gradle --version | grep Gradle | head -n 1

echo
echo "Done."