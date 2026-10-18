# apps/web — RJ Techno PWA

React + Vite installable PWA. Hosts all four portals plus the public site.

## Setup

```bash
cp .env.example .env     # fill VITE_POCKETBASE_URL + VITE_GOOGLE_OAUTH_CLIENT_ID
npm install
npm run dev
```

## Key pieces

- **`src/components/GeoCameraCapture.jsx`** — on-site, live-camera photo capture with
  GPS + 150 m geofence + burned-in watermark, uploaded straight to PocketBase as WebP
  (~150 KB). **No gallery upload** is possible — frames come only from the live camera.
- **PWA** — configured in `vite.config.js` (installable, `standalone`). Add icons to
  `public/icons/` (192, 512, 512-maskable). Needs HTTPS (Cloudflare Pages provides it).

## Deploy (Cloudflare Pages)

- Build command: `npm run build` · Output dir: `dist`
- Set the two `VITE_*` env vars in the Pages project.
- Serve the public site at the root domain and the app at `app.<domain>`.

## Security notes

- Only the **public** values ship to the browser (PocketBase URL, Google OAuth *client ID*).
- The PocketBase `service_role`/admin key and OAuth *client secret* live only on the server.
- Source maps are off in production (`build.sourcemap: false`).
- Don't store tokens in `localStorage`; keep them in memory.
