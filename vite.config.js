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
      '/api/bitcentral': {
        target: 'https://bitcentral-v2.onrender.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/bitcentral/, ''),
      },
      '/api/ps-portal': {
        target: 'https://ps.bitsathy.ac.in',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ps-portal/, ''),
        secure: false,
      },
    },
  },
})
