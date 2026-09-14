import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      },
      '/google-sheets-proxy': {
        target: 'https://docs.google.com/spreadsheets',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/google-sheets-proxy/, '')
      }
    }
  }
})

