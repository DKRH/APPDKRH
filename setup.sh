#!/usr/bin/env bash
set -e

echo "==> Updating packages"
sudo apt update
sudo apt upgrade -y

echo "==> Installing system dependencies"
sudo apt install -y \
    curl \
    wget \
    git \
    unzip \
    zip \
    build-essential \
    ca-certificates \
    pkg-config \
    libssl-dev \
    openssl \
    dos2unix \
    jq \
    ripgrep \
    fd-find \
    htop \
    patchelf \
    nginx \
    certbot \
    python3-certbot-nginx

# ============================================================
# Bun
# ============================================================

echo "==> Installing Bun"

if command -v bun >/dev/null 2>&1; then
    echo "Bun already installed:"
    bun --version
else
    curl -fsSL https://bun.sh/install | bash
fi

export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"

echo "Bun:"
bun --version

# ============================================================
# uv / Python
# ============================================================

echo "==> Installing uv"

if command -v uv >/dev/null 2>&1; then
    echo "uv already installed:"
    uv --version
else
    curl -LsSf https://astral.sh/uv/install.sh | sh
fi


export PATH="$HOME/.local/bin:$PATH"

echo "uv:"
uv --version

# ============================================================
# Python
# ============================================================

echo
echo "==> Installing Python through uv"

uv python install 3.12

echo "Python:"
uv run --python 3.12 python --version

# ============================================================
# Go
# ============================================================

echo "==> Installing Go"

if command -v go >/dev/null 2>&1; then
    echo "Go already installed:"
    go version
else
    sudo apt install -y golang-go
fi

echo "Go:"
go version

# ============================================================
# Air for Go hot reload
# ============================================================

echo "==> Installing Air"

go install github.com/air-verse/air@latest

export PATH="$HOME/go/bin:$PATH"

echo "Air:"
air -v || true

# ============================================================
# Java
# ============================================================

echo "==> Installing Java"

if command -v java >/dev/null 2>&1; then
    echo "Java already installed:"
    java -version
else
    sudo apt install -y openjdk-25-jdk
fi

echo "Java:"
java -version

# ============================================================
# Environment
# ============================================================

echo "==> Adding environment variables"

cat >> "$HOME/.bashrc" <<'EOF'

# DKRH development tools
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$HOME/.local/bin:$HOME/go/bin:$PATH"
EOF

# Reload for current shell
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$HOME/.local/bin:$HOME/go/bin:$PATH"


# ============================================================
# Nginx
# ============================================================

echo
echo "==> Configuring Nginx"

DOMAIN="abc.com"
NGINX_CONFIG="/etc/nginx/sites-available/${DOMAIN}.conf"
NGINX_ENABLED="/etc/nginx/sites-enabled/${DOMAIN}.conf"

sudo mkdir -p /etc/nginx/sites-available
sudo mkdir -p /etc/nginx/sites-enabled

# ------------------------------------------------------------
# Create/update Nginx configuration
#
# IMPORTANT:
# This initial configuration is HTTP only.
# Certbot will add the SSL configuration afterwards.
# ------------------------------------------------------------

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
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    access_log /var/log/nginx/${DOMAIN}.access.log;
    error_log /var/log/nginx/${DOMAIN}.error.log;
}
EOF

# ------------------------------------------------------------
# Enable site
# ------------------------------------------------------------

echo "==> Enabling ${DOMAIN}"

sudo ln -sf "$NGINX_CONFIG" "$NGINX_ENABLED"

# Disable default Nginx site if it exists
if [ -e /etc/nginx/sites-enabled/default ]; then
    echo "==> Disabling default Nginx site"
    sudo rm -f /etc/nginx/sites-enabled/default
fi

# ------------------------------------------------------------
# Test Nginx
# ------------------------------------------------------------

echo "==> Testing Nginx configuration"

sudo nginx -t

# ------------------------------------------------------------
# Start/reload Nginx
# ------------------------------------------------------------

echo "==> Enabling Nginx service"

sudo systemctl enable nginx

