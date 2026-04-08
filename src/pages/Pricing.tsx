import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { Check, Zap, Bot, Cpu, Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

const PRICING_PLANS = [
  {
    id: 'basic',
    name: 'Básico',
    price: '$29',
    description: 'Ideal para pequeños negocios que están empezando.',
    features: [
      'Hasta 3 Bots activos',
      '1,000 mensajes mensuales',
      'Integración básica con ManyChat',
      'Soporte por email'
    ],
    accent: 'accent'
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$79',
    description: 'Para empresas que necesitan automatización avanzada.',
    features: [
      'Hasta 15 Bots activos',
      '10,000 mensajes mensuales',
      'Integraciones ilimitadas con n8n',
      'IA avanzada (GPT-4)',
      'Soporte prioritario'
    ],
    accent: 'electric',
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$199',
    description: 'Soluciones a medida para grandes corporaciones.',
    features: [
      'Bots ilimitados',
      'Mensajes ilimitados',
      'Infraestructura dedicada',
      'SLA garantizado',
      'Account Manager dedicado'
    ],
    accent: 'purple-400'
  }
];

export default function Pricing() {
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubscribe = async (planId: string) => {
    if (!user) return;
    setLoading(planId);

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          userId: user.uid,
          userEmail: user.email,
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Error creating session');
      }
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-navy-900 p-8">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-12 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Volver al Dashboard
        </button>

        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 tracking-tight">
            Elige el plan perfecto para tu <span className="text-accent">Escalabilidad</span>
          </h1>
          <p className="text-white/40 max-w-2xl mx-auto">
            Automatiza tus procesos hoy mismo. Sin costos ocultos, cancela cuando quieras.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PRICING_PLANS.map((plan) => (
            <motion.div
              key={plan.id}
              whileHover={{ y: -10 }}
              className={cn(
                "glass p-8 rounded-3xl relative flex flex-col",
                plan.popular && "border-accent/50 shadow-[0_0_40px_rgba(100,255,218,0.1)]"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-navy-900 text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-full">
                  Más Popular
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-display font-bold">{plan.price}</span>
                  <span className="text-white/40 text-sm">/mes</span>
                </div>
                <p className="text-white/40 text-sm mt-4 leading-relaxed">
                  {plan.description}
                </p>
              </div>

              <div className="space-y-4 flex-1 mb-8">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={cn("mt-1 shrink-0", `text-${plan.accent}`)}>
                      <Check className="w-4 h-4" />
                    </div>
                    <span className="text-sm text-white/80">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={loading !== null}
                className={cn(
                  "w-full py-4 rounded-xl font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2",
                  plan.popular 
                    ? "bg-accent text-navy-900 hover:bg-accent/90" 
                    : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                )}
              >
                {loading === plan.id ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Seleccionar Plan
                    <Zap className="w-4 h-4" />
                  </>
                )}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Comparison Section */}
        <div className="mt-24 glass p-12 rounded-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-display font-bold mb-6">¿Necesitas algo más grande?</h2>
              <p className="text-white/40 leading-relaxed mb-8">
                Ofrecemos soluciones personalizadas para agencias y grandes empresas que requieren miles de automatizaciones y soporte dedicado 24/7.
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-electric/10 rounded-lg flex items-center justify-center border border-electric/20">
                    <Bot className="w-5 h-5 text-electric" />
                  </div>
                  <span className="font-medium">Infraestructura Dedicada</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center border border-purple-400/20">
                    <Cpu className="w-5 h-5 text-purple-400" />
                  </div>
                  <span className="font-medium">API de Marca Blanca</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-accent/20 to-electric/20 rounded-2xl blur-3xl absolute inset-0 -z-10" />
              <div className="glass p-8 rounded-2xl border-white/10">
                <h4 className="font-bold mb-4">Contacto Directo</h4>
                <p className="text-sm text-white/40 mb-6">Habla con un experto en automatización para diseñar tu plan.</p>
                <button className="w-full bg-white text-navy-900 font-bold py-3 rounded-xl hover:bg-white/90 transition-colors">
                  Agendar Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
