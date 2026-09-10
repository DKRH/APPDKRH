#!/usr/bin/env bash
set -e

echo
echo "========================================"
echo "Installed development environment"
echo "========================================"

printf "%-20s : %s\n" "1) Bun" "$(bun --version)"
printf "%-20s : %s\n" "2) Go" "$(go version)"
printf "%-20s : %s\n" "3) JAVA" "$(java -version 2>&1 | head -n 1)"
printf "%-20s : %s\n" "4) .NET" "$(dotnet --version)"
printf "%-20s : %s\n" "5) Rustc" "$(rustc --version)"
printf "%-20s : %s\n" "6) Clang" "$(clang --version 2>&1 | head -n 1)"

echo
echo "========================================"
echo "Installed production environment"
echo "========================================"

printf "%-20s : %s\n" "6) 1) Nginx" "$(nginx -v 2>&1)"
printf "%-20s : %s\n" "6) 2) Certbot" "$(certbot --version)"
