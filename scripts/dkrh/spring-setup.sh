#!/usr/bin/env bash
set -e

echo "==> Installing Java"

if command -v java >/dev/null 2>&1; then
    echo "Java already installed:"
    java -version
else
    sudo apt install -y openjdk-25-jdk
fi

echo "Java:"
java -version