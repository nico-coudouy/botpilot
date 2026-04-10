import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, 
  X, 
  Zap, 
  Bot, 
  Cpu, 
  Globe, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  MessageSquare, 
  BarChart3, 
  Users,
  Star
} from 'lucide-react';
import { cn } from '../lib/utils';

const BENEFITS = [
  {
    icon: <Bot className="w-8 h-8 text-accent" />,
    title: "IA de Última Generación",
    description: "Utilizamos modelos Gemini, GPT y Claude para respuestas humanas y precisas."
  },
  {
    icon: <Zap className="w-8 h-8 text-electric" />,
    title: "Automatización Total",
    description: "Conecta Instagram, Facebook y WhatsApp en minutos."
  },
  {
    icon: <BarChart3 className="w-8 h-8 text-purple-400" />,
    title: "Analítica en Tiempo Real",
    description: "Mide el rendimiento de tus bots y optimiza tus conversiones."
  }
];

const TESTIMONIALS = [
  {
    name: "Carlos Rodríguez",
    role: "CEO de TechFlow",
    content: "BOT PILOT transformó nuestra atención al cliente. Redujimos los tiempos de respuesta en un 90%.",
    avatar: "https://picsum.photos/seed/carlos/100/100"
  },
  {
    name: "Florencia Ferraro",
    role: "Agente inmobiliario",
    content: "La integración con n8n es simplemente perfecta. Automatizamos todo nuestro canal de ventas.",
    avatar: "https://picsum.photos/seed/elena/100/100"
  }
];

