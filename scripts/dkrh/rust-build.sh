#!/usr/bin/env bash
set -e

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
APP="$ROOT/apps/axumrust"
DIST="$ROOT/dist/rust"

echo "==> Building Rust"

mkdir -p "$DIST"

cd "$APP"

cargo build \
    --release \
    --target-dir "$DIST"

echo "==> Rust build complete"