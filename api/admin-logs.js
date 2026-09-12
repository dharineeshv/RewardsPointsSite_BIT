const DEFAULT_FIREBASE_DB_URL = 'https://rewards-site-7a5a8-default-rtdb.firebaseio.com';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Admin-Key, X-User-Email');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const adminKey = req.headers['x-admin-key'] || req.query.admin_key;
  const adminEmail = req.headers['x-user-email'] || req.query.email;
  const authHeader = req.headers.authorization || '';

  const isAuthorized =
    adminEmail === 'dharineesh.ct23@bitsathy.ac.in' ||
    adminKey === (process.env.ADMIN_SECRET_KEY || 'BIT_REWARDS_ADMIN_2026') ||
    authHeader.length > 20;

  if (!isAuthorized) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Direct access to logs is restricted to authorized administrators.'
    });
  }

  const fbUrl = (process.env.FIREBASE_DB_URL || DEFAULT_FIREBASE_DB_URL).replace(/\/$/, '');
  const authQuery = process.env.FIREBASE_SECRET ? `?auth=${process.env.FIREBASE_SECRET}` : '';

  try {
    const fbRes = await fetch(`${fbUrl}/logs.json${authQuery}`);
    if (!fbRes.ok) {
      return res.status(fbRes.status).json({ error: 'Failed to fetch logs from Firebase' });
    }
    const data = await fbRes.json();
    return res.status(200).json(data || {});
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
}
