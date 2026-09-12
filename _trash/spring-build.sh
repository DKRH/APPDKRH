#!/usr/bin/env bash

set -e

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

APP="$ROOT/apps/springkt"
DIST="$ROOT/dist/spring"

cd "$APP"

echo "==> Building Spring Kotlin"

./gradlew build

mkdir -p "$DIST"

mv "_build/prod/rel/elixirphoenix" "$DIST/"

echo "==> Spring Kotlin build complete"
echo "    $DIST/serverSpringKT.jar"