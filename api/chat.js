// api/chat.js - Quick fix version
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, provider = 'gemini' } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    let response;

    switch (provider) {
      case 'gemini':
        response = await callGeminiAPI(message);
        break;
      case 'openrouter':
        response = await callOpenRouterAPI(message);
        break;
      default:
        return res.status(400).json({ error: 'Invalid provider' });
    }

    res.status(200).json({ response });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: error.message });
  }
}

// Gemini API - This should work
async function callGeminiAPI(message) {
  const API_KEY = process.env.GEMINI_API_KEY || 'Your-Gemini-Key';
  
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `You are a helpful travel assistant for a trip planning website called Travel Craft. Answer the user's question in a friendly and helpful manner. User question: ${message}`
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  
  if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
    return data.candidates[0].content.parts[0].text;
  }
  
  throw new Error('Invalid response from Gemini API');
}

// OpenRouter API - Now using your key
async function callOpenRouterAPI(message) {
  const API_KEY = process.env.OPENROUTER_API_KEY || 'Your-OpenRouter-Key';
  
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
      'HTTP-Referer': 'http://localhost:3000',
      'X-Title': 'Travel Craft AI Assistant'
    },
    body: JSON.stringify({
      model: 'anthropic/claude-3.5-sonnet:beta',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful travel assistant for a trip planning website called Travel Craft. Answer questions in a friendly and helpful manner.'
        },
        {
          role: 'user',
          content: message
        }
      ],
      max_tokens: 1000,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`OpenRouter API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  
  if (data.choices?.[0]?.message?.content) {
    return data.choices[0].message.content;
  }
  
  throw new Error('Invalid response from OpenRouter API');
}