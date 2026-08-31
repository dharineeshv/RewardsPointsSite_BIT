export default async function handler(req, res) {
  const { path = '', ...queryParams } = req.query;
  const subpath = Array.isArray(path) ? path.join('/') : path;
  const queryString = new URLSearchParams(queryParams).toString();
  const targetUrl = `https://ps.bitsathy.ac.in/${subpath}${queryString ? `?${queryString}` : ''}`;

  const forwardHeaders = {
    'Accept': 'application/json, text/plain, */*',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Referer': 'https://ps.bitsathy.ac.in/',
    'Origin': 'https://ps.bitsathy.ac.in',
  };

  if (req.headers['authorization']) {
    forwardHeaders['Authorization'] = req.headers['authorization'];
    if (req.headers['authorization'].startsWith('Bearer ')) {
      const token = req.headers['authorization'].split(' ')[1];
      forwardHeaders['Cookie'] = `PS=${token}; ${req.headers['cookie'] || ''}`;
    }
  }
  if (req.headers['cookie'] && !forwardHeaders['Cookie']) {
    forwardHeaders['Cookie'] = req.headers['cookie'];
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
    const data = await upstreamRes.text();

    res.status(upstreamRes.status);
    try {
      return res.json(JSON.parse(data));
    } catch {
      return res.send(data);
    }
  } catch (error) {
    console.error('PS Gateway Error:', error);
    return res.status(502).json({
      error: 'Gateway Error',
      message: 'Failed to communicate with PS Portal.'
    });
  }
}
