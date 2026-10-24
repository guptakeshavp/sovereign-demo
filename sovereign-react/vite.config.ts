import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// Relative base so the built demo can be served from any folder or a hosted artifact path.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  server: { port: 5180, strictPort: false },
  preview: { port: 4180 },
})
