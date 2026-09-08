import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import syncAttendanceHandler from './api/sync-attendance.js'
import bitMediaHandler from './api/bit-media.js'

function localApiPlugin() {
  return {
    name: 'local-api-endpoints',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith('/api/sync-attendance')) {
          try {
            const parsedUrl = new URL(req.url, 'http://localhost:5173');
            req.query = Object.fromEntries(parsedUrl.searchParams);
            await syncAttendanceHandler(req, res);
          } catch (err) {
            console.error('Local API error:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message }));
          }
          return;
        }
        if (req.url && req.url.startsWith('/api/bit-media')) {
          try {
            const parsedUrl = new URL(req.url, 'http://localhost:5173');
            req.query = Object.fromEntries(parsedUrl.searchParams);
            await bitMediaHandler(req, res);
          } catch (err) {
            console.error('Local BIT Media API error:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message }));
          }
          return;
        }
        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    localApiPlugin(),
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
