#!/usr/bin/env bash
set -e

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