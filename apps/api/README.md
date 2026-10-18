# apps/api — PocketBase backend

Single Go binary + SQLite. Runs always-on on a 512 MB VPS.

## Provision

1. Create a 512 MB VPS (DigitalOcean Bangalore `blr1`), point `api.<domain>` (A record) at it.
2. Run the hardened installer from the repo root:
   ```bash
   bash infra/setup-pocketbase-512mb.sh
   ```
   It sets up swap, firewall, PocketBase as a `systemd` service (auto-restart),
   built-in HTTPS, and no-reboot security patches.
3. Open `https://api.<domain>/_/` and create the admin account.

## Configure in the admin UI

- **Settings → Files storage → S3** → point to Cloudflare R2 (keeps uploads off the 10 GB disk).
- **Settings → Backups** → enable scheduled backups → S3 (R2).
- Enable **MFA** for the admin.
- Add the **Google OAuth** provider (client ID + secret).

## Schema & access rules

See `pb_schema/`. Every collection has Row-level API rules — the one-way vendor/sub-vendor
visibility and the customer K-No. scope are enforced here, not in the frontend.

## Health

- `GET /api/health` — used by the UptimeRobot monitor.
