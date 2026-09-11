#!/usr/bin/env bash

set -e

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

cd "$ROOT/apps/dotnetwebapi"

echo "==> Initializing .NET"

dotnet restore

dotnet tool install --global dotnet-ef 2>/dev/null || true