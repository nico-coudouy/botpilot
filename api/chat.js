const SYSTEM_PROMPT = `Eres el asistente virtual de BOT PILOT, una plataforma de automatización con chatbots inteligentes.

## Planes
- Starter ($29/mes): 3 bots, 1.000 mensajes, soporte por email  
- Pro ($79/mes): 15 bots, 10.000 mensajes, IA avanzada, soporte 24/7
- Enterprise (precio custom): bots ilimitados, infraestructura propia, account manager

## Contacto
- Instagram: @botpilot.app
- WhatsApp: +5492235937732

Respondé siempre en español, de forma amable y concisa.`;

module.exports = async function (req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages array required' });
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages,
        ],
        max_tokens: 512,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Groq error:', JSON.stringify(data));
      return res.status(500).json({ error: 'Groq API error', detail: data });
    }

    return res.status(200).json({ message: data.choices[0].message.content });

  } catch (error) {
    console.error('Handler error:', error.message);
    return res.status(500).json({ error: error.message });
  }
};