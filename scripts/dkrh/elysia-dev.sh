#!/usr/bin/env bash

set -e

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

cd "$ROOT/apps/elysia"

echo "==> Starting Elysia development server"

bun install

APP_ENV=development bun run dev