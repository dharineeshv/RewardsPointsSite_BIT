const DEFAULT_FIREBASE_DB_URL = 'https://rewards-site-7a5a8-default-rtdb.firebaseio.com';
const DEFAULT_PS_COOKIE = 'PS=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkRIQVJJTkVFU0ggIFYiLCJlbWFpbCI6ImRoYXJpbmVlc2guY3QyM0BiaXRzYXRoeS5hYy5pbiIsInVzZXJfaWQiOiI3Mzc2MjMyQ1QxMDkiLCJ1c2VyX29mZl9pZCI6IjczNzYyMzJDVDEwOSIsInJvbGVfaWQiOjIsImRlcHQiOiIxMyIsInllYXIiOiJJViIsInllYXJfZ3JvdXAiOiJJViIsImV4cCI6MTc4OTEyODIxMn0.BAz1deQHzJ6P13Z7aHULXS7WFnsXLPfrZlq4ezp4mhI';

// In-memory token cache to minimize Firebase roundtrips
let cachedMasterToken = null;
let lastTokenFetch = 0;

async function getMasterToken() {
  const now = Date.now();
  if (cachedMasterToken && now - lastTokenFetch < 30000) {
    return cachedMasterToken;
  }

  // 1. Check environment variable
  if (process.env.PS_SERVICE_TOKEN || process.env.PS_MASTER_TOKEN) {
    cachedMasterToken = (process.env.PS_SERVICE_TOKEN || process.env.PS_MASTER_TOKEN).trim();
    lastTokenFetch = now;
    return cachedMasterToken;
  }

  // 2. Query Firebase Realtime DB
  try {
    const fbBaseUrl = (process.env.FIREBASE_DB_URL || DEFAULT_FIREBASE_DB_URL).replace(/\/$/, '');
    const res = await fetch(`${fbBaseUrl}/ps_session/active_token.json`);
    if (res.ok) {
      const data = await res.json();
      if (typeof data === 'string' && data.length > 5) {
        cachedMasterToken = data.trim();
        lastTokenFetch = now;
        return cachedMasterToken;
      } else if (data && typeof data === 'object' && data.token) {
        cachedMasterToken = data.token.trim();
        lastTokenFetch = now;
        return cachedMasterToken;
      }
    }
  } catch (e) {
    console.warn('Could not load master PS token from Firebase:', e.message);
  }

  return DEFAULT_PS_COOKIE;
}

export default async function handler(req, res) {
  // CORS & Methods headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { path = '', token, ...queryParams } = req.query;
  const subpath = Array.isArray(path) ? path.join('/') : path;

  // 1. Health check & status endpoint
  if (subpath === 'status' || subpath === 'health') {
    const master = await getMasterToken();
    return res.status(200).json({
      status: 'active',
      proxy: 'BIT PS Direct Gateway',
      hasMasterToken: Boolean(master),
      tokenPreview: master ? `${master.slice(0, 8)}...${master.slice(-4)}` : null,
      timestamp: Date.now()
    });
  }

  // 2. Token Sync endpoint (PUT/POST to /api/ps-portal/sync-token)
  if (subpath === 'sync-token') {
    if (req.method === 'POST' || req.method === 'PUT') {
      let bodyData = req.body;
      if (typeof bodyData === 'string') {
        try { bodyData = JSON.parse(bodyData); } catch (e) {}
      }
      const newToken = bodyData?.token || token;
      if (!newToken || typeof newToken !== 'string') {
        return res.status(400).json({ error: 'Missing token in body or query' });
      }

      cachedMasterToken = newToken.trim();
      lastTokenFetch = Date.now();

      try {
        const fbBaseUrl = (process.env.FIREBASE_DB_URL || DEFAULT_FIREBASE_DB_URL).replace(/\/$/, '');
        await fetch(`${fbBaseUrl}/ps_session.json`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            active_token: newToken.trim(),
            updated_at: Date.now(),
            updated_by: bodyData?.updated_by || 'admin_console'
          })
        });
        return res.status(200).json({ success: true, message: 'Master PS token saved to Firebase!' });
      } catch (fbErr) {
        return res.status(500).json({ error: 'Failed to persist token to Firebase', details: fbErr.message });
      }
    }
  }

  // 3. Forward request to ps.bitsathy.ac.in
  const queryString = new URLSearchParams(queryParams).toString();
  const targetUrl = `https://ps.bitsathy.ac.in/${subpath}${queryString ? `?${queryString}` : ''}`;

  const forwardHeaders = {
    'Accept': 'application/json, text/plain, */*',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  };

  // Resolve authorization token
  let effectiveToken = req.headers['authorization'];
  if (!effectiveToken && token) {
    effectiveToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
  }
  if (!effectiveToken) {
    const master = await getMasterToken();
    if (master) {
      effectiveToken = master.startsWith('Bearer ') || master.startsWith('PHPSESSID=') ? master : `Bearer ${master}`;
    }
  }

  if (effectiveToken) {
    if (effectiveToken.startsWith('PHPSESSID=')) {
      forwardHeaders['Cookie'] = effectiveToken;
    } else {
      forwardHeaders['Authorization'] = effectiveToken;
    }
  }

  if (req.headers['content-type']) {
    forwardHeaders['Content-Type'] = req.headers['content-type'];
  }

  try {
    const upstreamRes = await fetch(targetUrl, {
      method: req.method,
      headers: forwardHeaders,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? (typeof req.body === 'string' ? req.body : JSON.stringify(req.body)) : undefined
    });

    const contentType = upstreamRes.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await upstreamRes.json();
      return res.status(upstreamRes.status).json(data);
    } else {
      const text = await upstreamRes.text();
      return res.status(upstreamRes.status).send(text);
    }
  } catch (error) {
    console.error('PS Portal Proxy Gateway Error:', error);
    return res.status(502).json({
      error: 'Gateway Error',
      message: 'Failed to communicate with BIT PS Portal upstream.',
      details: error.message
    });
  }
}
