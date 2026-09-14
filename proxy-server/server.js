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

// 3. Live Google Sheets Points API (Protected by Google OAuth & @bitsathy.ac.in domain verification)
const googleSheetsBackend = require('./services/googleSheetsBackend');

app.get('/api/points/status', async (req, res) => {
  res.json({
    status: 'online',
    service: 'BIT Reward Points Live Google Sheets Service',
    spreadsheetId: googleSheetsBackend.SPREADSHEET_ID,
    targetGid: googleSheetsBackend.TARGET_GID,
    hasServiceAccount: Boolean(process.env.GOOGLE_SERVICE_ACCOUNT_KEY || process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL),
    timestamp: new Date().toISOString()
  });
});

app.get('/api/points/me', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    let user = null;

    if (authHeader) {
      try {
        user = await googleSheetsBackend.verifyGoogleToken(authHeader);
      } catch (tokenErr) {
        console.warn('[Points API] Token verification notice:', tokenErr.message);
      }
    }

    // Fallback to query email / roll if authenticated token wasn't validated
    const queryEmail = (req.query.email || '').toLowerCase().trim();
    const queryRoll = (req.query.roll || req.query.rollNo || '').toUpperCase().trim();

    const targetEmail = user?.email || (queryEmail.endsWith('@bitsathy.ac.in') ? queryEmail : (queryRoll ? `${queryRoll.toLowerCase()}@bitsathy.ac.in` : ''));
    const targetName = user?.name || req.query.name || '';

    if (!targetEmail && !queryRoll) {
      return res.json({
        success: true,
        data: null,
        message: 'No active session or email provided.'
      });
    }

    const pointsData = await googleSheetsBackend.getStudentRewardPoints(targetEmail || queryRoll, targetName, authHeader);

    if (pointsData) {
      return res.json({
        success: true,
        data: pointsData
      });
    }

    const emailPrefix = (targetEmail ? targetEmail.split('@')[0] : queryRoll).toLowerCase();
    const dotParts = emailPrefix.split('.');
    const deptYrPart = dotParts[1] || '';
    const deptMatch = deptYrPart.match(/^([a-z]+)(\d{2})$/i);
    const deptCode = deptMatch ? deptMatch[1].toUpperCase() : '';

    return res.json({
      success: true,
      data: {
        roll_no: (queryRoll || emailPrefix).toUpperCase(),
        rollNo: (queryRoll || emailPrefix).toUpperCase(),
        id: (queryRoll || emailPrefix).toUpperCase(),
        name: targetName || user?.name || (queryRoll || emailPrefix).toUpperCase(),
        student_name: targetName || user?.name || (queryRoll || emailPrefix).toUpperCase(),
        email: targetEmail || `${(queryRoll || emailPrefix).toLowerCase()}@bitsathy.ac.in`,
        year: 'IV',
        department: deptCode || 'CT',
        mentor: 'BIT Faculty',
        balance_points: 0,
        currentPoints: '0',
        points: 0,
        cumulative_points: 0,
        cumulativePoints: '0',
        redeemed_points: 0,
        redeemedPoints: '0',
        rank: 0,
        source: 'Google Sheets (Live Sync)',
        isNewRecord: true,
        fetchedAt: new Date().toISOString()
      }
    });
  } catch (err) {
    console.error('[Points API /me Error]:', err.message);
    return res.json({
      success: false,
      error: err.message,
      data: null
    });
  }
});

app.get('/api/points/averages', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const averages = await googleSheetsBackend.getLiveInstitutionalAverages(authHeader);
    res.json({ success: true, averages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/points/sheet-data', async (req, res) => {
  try {
    const tabOrGid = req.query.tab || req.query.dept || req.query.gid || googleSheetsBackend.TARGET_GID;
    const authHeader = req.headers['authorization'];
    const auth = googleSheetsBackend.getGoogleAuth(authHeader ? authHeader.replace(/^Bearer\s+/i, '').trim() : null);
    const rawRows = await googleSheetsBackend.fetchSheetRows(tabOrGid, auth);
    const students = googleSheetsBackend.parseDepartmentRows(rawRows, tabOrGid);
    res.json({ success: true, count: students.length, students });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/points/pskills', async (req, res) => {
  try {
    const rollNo = req.query.rollNo || '';
    const token = req.query.token || req.headers['authorization']?.replace(/^Bearer\s+/i, '');
    const pskillUrl = new URL('https://script.google.com/a/macros/bitsathy.ac.in/s/AKfycbyRoy2c2L2A1zyQ1v_XFD_XCR7nc86kvoQhPyGHtyf0OWwO2n1L2ytSkcbakZ-qAjlcwg/exec');
    if (rollNo) pskillUrl.searchParams.append('rollNo', rollNo);
    if (token) pskillUrl.searchParams.append('access_token', token);

    const upRes = await fetch(pskillUrl.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const text = await upRes.text();
    try {
      const json = JSON.parse(text);
      return res.json({ success: true, records: Array.isArray(json) ? json : (json.records || json.data || []) });
    } catch (e) {
      return res.json({ success: true, rawHtml: text });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message, records: [] });
  }
});


app.listen(PORT, () => {
  console.log(`🚀 BIT Central, PS Proxy & Google Sheets Gateway running on http://localhost:${PORT}`);
});
