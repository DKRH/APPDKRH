#!/usr/bin/env bash

set -e

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
APP="$ROOT/apps/8-laravel"
DIST="$ROOT/dist/laravel"

usage() {
    echo "Usage: $0 {build|dev|init|setup}"
    echo
    echo "Commands:"
    echo "  build               Build Laravel"
    echo "  dev                 Start the Laravel development server"
    echo "  init                Initialize Laravel & dependencies"
    echo "  setup               Install Frankenphp & Composer"
    echo "  add <packages...>   Add PHP dependencies via Composer"
}

init() {
    cd "$APP"

    echo "==> Initializing Laravel"

    cp .env.example .env

    composer install
    php artisan key:generate
    php artisan octane:install --server=frankenphp
}

dev() {
    cd "$APP"

    echo "==> Starting Laravel development server"

    php artisan octane:frankenphp --port="${OCTANE_PORT:-2608}"
}

build() {
    echo "==> Building Laravel standalone binary"

    rm -rf "$DIST"
    mkdir -p "$DIST"

    BUILD_DIR="$DIST/app"
    FRANKENPHP_DIR="$DIST/frankenphp"

    echo "==> Preparing build directory"

    mkdir -p "$BUILD_DIR"

    # Copy Laravel application
    cp -a "$APP/." "$BUILD_DIR/"

    cd "$BUILD_DIR"

    echo "==> Installing production dependencies"

    composer install \
        --no-dev \
        --prefer-dist \
        --optimize-autoloader

    echo "==> Removing unnecessary files"

    rm -rf \
        "$BUILD_DIR/tests" \
        "$BUILD_DIR/.git"

    echo "==> Building FrankenPHP"

    if [ ! -d "$FRANKENPHP_DIR" ]; then
        git clone --depth 1 https://github.com/php/frankenphp.git "$FRANKENPHP_DIR"
    fi

    cd "$FRANKENPHP_DIR"

    echo "==> Embedding Laravel application"

    EMBED="$BUILD_DIR" ./build-static.sh

    echo "==> Copying binary"

    cp \
        "$FRANKENPHP_DIR/dist/frankenphp-linux-$(uname -m)" \
        "$DIST/frankenphp"

    chmod +x "$DIST/frankenphp"

    echo
    echo "==> Build complete"
    echo
    echo "Binary:"
    echo "    $DIST/frankenphp"
    echo
    echo "Run:"
    echo "    $DIST/frankenphp php-server"
}

setup() {
    echo "==> Installing FrankenPHP"

    if command -v frankenphp >/dev/null 2>&1; then
        echo "    FrankenPHP already installed:"
        frankenphp version
    else
        curl https://frankenphp.dev/install.sh | sh

        # Make FrankenPHP available in the current shell
        export PATH="$HOME/.local/bin:$PATH"
    fi

    echo
    echo "==> Installing Composer"

    if command -v composer >/dev/null 2>&1; then
        echo "    Composer already installed:"
        composer --version
    else
        cd "$HOME"

        curl -sS https://getcomposer.org/installer -o composer-setup.php

        sudo frankenphp php-cli composer-setup.php \
            --install-dir=/usr/local/bin \
            --filename=composer

        rm composer-setup.php
    fi

    echo
    echo "==> Verifying installation"

    echo
    echo "FrankenPHP:"
    frankenphp version

    echo
    echo "PHP:"
    php -v

    echo
    echo "Composer:"
    composer --version

    echo
    echo "==> Setup complete"
}

add() {
    if [ "$#" -eq 0 ]; then
        echo "Error: no package specified"
        echo "Usage: $0 add <package> [package...]"
        exit 1
    fi

    cd "$APP"

    echo "==> Adding PHP dependencies via Composer:"
    printf '    %s\n' "$@"

    composer require "$@"
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
    add)
        shift
        add "$@"
        ;;
    *)
        usage
        exit 1
        ;;
esac