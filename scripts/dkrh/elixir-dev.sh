#!/usr/bin/env bash

set -e

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

cd "$ROOT"

echo "==> Starting Elixir Phoenix development server"

set -a
source .env
set +a

cd "$ROOT/apps/elixirphoenix"

mix phx.server