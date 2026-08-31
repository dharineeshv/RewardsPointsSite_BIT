export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-ps-token, Cookie');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { path = '', ps_token = '', ...queryParams } = req.query;
  const subpath = Array.isArray(path) ? path.join('/') : path;
  const queryString = new URLSearchParams(queryParams).toString();
  const targetUrl = `https://ps.bitsathy.ac.in/${subpath}${queryString ? `?${queryString}` : ''}`;

  // Extract Token from Authorization header, x-ps-token, Cookie, or query
  let token = '';
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.headers['x-ps-token']) {
    token = req.headers['x-ps-token'];
  } else if (ps_token) {
    token = ps_token;
  } else if (req.headers['cookie'] && req.headers['cookie'].includes('PS=')) {
    const m = req.headers['cookie'].match(/PS=([^;]+)/);
    if (m) token = m[1];
  }

  const forwardHeaders = {
    'Accept': 'application/json, text/plain, */*',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://ps.bitsathy.ac.in/',
    'Origin': 'https://ps.bitsathy.ac.in',
  };

  if (token) {
    forwardHeaders['Authorization'] = `Bearer ${token}`;
    forwardHeaders['Cookie'] = `PS=${token}`;
  }
  if (req.headers['content-type']) {
    forwardHeaders['Content-Type'] = req.headers['content-type'];
  }

  try {
    const fetchOptions = {
      method: req.method,
      headers: forwardHeaders,
    };

    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
      fetchOptions.body = typeof req.body === 'object' ? JSON.stringify(req.body) : req.body;
    }

    const upstreamRes = await fetch(targetUrl, fetchOptions);
    const textData = await upstreamRes.text();

    res.status(upstreamRes.status);
    try {
      return res.json(JSON.parse(textData));
    } catch {
      return res.send(textData);
    }
  } catch (error) {
    console.error('PS Gateway Error:', error);
    return res.status(502).json({
      error: 'Gateway Error',
      message: 'Failed to communicate with PS Portal.'
    });
  }
}