const PRICING = [
  {
    name: "Starter",
    price: "$29",
    features: ["3 Bots Activos", "1,000 Mensajes", "Soporte Email"],
    cta: "Empezar Gratis",
    popular: false
  },
  {
    name: "Pro",
    price: "$79",
    features: ["15 Bots Activos", "10,000 Mensajes", "IA Avanzada", "Soporte 24/7"],
    cta: "Elegir Pro",
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: ["Bots Ilimitados", "Infraestructura Propia", "Account Manager"],
    cta: "Contactar Ventas",
    popular: false
  }
];

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<{role: 'user' | 'assistant', content: string}[]>([
    { role: 'assistant', content: '¡Hola! Soy el asistente virtual de BOT PILOT. ¿En qué te puedo ayudar hoy?' }
  ]);
  const [inputValue, setInputValue] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMessage }].map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      if (!response.ok) throw new Error('Failed to fetch response');
      
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Lo siento, ha ocurrido un error al procesar tu mensaje. Por favor intenta de nuevo.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-900 text-white selection:bg-accent selection:text-navy-900 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 px-4 md:px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-accent rounded-lg md:rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(100,255,218,0.3)]">
              <Zap className="text-navy-900 w-5 h-5 md:w-6 md:h-6" />
            </div>
            <span className="text-lg md:text-xl font-display font-bold tracking-tighter">BOT PILOT</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
            <a href="#demo" className="hover:text-accent transition-colors">Prueba el Bot</a>
            <a href="#features" className="hover:text-accent transition-colors">Características</a>
            <a href="#testimonials" className="hover:text-accent transition-colors">Testimonios</a>
            <a href="#pricing" className="hover:text-accent transition-colors">Precios</a>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            <a 
              href="https://www.instagram.com/botpilot.app/" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-accent text-navy-900 px-4 md:px-6 py-2 rounded-lg md:rounded-xl font-bold text-xs md:text-sm hover:bg-accent/90 transition-all shadow-[0_0_20px_rgba(100,255,218,0.2)]"
            >
              Empezar
            </a>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-white/5 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden glass mt-4 rounded-2xl overflow-hidden border border-white/10"
            >
              <div className="flex flex-col p-4 space-y-4 text-sm font-bold">
                <a href="#demo" onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-white/5 rounded-lg">Prueba el Bot</a>
                <a href="#features" onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-white/5 rounded-lg">Características</a>
                <a href="#testimonials" onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-white/5 rounded-lg">Testimonios</a>
                <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-white/5 rounded-lg">Precios</a>
                <a href="https://www.instagram.com/botpilot.app/" target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-white/5 rounded-lg text-accent">Instagram</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-28 pb-16 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] md:w-[40%] md:h-[40%] bg-accent/10 blur-[80px] md:blur-[120px] rounded-full" />
          <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] md:w-[30%] md:h-[30%] bg-electric/10 blur-[80px] md:blur-[120px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] md:text-xs font-bold uppercase tracking-widest mb-6">
              Nueva Era de Automatización
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight mb-6 md:mb-8 leading-[1.1] md:leading-[0.9]">
              Escala tu negocio con <br className="hidden sm:block" />
              <span className="text-accent italic">Chatbots Inteligentes</span>
            </h1>
            <p className="text-base md:text-xl text-white/40 max-w-2xl mx-auto mb-10 md:mb-12 leading-relaxed px-4">
              La plataforma definitiva para integrar IA en tus canales de chat. Conecta ManyChat, n8n y WhatsApp en una sola interfaz potente y segura.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4">
              <a 
                href="https://www.instagram.com/botpilot.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-accent text-navy-900 px-8 md:px-10 py-4 md:py-5 rounded-xl md:rounded-2xl font-bold text-base md:text-lg hover:bg-accent/90 transition-all flex items-center justify-center gap-2 group"
              >
                Crear mi primer Bot
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#demo" className="w-full sm:w-auto glass px-8 md:px-10 py-4 md:py-5 rounded-xl md:rounded-2xl font-bold text-base md:text-lg hover:bg-white/10 transition-all">
                Ver Demo
              </a>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Demo Chat Section */}
      <section id="demo" className="py-16 md:py-24 relative">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">Prueba nuestro Bot</h2>
            <p className="text-white/40">Chatea con nuestro asistente virtual impulsado por Groq IA.</p>
          </div>
          
          <div className="glass rounded-3xl border border-white/10 overflow-hidden flex flex-col h-[500px] shadow-2xl">
            {/* Chat Header */}
            <div className="bg-white/5 border-b border-white/10 p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-bold">Asistente BOT PILOT</h3>
                <p className="text-xs text-accent flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  En línea
                </p>
              </div>
            </div>
            
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={cn(
                  "flex w-full",
                  msg.role === 'user' ? "justify-end" : "justify-start"
                )}>
                  <div className={cn(
                    "max-w-[80%] md:max-w-[70%] rounded-2xl p-4 text-sm md:text-base",
                    msg.role === 'user' 
                      ? "bg-accent text-navy-900 rounded-tr-sm" 
                      : "bg-white/10 text-white rounded-tl-sm"
                  )}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex w-full justify-start">
                  <div className="bg-white/10 text-white rounded-2xl rounded-tl-sm p-4 flex gap-1 items-center">
                    <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>
            
            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white/5 border-t border-white/10 flex gap-2">
              <input 
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Escribe un mensaje..."
                className="flex-1 bg-navy-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent/50"
                disabled={isTyping}
              />
              <button 
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="bg-accent text-navy-900 px-6 py-3 rounded-xl font-bold hover:bg-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Enviar
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="features" className="py-24 bg-navy-950/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">¿Por qué elegir BOT PILOT?</h2>
            <p className="text-white/40">Diseñado para la máxima eficiencia y escalabilidad.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {BENEFITS.map((benefit, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="glass p-8 rounded-3xl border-white/5 hover:border-accent/30 transition-colors"
              >
                <div className="mb-6">{benefit.icon}</div>
                <h3 className="text-xl font-bold mb-4">{benefit.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-6xl font-display font-bold mb-8 leading-tight">
                Lo que dicen nuestros <span className="text-electric">Pilotos</span>
              </h2>
              <p className="text-white/40 text-lg mb-12">
                Únete a más de 50 empresas que ya están automatizando su crecimiento con nosotros.
              </p>
              <div className="flex gap-4">
                <div className="flex -space-x-4">
                  {[1,2,3,4].map(i => (
                    <img key={i} src={`https://picsum.photos/seed/user${i}/40/40`} className="w-10 h-10 rounded-full border-2 border-navy-900" referrerPolicy="no-referrer" />
                  ))}
                </div>
                <div className="text-sm">
                  <div className="flex text-accent mb-1">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-current" />)}
                  </div>
                  <p className="text-white/60 font-bold">4.9/5 Calificación</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              {TESTIMONIALS.map((t, i) => (
                <div key={i} className="glass p-8 rounded-3xl border-white/5">
                  <p className="text-lg italic text-white/80 mb-6">"{t.content}"</p>
                  <div className="flex items-center gap-4">
                    <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full" referrerPolicy="no-referrer" />
                    <div>
                      <p className="font-bold">{t.name}</p>
                      <p className="text-xs text-white/40">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 md:py-24 bg-navy-950/50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl md:text-6xl font-display font-bold mb-4 tracking-tight">Planes Flexibles</h2>
            <p className="text-white/40 text-sm md:text-base">Sin contratos a largo plazo. Cancela cuando quieras.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {PRICING.map((plan, i) => (
              <div 
                key={i} 
                className={cn(
                  "glass p-8 md:p-10 rounded-3xl flex flex-col relative overflow-hidden",
                  plan.popular && "border-accent/50 shadow-[0_0_40px_rgba(100,255,218,0.1)]"
                )}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-accent text-navy-900 text-[10px] font-bold px-4 py-1 rounded-bl-xl uppercase tracking-widest">
                    Popular
                  </div>
                )}
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-5xl font-display font-bold">{plan.price}</span>
                  {plan.price !== 'Custom' && <span className="text-white/40 text-sm">/mes</span>}
                </div>
                <ul className="space-y-4 mb-10 flex-1">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm text-white/60">
                      <CheckCircle2 className="w-4 h-4 text-accent" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a 
                  href="https://wa.me/+5492235937732"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "w-full py-4 rounded-xl font-bold transition-all text-center",
                    plan.popular ? "bg-accent text-navy-900 hover:bg-accent/90" : "bg-white/5 hover:bg-white/10"
                  )}
                >
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="glass p-8 md:p-16 rounded-[32px] md:rounded-[40px] text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-electric/10 -z-10" />
            <h2 className="text-3xl md:text-6xl font-display font-bold mb-6 md:mb-8">¿Listo para despegar?</h2>
            <p className="text-white/40 text-base md:text-lg mb-8 md:mb-12 max-w-xl mx-auto">
              Únete a la revolución de la IA y automatiza tu negocio hoy mismo. No requiere tarjeta de crédito para empezar.
            </p>
            <a 
              href="https://www.instagram.com/botpilot.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-white text-navy-900 px-8 md:px-12 py-4 md:py-5 rounded-xl md:rounded-2xl font-bold text-lg md:text-xl hover:bg-white/90 transition-all shadow-xl"
            >
              Empezar Ahora
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 opacity-40">
            <Zap className="w-5 h-5" />
            <span className="font-display font-bold tracking-tighter">BOT PILOT</span>
          </div>
          <p className="text-white/20 text-sm">© 2026 BOT PILOT. Todos los derechos reservados.</p>
          <div className="flex gap-6 text-white/40 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacidad</a>
            <a href="#" className="hover:text-white transition-colors">Términos</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
