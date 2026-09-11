// In-memory cache for ultra-fast edge responses
const cache = new Map();
const CACHE_TTL_MS = 60 * 1000; // 1 minute

const UPSTREAM_SERVERS = [
  process.env.BITCENTRAL_BACKEND_URL,
  'https://bitcentral-v2.onrender.com',
  'https://bitcentral.bitsathy.in'
].filter(Boolean);

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { path = '', ...queryParams } = req.query;
  const subpath = Array.isArray(path) ? path.join('/') : path;
  const queryString = new URLSearchParams(queryParams).toString();
  const cacheKey = `${subpath}?${queryString}`;

  // Serve from cache if available for GET
  if (req.method === 'GET' && cache.has(cacheKey)) {
    const { data, timestamp } = cache.get(cacheKey);
    if (Date.now() - timestamp < CACHE_TTL_MS) {
      res.setHeader('X-Cache', 'HIT');
      return res.status(200).json(data);
    } else {
      cache.delete(cacheKey);
    }
  }

  let lastError = null;

  // Attempt requests across upstreams with automatic failover
  for (const backend of UPSTREAM_SERVERS) {
    const targetUrl = `${backend.replace(/\/$/, '')}/${subpath}${queryString ? `?${queryString}` : ''}`;
    try {
      const upstreamRes = await fetch(targetUrl, {
        method: req.method,
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        signal: AbortSignal.timeout(8000)
      });

      if (upstreamRes.ok) {
        const data = await upstreamRes.json();

        // Privacy Protection: Mask phone number
        if (data && data.data && typeof data.data === 'object') {
          if (data.data.phone) {
            const rawPhone = String(data.data.phone);
            data.data.phone = rawPhone.length >= 7 
              ? rawPhone.slice(0, 4) + '****' + rawPhone.slice(-2)
              : 'Protected';
          }
        }

        // Cache valid response
        if (req.method === 'GET') {
          cache.set(cacheKey, { data, timestamp: Date.now() });
          if (cache.size > 2000) {
            const oldestKey = cache.keys().next().value;
            cache.delete(oldestKey);
          }
        }

        res.setHeader('X-Cache', 'MISS');
        res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
        return res.status(upstreamRes.status).json(data);
      }
    } catch (err) {
      lastError = err;
    }
  }

  console.error('All Bitcentral Upstreams failed:', lastError?.message);
  return res.status(502).json({
    error: 'Gateway Error',
    message: 'Failed to communicate with BIT Central upstream servers.',
    details: lastError?.message
  });
}
