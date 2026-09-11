#!/usr/bin/env bash

set -e

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

cd "$ROOT/apps/axumrust"

echo "==> Initializing Rust"

cargo fetch

cargo install cargo-watch