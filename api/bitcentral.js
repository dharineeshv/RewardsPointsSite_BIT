export default async function handler(req, res) {
  // Optional Google Token validation if provided
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const googleRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (googleRes.ok) {
        const googleUser = await googleRes.json();
        if (googleUser.email && !googleUser.email.endsWith('@bitsathy.ac.in')) {
          return res.status(403).json({
            success: false,
            error: 'Forbidden',
            message: 'Access restricted to @bitsathy.ac.in institutional accounts.'
          });
        }
      }
    } catch (authErr) {
      // Graceful fallback to allow proxying read requests
    }
  }

  // 3. Target backend (server-side only, invisible to client browser)
  const BACKEND_URL = process.env.BITCENTRAL_BACKEND_URL || 'https://bitcentral-v2.onrender.com';

  const { path = '', ...queryParams } = req.query;
  const subpath = Array.isArray(path) ? path.join('/') : path;
  const queryString = new URLSearchParams(queryParams).toString();
  const targetUrl = `${BACKEND_URL}/${subpath}${queryString ? `?${queryString}` : ''}`;

  try {
    const upstreamRes = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Accept': 'application/json'
      }
    });

    const data = await upstreamRes.json();

    // Data Privacy Protection: Mask phone number so it cannot be scraped
    if (data && data.data && typeof data.data === 'object') {
      if (data.data.phone) {
        const rawPhone = String(data.data.phone);
        data.data.phone = rawPhone.length >= 7 
          ? rawPhone.slice(0, 4) + '****' + rawPhone.slice(-2)
          : 'Protected';
      }
    }

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    return res.status(upstreamRes.status).json(data);
  } catch (error) {
    console.error('Vercel Gateway Error:', error);
    return res.status(502).json({ 
      error: 'Gateway Error', 
      message: 'Failed to communicate with upstream data provider.' 
    });
  }
}
