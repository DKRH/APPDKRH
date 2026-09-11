#!/usr/bin/env bash

set -e

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

cd "$ROOT/apps/hono"

echo "==> Starting Hono development server"

bun install

APP_ENV=development bun run dev