echo "==> Restarting Nginx"

sudo systemctl restart nginx

# ============================================================
# Let's Encrypt
# ============================================================

echo
echo "==> Configuring Let's Encrypt"

echo "Requesting certificate for:"
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

# ------------------------------------------------------------
# Test final Nginx configuration
# ------------------------------------------------------------

echo
echo "==> Testing final Nginx configuration"

sudo nginx -t

echo "==> Reloading Nginx"

sudo systemctl reload nginx

# ============================================================
# Systemd Services
# ============================================================

echo
echo "==> Creating DKRH systemd services"

sudo tee /etc/systemd/system/dkrh-hono.service > /dev/null <<'EOF'
[Unit]
Description=DKRH Hono Server
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/home/dkrh/project
ExecStart=/home/dkrh/project/hono/serverHono
Restart=always
RestartSec=5
EnvironmentFile=/home/dkrh/project/.env

[Install]
WantedBy=multi-user.target
EOF


sudo tee /etc/systemd/system/dkrh-go.service > /dev/null <<'EOF'
[Unit]
Description=DKRH Go Server
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/home/dkrh/project
ExecStart=/home/dkrh/project/go/serverGo
Restart=always
RestartSec=5
EnvironmentFile=/home/dkrh/project/.env

[Install]
WantedBy=multi-user.target
EOF


sudo tee /etc/systemd/system/dkrh-spring.service > /dev/null <<'EOF'
[Unit]
Description=DKRH Spring Boot Server
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/home/dkrh/project
ExecStart=/usr/bin/java -jar /home/dkrh/project/spring/serverSpringKT.jar
Restart=always
RestartSec=5
EnvironmentFile=/home/dkrh/project/.env

[Install]
WantedBy=multi-user.target
EOF


sudo tee /etc/systemd/system/dkrh-dotnet.service > /dev/null <<'EOF'
[Unit]
Description=DKRH .NET Server
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/home/dkrh/project
ExecStart=/home/dkrh/project/dotnet/serverDotnet
Restart=always
RestartSec=5
EnvironmentFile=/home/dkrh/project/.env

[Install]
WantedBy=multi-user.target
EOF


# ============================================================
# Enable Services
# ============================================================

echo "==> Reloading systemd"

sudo systemctl daemon-reload

echo "==> Enabling DKRH services"

sudo systemctl enable dkrh-hono
sudo systemctl enable dkrh-go
sudo systemctl enable dkrh-spring
sudo systemctl enable dkrh-dotnet

echo "==> Starting DKRH services"

sudo systemctl start dkrh-hono
sudo systemctl start dkrh-go
sudo systemctl start dkrh-spring
sudo systemctl start dkrh-dotnet

echo "==> DKRH services created"

sudo systemctl --no-pager --full status dkrh-hono || true
sudo systemctl --no-pager --full status dkrh-go || true
sudo systemctl --no-pager --full status dkrh-spring || true
sudo systemctl --no-pager --full status dkrh-dotnet || true

# ============================================================
# Versions
# ============================================================

echo
echo "========================================"
echo "Installed development environment"
echo "========================================"

echo "Bun:"
bun --version

echo "uv:"
uv --version

echo
echo "Python:"
uv run --python 3.12 python --version

echo "Go:"
go version

echo "Java:"
java -version 2>&1 | head -n 1

echo
echo "Nginx:"
nginx -v 2>&1

echo
echo "Certbot:"
certbot --version

echo
echo "========================================"
echo "Nginx status"
echo "========================================"

sudo systemctl --no-pager status nginx | head -n 15

echo
echo "========================================"
echo "Done"
echo "========================================"

echo
echo "Website:"
echo "  https://${DOMAIN}"

echo
echo "Hono:"
echo "  https://${DOMAIN}/api-hono/"

echo
echo "Go:"
echo "  https://${DOMAIN}/api-go/"

echo
echo "Spring:"
echo "  https://${DOMAIN}/api-spring/"

echo
echo ".NET:"
echo "  https://${DOMAIN}/api-dotnet/"