#!/usr/bin/env bash
set -e

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
APP="$ROOT/apps/elixirphoenix"
DIST="$ROOT/dist/elixir"

echo "==> Building Elixir"

cd "$APP"

MIX_ENV=prod mix deps.get
MIX_ENV=prod mix release

#rm -rf "$DIST"

mkdir -p "$DIST"

mv "_build/prod/rel/elixirphoenix" "$DIST/"

echo "==> Elixir build complete"
echo "    $DIST/bin/elixirphoenix"