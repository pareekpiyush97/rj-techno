#!/usr/bin/env bash
# =============================================================================
# Hardened PocketBase on a 512MB VPS  —  built for near-zero downtime.
# Tested target: Ubuntu 22.04/24.04, amd64 (DigitalOcean $4 Bangalore droplet).
# If you chose Hetzner ARM, change _amd64 -> _arm64 in PB_URL below.
# Run as root:  bash setup-pocketbase-512mb.sh
# =============================================================================
set -euo pipefail

### ---------------- EDIT THESE ----------------
DOMAIN="api.nanssolar.in"        # DNS A-record must already point here
PB_VERSION="0.22.21"             # check github.com/pocketbase/pocketbase/releases
### -------------------------------------------

PB_USER="pocketbase"
PB_DIR="/opt/pocketbase"
PB_URL="https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip"

echo ">> 1/6  Swap (2GB) — stops OOM kills on 512MB"
if ! swapon --show | grep -q '/swapfile'; then
  fallocate -l 2G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi
sysctl -w vm.swappiness=10 >/dev/null
grep -q 'vm.swappiness' /etc/sysctl.conf || echo 'vm.swappiness=10' >> /etc/sysctl.conf

echo ">> 2/6  Packages + firewall"
apt-get update -y
apt-get install -y ufw fail2ban unzip curl unattended-upgrades
ufw allow OpenSSH >/dev/null
ufw allow 80  >/dev/null
ufw allow 443 >/dev/null
ufw --force enable >/dev/null

echo ">> 3/6  PocketBase user + binary"
id -u "$PB_USER" &>/dev/null || useradd -r -m -d "$PB_DIR" -s /usr/sbin/nologin "$PB_USER"
mkdir -p "$PB_DIR"
cd "$PB_DIR"
curl -fsSL -o pb.zip "$PB_URL"
unzip -o pb.zip pocketbase
rm -f pb.zip
chown -R "$PB_USER":"$PB_USER" "$PB_DIR"
# let a non-root process bind to ports 80/443
setcap 'cap_net_bind_service=+ep' "$PB_DIR/pocketbase"

echo ">> 4/6  systemd service — auto-restart + built-in Let's Encrypt HTTPS"
cat >/etc/systemd/system/pocketbase.service <<EOF
[Unit]
Description=PocketBase
After=network.target

[Service]
Type=simple
User=$PB_USER
WorkingDirectory=$PB_DIR
# 'serve <domain>' binds :80 + :443 and auto-manages the TLS cert
ExecStart=$PB_DIR/pocketbase serve $DOMAIN
Restart=always
RestartSec=3
LimitNOFILE=8192
# memory guardrail: if it ever balloons, restart cleanly instead of hanging
MemoryHigh=360M
MemoryMax=420M

[Install]
WantedBy=multi-user.target
EOF
systemctl daemon-reload
systemctl enable --now pocketbase

echo ">> 5/6  Security patches WITHOUT surprise reboots (keeps uptime)"
cat >/etc/apt/apt.conf.d/51nans-noreboot <<'EOF'
Unattended-Upgrade::Automatic-Reboot "false";
EOF
systemctl enable --now unattended-upgrades >/dev/null 2>&1 || true

echo ">> 6/6  Done."
cat <<EOF

NEXT (in the PocketBase Admin UI  ->  https://$DOMAIN/_/):
  1. Create the admin account (do it now; no default creds).
  2. Settings -> Files storage  -> switch to S3  -> point to Cloudflare R2
     (uploads stay off the 10GB disk, and survive a VPS rebuild).
  3. Settings -> Backups -> enable auto-backup (cron) -> S3 (R2) target.
  4. Enable MFA for the admin.

EXTERNAL WATCHDOG (free): add an UptimeRobot HTTP monitor on
  https://$DOMAIN/api/health   (alerts you within ~1 min if it ever drops)

DISASTER RECOVERY: turn on DigitalOcean weekly backups/snapshots.
  With R2 file storage + PB backups, a dead VPS is a ~5 min rebuild.
EOF
