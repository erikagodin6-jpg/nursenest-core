#!/usr/bin/env bash
#
# First-time Ubuntu Droplet bootstrap for NurseNest Core (Node + PM2 + Caddy).
# Run as root: sudo bash bootstrap-ubuntu.sh
#
set -euo pipefail

export DEBIAN_FRONTEND=noninteractive

apt-get update -y
apt-get install -y --no-install-recommends \
  ca-certificates curl gnupg git ufw jq

# Node.js 20.x (NodeSource)
if ! command -v node >/dev/null 2>&1 || [[ "$(node -v 2>/dev/null || true)" != v20* ]]; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi

npm install -g pm2

# Caddy (stable) — official installer
if ! command -v caddy >/dev/null 2>&1; then
  apt-get install -y debian-keyring debian-archive-keyring apt-transport-https curl
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list
  apt-get update -y
  apt-get install -y caddy
fi

systemctl enable caddy

echo ""
echo "Bootstrap complete."
echo "Next:"
echo "  1) ufw allow OpenSSH && ufw allow 80 && ufw allow 443 && ufw enable"
echo "  2) Clone repo; configure Caddyfile.example; set env file"
echo "  3) Run deploy-app.sh as deploy user (not root recommended for git/pm2)"
echo ""
