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
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            const authHeader = req.headers['authorization'];
            const referer = req.headers['referer'] || req.headers['origin'] || '';
            // Block direct Postman / curl calls without token or browser referer
            if (!authHeader && !referer.includes('localhost:5173')) {
              res.writeHead(401, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ 
                error: 'Unauthorized', 
                message: 'Unauthorized access.Please Provide a valid token or access through the app.' 
              }));
              return;
            }
          });
        }
      },
      '/api/ps': {
        target: 'https://ps.bitsathy.ac.in',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ps/, ''),
        headers: {
          referer: 'https://ps.bitsathy.ac.in/',
          origin: 'https://ps.bitsathy.ac.in',
        },
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            const authHeader = req.headers['authorization'];
            if (authHeader && authHeader.startsWith('Bearer ')) {
              const token = authHeader.split(' ')[1];
              const existingCookie = req.headers['cookie'] || '';
              proxyReq.setHeader('Cookie', `PS=${token}; ${existingCookie}`);
            }
          });
        },
      },
    },
  },
})

