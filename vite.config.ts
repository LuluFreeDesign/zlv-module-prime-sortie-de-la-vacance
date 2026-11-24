import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'
import type { Plugin } from 'vite'
import { readFileSync } from 'fs'

// Load the DSFR fonts from the jsDelivr CDN instead of inlining them in the single-file build
const dsfrVersion = JSON.parse(
  readFileSync(path.resolve(__dirname, 'node_modules/@gouvfr/dsfr/package.json'), 'utf-8'),
).version
const dsfrFontsCdn = (): Plugin => ({
  name: 'dsfr-fonts-cdn',
  enforce: 'pre',
  transform(code, id) {
    if (!id.includes('@gouvfr/dsfr') || !id.endsWith('.css')) return
    return code.replace(
      /url\((['"]?)\.\.\/fonts\//g,
      `url($1https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@${dsfrVersion}/dist/fonts/`,
    )
  },
})

export default defineConfig({
  base: './',
  plugins: [
    dsfrFontsCdn(),
    react(),
    tailwindcss(),
    viteSingleFile(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },
})
