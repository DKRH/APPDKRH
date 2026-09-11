#!/usr/bin/env bash
set -e

echo "==> Installing C/C++ tooling"

if command -v clang >/dev/null 2>&1; then
    echo "Clang already installed:"
    clang --version
else
    sudo apt install -y \
        clang \
        clangd \
        ninja-build \
        cmake \
        bison \
        flex
fi

if [ ! -d "$HOME/vcpkg" ]; then
    cd "$HOME"

    git clone https://github.com/microsoft/vcpkg.git

    cd vcpkg

    ./bootstrap-vcpkg.sh
fi

grep -qxF 'export VCPKG_ROOT="$HOME/vcpkg"' "$HOME/.bashrc" || \
    echo 'export VCPKG_ROOT="$HOME/vcpkg"' >> "$HOME/.bashrc"

grep -qxF 'export PATH="$VCPKG_ROOT:$PATH"' "$HOME/.bashrc" || \
    echo 'export PATH="$VCPKG_ROOT:$PATH"' >> "$HOME/.bashrc"

export VCPKG_ROOT="$HOME/vcpkg"
export PATH="$VCPKG_ROOT:$PATH"

echo "Clang:"
clang++ --version

echo "CMake:"
cmake --version

echo "Ninja:"
ninja --version

echo "VCPKG:"
vcpkg version