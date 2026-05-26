import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'

// SPA fallback for GitHub Pages: after the build, copy index.html → 404.html
// so any deep link (e.g. /Chezburgar/settings) loads the React app instead of
// GH Pages' own 404 page. The router takes over once the bundle hydrates.
function spaFallback(): import('vite').Plugin {
  return {
    name: 'spa-404-fallback',
    apply: 'build',
    closeBundle() {
      const dist = resolve(__dirname, 'dist')
      copyFileSync(resolve(dist, 'index.html'), resolve(dist, '404.html'))
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react(), spaFallback()],
  // Dev runs at `/`; production build serves from `/Chezburgar/` on
  // chezburgar.github.io. The router reads `import.meta.env.BASE_URL` so
  // routes are correct in both environments.
  base: command === 'build' ? '/Chezburgar/' : '/',
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
}))
