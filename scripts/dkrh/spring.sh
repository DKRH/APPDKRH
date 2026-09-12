#!/usr/bin/env bash

set -e

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
APP="$ROOT/apps/3-springkt"
DIST="$ROOT/dist/spring"

usage() {
    echo "Usage: $0 {build|dev|init|setup|test}"
    echo
    echo "Commands:"
    echo "  build   Build Spring Kotlin and copy the result"
    echo "  dev     Start the Spring Kotlin development server"
    echo "  init    Initialize Spring Kotlin dependencies"
    echo "  setup   Install Java if needed"
    echo "  test    Run Spring Kotlin tests"
}

build() {
    cd "$APP"

    echo "==> Building Spring Kotlin"

    ./gradlew build

    mkdir -p "$DIST"

    mv "build/libs/serverSpringKT.jar" "$DIST/serverSpringKT.jar"

    echo "==> Spring Kotlin build complete"
    echo "    $DIST/serverSpringKT.jar"
}

dev() {
    cd "$APP"

    echo "==> Starting Spring Kotlin development server"

    ./gradlew classes --continuous & WATCHER_PID=$!

    trap 'kill $WATCHER_PID 2>/dev/null' EXIT INT TERM

    ./gradlew bootRun
}

init() {
    cd "$APP"

    echo "==> Initializing Spring Kotlin"

    ./gradlew dependencies
}

setup() {
    echo "==> Installing Java"

    if command -v java >/dev/null 2>&1; then
        echo "Java already installed:"
        java -version
    else
        sudo apt install -y openjdk-25-jdk
    fi

    echo "Java:"
    java -version
}

test() {
    cd "$APP"

    echo "==> Starting Spring Kotlin Test"

    ./gradlew test
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
    test)
        test
        ;;
    *)
        usage
        exit 1
        ;;
esac
