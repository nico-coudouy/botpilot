# BOT PILOT — Landing Page

Sitio web de presentación de BOT PILOT, plataforma de automatización con chatbots inteligentes para Instagram, Facebook y WhatsApp.

## Stack

- **React + TypeScript** — Vite
- **Tailwind CSS**
- **Framer Motion** — animaciones
- **Firebase** — autenticación y base de datos
- **Groq AI** — chat de demo en tiempo real

## Secciones

- Hero con llamada a la acción
- Demo de chat en vivo con asistente IA
- Características y beneficios
- Testimonios
- Planes y precios (Starter, Pro, Enterprise)
- CTA final con link a Instagram y WhatsApp

## Correr localmente

**Requisitos:** Node.js 18+

1. Clonar el repositorio
2. Instalar dependencias:
```bash
   npm install
```
3. Crear un archivo `.env.local` basado en `.env.example`:
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
GROQ_API_KEY=...
4. Correr el servidor de desarrollo:
```bash
   npm run dev
```

## Deploy

Configurado para desplegarse en Vercel. Cada push a `main` genera un deploy automático.