# Architecture Blueprint

The full architecture, cost plan, data model, RLS/access rules, 12-stage workflow,
customer-support flows, security checklist and build roadmap live as a living document:

**“RJ Techno Portal Blueprint”** (in Cowork / Claude).

This file is the repo-side pointer. Keep the living doc as the source of truth; copy
any section here if you need it offline.

## One-screen summary

- **Stack:** React + Vite PWA (Cloudflare Pages) · PocketBase on a 512 MB VPS · Cloudflare R2.
- **Budget:** < ₹5,000 / year, always-on (no pause/down).
- **Roles:** Vendor, Employee, Sub-vendor, Customer — vendor → sub-vendor one-way visibility.
- **Workflow:** 12 stages, sequential, 3 vendor-approval gates, GPS-verified photo per stage.
- **Support:** complaint registration (vendor red-banner) + customer K-No. work inspection.

## Build roadmap

- **M0** Foundations — schema + access rules, auth, website live.
- **M1** Employee portal — 12-stage workflow + on-site capture.
- **M2** Vendor portal — overview, approvals, My/Sub-vendor tabs, complaint banner.
- **M3** Sub-vendor portal — scoped mirror.
- **M4** Customer support — complaints + K-No. inspection.
- **M5** Hardening — security checklist, rate limits, MFA, backups.
