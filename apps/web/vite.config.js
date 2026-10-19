import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

const BASE = '/rj-techno/'

export default defineConfig({
  base: BASE,
  plugins: [
    react(),
    // selfDestroying: the service worker unregisters itself and clears old caches
    // on load — so nobody gets stuck on a stale build during active development.
    VitePWA({
      selfDestroying: true,
      registerType: 'autoUpdate',
      injectRegister: 'script-defer',
      includeAssets: ['icon.svg'],
      manifest: {
        name: 'RJ Techno Portal',
        short_name: 'RJ Techno',
        theme_color: '#15803D',
        background_color: '#FAF6EC',
        display: 'standalone',
        scope: BASE,
        start_url: BASE,
        icons: [{ src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }]
      }
    })
  ],
  build: { sourcemap: false }
})
