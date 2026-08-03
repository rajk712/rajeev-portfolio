export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt' });
  }

  try {
    const url = 'https://text.pollinations.ai/' + encodeURIComponent(prompt) + '?model=openai&seed=42';
    const response = await fetch(url, { method: 'GET' });

    if (!response.ok) {
      const txt = await response.text();
      return res.status(response.status).json({ error: txt || 'API error' });
    }
    const text = await response.text();
    return res.status(200).json({ text });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}
