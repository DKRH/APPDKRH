import { $ } from "bun";

/*await $`bun run build`;

const DEPLOY2 = {
  name: "prod",
  host: "123.45.67.89",
  user: "root",
  appDir: "/home/dkrh/app",
};*/

const DEPLOY = {
  name: Bun.env.DEPLOY_NAME!,
  host: Bun.env.DEPLOY_HOST!,
  user: Bun.env.DEPLOY_USER!,
  appDir: Bun.env.DEPLOY_APP_DIR!,
};

await $`
scp -r
dist/*
${DEPLOY.user}@${DEPLOY.host}:${DEPLOY.appDir}/
`;

await $`
ssh
${DEPLOY.user}@${DEPLOY.host}
'
cd ${DEPLOY.appDir}

chmod +x server.exe

if [ ! -f /etc/systemd/system/dkrh.service ]; then
cat > /etc/systemd/system/dkrh.service <<EOF
[Unit]
Description=DKRH Hono Server
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=${DEPLOY.appDir}
ExecStart=${DEPLOY.appDir}/server.exe
Restart=always
RestartSec=5
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable dkrh
fi

systemctl restart dkrh
'
`;