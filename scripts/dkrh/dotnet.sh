#!/usr/bin/env bash
set -e

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
APP="$ROOT/apps/4-dotnetwebapi"
DIST="$ROOT/dist/dotnet"

usage() {
    echo "Usage: $0 {build|dev|init|setup}"
    echo
    echo "Commands:"
    echo "  build               Build .NET Web Api"
    echo "  dev                 Start .NET Web Api development server"
    echo "  init                Initialize .NET Web Api dependencies"
    echo "  setup               Install .NET binary"
    echo "  generate            generate migrations"
    echo "  migrate             run migrations"
    echo "  add <packages...>   Add Rust dependencies"
}

build() {
    echo "==> Building .NET"

    mkdir -p "$DIST"

    cd "$APP"

    dotnet restore

    dotnet publish \
        -c Release \
        -r linux-x64 \
        --self-contained true \
        -p:PublishSingleFile=true \
        -p:AssemblyName=serverDotnet \
        -o "$DIST"

    echo "==> .NET build complete"
    echo "    $DIST/serverDotnet"
}


dev() {
    cd "$APP"

    echo "==> Starting .NET development server"

    dotnet watch run
}

init() {
    cd "$APP"

    echo "==> Initializing .NET"

    dotnet restore

    dotnet tool install --global dotnet-ef 2>/dev/null || true
}

setup() {
    echo "==> Installing .NET"

    if command -v dotnet >/dev/null 2>&1; then
        echo ".NET already installed:"
        dotnet --version
    else
        sudo add-apt-repository ppa:dotnet/backports
        sudo apt-get update
        sudo apt-get install -y dotnet-sdk-10.0
    fi

    echo ".NET:"
    dotnet --version
}

generate() {
    cd "$APP"

    echo "==> Starting .NET generate migrations"

    dotnet ef migrations add InitialCreate
}

migrate() {
    cd "$APP"
    
    echo "==> Starting .NET run migrations"

    dotnet ef database update
}

add() {
    if [ "$#" -eq 0 ]; then
        echo "Error: no package specified"
        echo "Usage: $0 add <package> [package...]"
        exit 1
    fi

    cd "$APP"

    echo "==> Adding .NET dependencies:"
    printf '    %s\n' "$@"

    dotnet add package "$@"
}

case "${1:-}" in
    build)
        build
        ;;
    dev)
        dev
        ;;
    init)
        init
        ;;
    setup)
        setup
        ;;
    generate)
        generate
        ;;
    migrate)
        migrate
        ;;
    add)
        shift
        add "$@"
        ;;
    *)
        usage
        exit 1
        ;;
esac