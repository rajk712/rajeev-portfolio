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

  const { apiKey, prompt } = req.body;
  if (!apiKey || !prompt) {
    return res.status(400).json({ error: 'Missing apiKey or prompt' });
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey,
        'HTTP-Referer': 'https://rajeev-portfolio-topaz.vercel.app',
        'X-Title': 'SF Case Assistant'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.1-8b-instruct:free',
        max_tokens: 1200,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();
    if (!response.ok) {
      const msg = data.error ? data.error.message : 'API error';
      return res.status(response.status).json({ error: msg });
    }
    return res.status(200).json({ text: data.choices[0].message.content });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}
