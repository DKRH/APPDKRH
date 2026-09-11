#!/usr/bin/env bash

set -e

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

cd "$ROOT/apps/dotnetwebapi"

echo "==> Starting .NET run migrations"

dotnet ef database update