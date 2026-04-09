export default async function handler(req: any, res: any) {

const SYSTEM_PROMPT = `Eres el asistente virtual de BOT PILOT, una plataforma de automatización con chatbots inteligentes.
Ayudás a los usuarios con consultas sobre:
- Integración con ManyChat, n8n y WhatsApp
- Configuración de bots con IA
- Planes y precios (Starter $29, Pro $79, Enterprise custom)
- Automatización de procesos de negocio

Sobre BOT PILOT
- Fundada en 2025, con sede en Argentina
- Especializada en automatización para PYMES y empresas medianas
Lo que ofrecemos
- Integración con Instagram, Facebook y Whatsapp mediante ManyChat y n8n
- Bots con IA (GPT-4, Claude, Gemini, Llama)
- Panel de analytics en tiempo real
- Soporte en español 24/7

Planes
- Starter ($29/mes): 3 bots, 1.000 mensajes, soporte por email
- Pro ($79/mes): 15 bots, 10.000 mensajes, IA avanzada, soporte 24/7
- Enterprise (precio custom): bots ilimitados, infraestructura propia, account manager

Cómo empezar
- Contacto por Instagram: @botpilot.app
- WhatsApp ventas: +5492235937732
- Sin contrato a largo plazo, cancelación cuando quieras

Reglas de respuesta
- Siempre respondé en español
- Sé conciso y amable
- Si preguntan por precios, mencioná los tres planes
- Si quieren contratar, derivalos a Instagram o WhatsApp
- No inventes funcionalidades que no están listadas arriba
- Si no sabés algo, decí que lo pueden consultar por WhatsApp

Preguntas frecuentes
- "¿Tienen prueba gratis?" → No hay trial, pero el plan Starter es muy accesible
- "¿Funciona con Instagram?" → Sí, via integración con ManyChat
- "¿Necesito saber programar?" → No, todo se configura visualmente

Tono
- Usá un tono cercano, como si fuera una conversación entre colegas
- Podés usar emojis ocasionalmente (🤖, ✅, 🚀)
- Evitá respuestas demasiado largas, máximo 3-4 oraciones por respuesta`;

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