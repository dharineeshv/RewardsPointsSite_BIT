// Serverless API endpoint to fetch BIT Campus Media, Circulars & Posters
export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const perPage = req.query?.per_page || 6;
  const page = req.query?.page || 1;

  try {
    const url = `https://bitsathy.ac.in/wp-json/wp/v2/media?per_page=${perPage}&page=${page}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      const fbUrl = `https://www.bitsathy.ac.in/wp-json/wp/v2/media?per_page=${perPage}&page=${page}`;
      const fbResponse = await fetch(fbUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      if (!fbResponse.ok) {
        throw new Error(`Upstream returned ${response.status}`);
      }
      const data = await fbResponse.json();
      return res.status(200).json({ success: true, data });
    }

    const data = await response.json();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching BIT media:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
