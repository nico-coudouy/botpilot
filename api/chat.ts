import type { VercelRequest, VercelResponse } from '@vercel/node';

const SYSTEM_PROMPT = `Eres el asistente virtual de BOT PILOT, una plataforma de automatización con chatbots inteligentes.
Ayudás a los usuarios con consultas sobre:
- Integración con ManyChat, n8n y WhatsApp
- Configuración de bots con IA
- Planes y precios (Starter $29, Pro $79, Enterprise custom)
- Automatización de procesos de negocio

Respondé siempre en español, de forma amable, concisa y profesional.`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
          ...messages
        ],
        max_tokens: 512,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Groq API error:', error);
      return res.status(500).json({ error: 'Failed to get response from AI' });
    }

    const data = await response.json();
    const message = data.choices[0].message.content;

    return res.status(200).json({ message });
  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}