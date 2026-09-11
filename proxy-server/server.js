/**
 * Lightweight BIT Central & PS Portal Proxy Microservice
 * Ready for 1-click deployment on Render, Railway, or VPS.
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const DEFAULT_FIREBASE_DB_URL = process.env.FIREBASE_DB_URL || 'https://rewards-site-7a5a8-default-rtdb.firebaseio.com';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory cache
const cache = new Map();
const CACHE_TTL_MS = 60 * 1000;

let cachedMasterToken = process.env.PS_SERVICE_TOKEN || process.env.PS_MASTER_TOKEN || null;
let lastTokenFetch = 0;

async function getMasterToken() {
  const now = Date.now();
  if (cachedMasterToken && now - lastTokenFetch < 30000) return cachedMasterToken;

  if (process.env.PS_SERVICE_TOKEN || process.env.PS_MASTER_TOKEN) {
    cachedMasterToken = (process.env.PS_SERVICE_TOKEN || process.env.PS_MASTER_TOKEN).trim();
    lastTokenFetch = now;
    return cachedMasterToken;
  }

  try {
    const fbBaseUrl = DEFAULT_FIREBASE_DB_URL.replace(/\/$/, '');
    const res = await fetch(`${fbBaseUrl}/ps_session/active_token.json`);
    if (res.ok) {
      const data = await res.json();
      if (typeof data === 'string' && data.length > 5) {
        cachedMasterToken = data.trim();
        lastTokenFetch = now;
        return cachedMasterToken;
      }
    }
  } catch (e) {}

  return null;
}

// Health Check
app.get('/', async (req, res) => {
  const token = await getMasterToken();
  res.json({
    status: 'online',
    service: 'BIT Central & PS Portal Proxy Gateway',
    hasMasterToken: Boolean(token),
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => res.json({ status: 'healthy', uptime: process.uptime() }));

// 1. Bitcentral API Proxy
app.all('/api/bitcentral/*', async (req, res) => {
  const subpath = req.params[0] || '';
  const queryString = new URLSearchParams(req.query).toString();
  const cacheKey = `bitcentral:${subpath}?${queryString}`;

  if (req.method === 'GET' && cache.has(cacheKey)) {
    const { data, timestamp } = cache.get(cacheKey);
    if (Date.now() - timestamp < CACHE_TTL_MS) {
      res.setHeader('X-Cache', 'HIT');
      return res.json(data);
    }
  }

  const UPSTREAM_SERVERS = [
    process.env.BITCENTRAL_BACKEND_URL,
    'https://bitcentral-v2.onrender.com',
    'https://bitcentral.bitsathy.in'
  ].filter(Boolean);

  let lastErr = null;
  for (const upstream of UPSTREAM_SERVERS) {
    try {
      const targetUrl = `${upstream.replace(/\/$/, '')}/${subpath}${queryString ? '?' + queryString : ''}`;
      const upRes = await fetch(targetUrl, {
        method: req.method,
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'User-Agent': 'Mozilla/5.0'
        },
        body: ['POST', 'PUT', 'PATCH'].includes(req.method) ? JSON.stringify(req.body) : undefined
      });

      if (upRes.ok) {
        const data = await upRes.json();
        if (req.method === 'GET') cache.set(cacheKey, { data, timestamp: Date.now() });
        res.setHeader('X-Cache', 'MISS');
        return res.status(upRes.status).json(data);
      }
    } catch (e) {
      lastErr = e;
    }
  }

  res.status(502).json({ error: 'Gateway Error', message: 'Failed to communicate with BIT Central upstream', details: lastErr?.message });
});

// 2. PS Portal Direct Proxy
app.all('/api/ps-portal/*', async (req, res) => {
  const subpath = req.params[0] || '';

  if (subpath === 'sync-token' && ['POST', 'PUT'].includes(req.method)) {
    const newToken = req.body?.token || req.query?.token;
    if (!newToken) return res.status(400).json({ error: 'Missing token' });

    cachedMasterToken = newToken.trim();
    lastTokenFetch = Date.now();

    try {
      const fbBaseUrl = DEFAULT_FIREBASE_DB_URL.replace(/\/$/, '');
      await fetch(`${fbBaseUrl}/ps_session.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          active_token: newToken.trim(),
          updated_at: Date.now(),
          updated_by: req.body?.updated_by || 'admin_proxy'
        })
      });
      return res.json({ success: true, message: 'Master PS token saved to Firebase!' });
    } catch (e) {
      return res.status(500).json({ error: 'Failed to persist token', details: e.message });
    }
  }

  const queryString = new URLSearchParams(req.query).toString();
  const targetUrl = `https://ps.bitsathy.ac.in/${subpath}${queryString ? '?' + queryString : ''}`;

  const headers = {
    'Accept': 'application/json, text/plain, */*',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  };

  let token = req.headers['authorization'] || req.query.token;
  if (!token) token = await getMasterToken();

  if (token) {
    if (token.startsWith('PHPSESSID=')) {
      headers['Cookie'] = token;
    } else {
      headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    }
  }

  try {
    const upRes = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: ['POST', 'PUT', 'PATCH'].includes(req.method) ? JSON.stringify(req.body) : undefined
    });

    const contentType = upRes.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await upRes.json();
      return res.status(upRes.status).json(data);
    } else {
      const text = await upRes.text();
      return res.status(upRes.status).send(text);
    }
  } catch (e) {
    res.status(502).json({ error: 'PS Gateway Error', details: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 BIT Central & PS Proxy running on http://localhost:${PORT}`);
});
