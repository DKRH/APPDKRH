#!/usr/bin/env bash
set -e

echo "==> Installing Nginx"

sudo apt install -y nginx

DOMAIN="${DOMAIN:-abc.com}"

NGINX_CONFIG="/etc/nginx/sites-available/${DOMAIN}.conf"
NGINX_ENABLED="/etc/nginx/sites-enabled/${DOMAIN}.conf"

sudo mkdir -p /etc/nginx/sites-available
sudo mkdir -p /etc/nginx/sites-enabled

echo "==> Writing ${NGINX_CONFIG}"

sudo tee "$NGINX_CONFIG" > /dev/null <<EOF
server {
    listen 80;
    listen [::]:80;

    server_name ${DOMAIN} www.${DOMAIN};

    # SvelteKit Static SPA
    location / {
        root /home/dkrh/project/html;
        try_files \$uri \$uri/ /index.html;
    }

    # Hono
    location /api-hono/ {
        proxy_pass http://127.0.0.1:2601/;

        proxy_http_version 1.1;
        proxy_buffering off;
        proxy_request_buffering off;

        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Connection "";
    }

    # Go
    location /api-go/ {
        proxy_pass http://127.0.0.1:2602/;

        proxy_http_version 1.1;

        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Spring Boot
    location /api-spring/ {
        proxy_pass http://127.0.0.1:2603/;

        proxy_http_version 1.1;

        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # .NET
    location /api-dotnet/ {
        proxy_pass http://127.0.0.1:2604/;

        proxy_http_version 1.1;

        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    access_log /var/log/nginx/${DOMAIN}.access.log;
    error_log /var/log/nginx/${DOMAIN}.error.log;
}
EOF

echo "==> Enabling ${DOMAIN}"

sudo ln -sf "$NGINX_CONFIG" "$NGINX_ENABLED"

if [ -e /etc/nginx/sites-enabled/default ]; then
    echo "==> Disabling default Nginx site"
    sudo rm -f /etc/nginx/sites-enabled/default
fi

echo "==> Testing Nginx configuration"

sudo nginx -t

echo "==> Enabling Nginx service"

sudo systemctl enable nginx

echo "==> Restarting Nginx"

sudo systemctl restart nginx

echo "==> Nginx setup complete"