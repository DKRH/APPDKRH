#!/usr/bin/env bash
set -e

echo "==> Installing Certbot"

sudo apt install -y \
    certbot \
    python3-certbot-nginx

DOMAIN="${DOMAIN:-abc.com}"

echo "==> Requesting certificate for:"
echo "  ${DOMAIN}"
echo "  www.${DOMAIN}"

sudo certbot \
    --nginx \
    --non-interactive \
    --agree-tos \
    --redirect \
    --no-eff-email \
    -d "${DOMAIN}" \
    -d "www.${DOMAIN}"

echo "==> Testing final Nginx configuration"

sudo nginx -t

echo "==> Reloading Nginx"

sudo systemctl reload nginx

echo "==> Certbot setup complete"