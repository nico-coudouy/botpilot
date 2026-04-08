import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import Stripe from 'stripe';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || '0123456789abcdef0123456789abcdef'; // Must be 32 chars
const IV_LENGTH = 16;

function encrypt(text: string) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  let stripe: Stripe | null = null;
  const getStripe = () => {
    if (!stripe && process.env.STRIPE_SECRET_KEY) {
      stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    }
    return stripe;
  };

  // Stripe Webhook (Must be before express.json())
  app.post('/api/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const stripeClient = getStripe();

    if (!stripeClient || !sig || !webhookSecret) {
      console.error('Stripe webhook configuration missing');
      return res.status(400).send('Webhook Error: Configuration missing');
    }

    let event;

    try {
      event = stripeClient.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook Error: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.client_reference_id;
      const plan = session.metadata?.plan;

      if (userId && plan) {
        console.log(`User ${userId} subscribed to ${plan}`);
        // In a real app, you'd use firebase-admin here to update Firestore.
        // For this demo, we'll log it. The client will also check status.
      }
    }

    res.json({ received: true });
  });

  app.use(express.json());

  // Encryption Endpoint
  app.post('/api/encrypt', (req, res) => {
    const { value } = req.body;
    if (!value) return res.status(400).json({ error: 'Value required' });
    try {
      const encryptedValue = encrypt(value);
      res.json({ encryptedValue });
    } catch (err: any) {
      console.error('Encryption error:', err);
      res.status(500).json({ error: 'Encryption failed' });
    }
  });

  // Groq Chat Endpoint
  app.post('/api/chat', async (req, res) => {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: 'Groq API key not configured' });
    }

    try {
      const { default: Groq } = await import('groq-sdk');
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
      
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: 'Eres el asistente virtual de BOT PILOT, una plataforma de automatización de chatbots con IA. Eres amable, conciso y ayudas a los usuarios a entender cómo BOT PILOT puede escalar sus negocios conectando ManyChat, n8n y WhatsApp.' },
          ...messages
        ],
        model: 'llama3-8b-8192',
        temperature: 0.7,
        max_tokens: 1024,
      });

      res.json({ message: chatCompletion.choices[0]?.message?.content || 'Sin respuesta' });
    } catch (err: any) {
      console.error('Groq API error:', err);
      res.status(500).json({ error: 'Failed to get response from Groq' });
    }
  });

  // API Routes
  app.post('/api/create-checkout-session', async (req, res) => {
    const { planId, userId, userEmail } = req.body;
    const stripeClient = getStripe();

    if (!stripeClient) {
      return res.status(500).json({ error: 'Stripe not configured' });
    }

    const plans: Record<string, { name: string; price: number }> = {
      basic: { name: 'Plan Básico', price: 2900 }, // $29.00
      pro: { name: 'Plan Pro', price: 7900 }, // $79.00
      enterprise: { name: 'Plan Enterprise', price: 19900 }, // $199.00
    };

    const plan = plans[planId];
    if (!plan) return res.status(400).json({ error: 'Invalid plan' });

    try {
      const session = await stripeClient.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: plan.name,
              },
              unit_amount: plan.price,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.APP_URL}/dashboard/pricing`,
        client_reference_id: userId,
        customer_email: userEmail,
        metadata: {
          plan: planId,
        },
      });

      res.json({ id: session.id, url: session.url });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
