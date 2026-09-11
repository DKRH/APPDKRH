#!/usr/bin/env bash
set -e

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