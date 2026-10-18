# RJ Techno — Solar Operations Portal

Multi-portal web app to run end-to-end rooftop-solar installations: **vendor, employee,
sub-vendor and customer**, with a 12-stage installation workflow and **GPS-verified
on-site photo proof**.

> Engineered to run under **₹5,000/year** on a single always-on 512 MB VPS — no pause, no downtime.

## Architecture

- **Frontend** — React + Vite **PWA**, hosted free on Cloudflare Pages.
- **Backend** — **PocketBase** (single Go binary + SQLite) on a 512 MB VPS
  (DigitalOcean Bangalore), always-on, built-in HTTPS (Let's Encrypt).
- **Storage** — Cloudflare R2 (step photos + offsite backups).
- **Auth / access** — PocketBase auth (phone OTP + Google OAuth); record-level API rules
  enforce the **vendor → sub-vendor one-way visibility** and the customer K-No. scope.

## The 4 portals

| Portal | Who | What |
|---|---|---|
| **Vendor** | owner | sees own **+ sub-vendor** projects (one-way), approvals, complaint red-banner |
| **Employee** | field staff | updates the current stage with a GPS-verified photo |
| **Sub-vendor** | partner | scoped mirror — vendor can see it, it cannot see the vendor |
| **Customer** | end user | K-No. login → work inspection + complaint registration |

## 12-stage workflow

Vendor Selection → Site Survey → System Design → Quotation\* → Customer Agreement\* →
DISCOM Application → Procurement → Mounting → Panel & Inverter → Wiring & Commissioning →
Inspection & DISCOM\* → Net Meter & Grid Sync.  *(\* = vendor approval gate)*

## Structure

```
apps/web/    React + Vite PWA (all 4 portals + public site)
apps/api/    PocketBase (schema, access rules, hooks)
infra/       server setup scripts (512 MB hardening)
docs/        architecture blueprint
```

## Quick start

1. **Backend** — provision a 512 MB VPS, point `api.<domain>` at it, then run
   `infra/setup-pocketbase-512mb.sh` (edit DOMAIN + PB_VERSION first).
2. In the PocketBase admin (`https://api.<domain>/_/`): create the schema
   (`apps/api/pb_schema/`), set access rules, switch **Files → R2**, enable
   **Backups → R2**, turn on **MFA**.
3. **Frontend** — `cd apps/web && npm i && npm run dev`; deploy to Cloudflare Pages.
4. Add a free **UptimeRobot** monitor on `https://api.<domain>/api/health`.

## Cost (target < ₹5,000/yr)

Domain ₹600–900 + VPS ~₹4,080 + Cloudflare Pages / R2 / UptimeRobot (free)
≈ **₹4,700–4,980 / year**.

---
*NAN'S Solar is a separate, earlier project — not part of this repo.*
