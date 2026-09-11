#!/usr/bin/env bash

set -e

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

cd "$ROOT/apps/elixirphoenix"

echo "==> Initializing Elixir Phoenix"

mix deps.get