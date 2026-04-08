import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc, query, where, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Key, 
  Globe, 
  Trash2, 
  ShieldCheck, 
  AlertCircle, 
  Loader2, 
  CheckCircle2,
  Bot,
  Cpu,
  Link as LinkIcon
} from 'lucide-react';
import { cn } from '../lib/utils';

const SERVICES = [
  { id: 'manychat', name: 'ManyChat', icon: <Bot className="w-5 h-5" /> },
  { id: 'n8n', name: 'n8n', icon: <Cpu className="w-5 h-5" /> },
  { id: 'whatsapp', name: 'WhatsApp Business API', icon: <Globe className="w-5 h-5" /> }
];

export default function Integrations() {
  const { user } = useAuth();
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [bots, setBots] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddIntegration, setShowAddIntegration] = useState(false);
  const [showAddBot, setShowAddBot] = useState(false);

  // Form states
  const [service, setService] = useState('manychat');
  const [apiKey, setApiKey] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [botName, setBotName] = useState('');
  const [selectedIntegration, setSelectedIntegration] = useState('');

  useEffect(() => {
    if (!user) return;

    const qInt = query(collection(db, 'integrations'), where('userId', '==', user.uid));
    const unsubInt = onSnapshot(qInt, (snapshot) => {
      setIntegrations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const qBots = query(collection(db, 'bots'), where('userId', '==', user.uid));
    const unsubBots = onSnapshot(qBots, (snapshot) => {
      setBots(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubInt();
      unsubBots();
    };
  }, [user]);

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleAddIntegration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    if (webhookUrl && !validateUrl(webhookUrl)) {
      alert('Por favor ingresa una URL de webhook válida');
      return;
    }

    setLoading(true);
    try {
      // Encrypt API Key on server
      let encryptedKey = '';
      if (apiKey) {
        const response = await fetch('/api/encrypt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ value: apiKey })
        });
        const data = await response.json();
        encryptedKey = data.encryptedValue;
      }

      await addDoc(collection(db, 'integrations'), {
        userId: user.uid,
        service,
        apiKey: encryptedKey,
        webhookUrl,
        createdAt: serverTimestamp()
      });

      setShowAddIntegration(false);
      setApiKey('');
      setWebhookUrl('');
    } catch (err) {
      console.error(err);
      alert('Error al guardar la integración');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedIntegration) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'bots'), {
        userId: user.uid,
        name: botName,
        integrationId: selectedIntegration,
        status: 'Active',
        createdAt: serverTimestamp()
      });

      setShowAddBot(false);
      setBotName('');
      setSelectedIntegration('');
    } catch (err) {
      console.error(err);
      alert('Error al crear el bot');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8 md:y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight">Integraciones & Bots</h1>
            <p className="text-white/40 mt-2 text-sm md:text-base">Conecta tus servicios externos y despliega nuevos agentes.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <button 
              onClick={() => setShowAddIntegration(true)}
              className="glass px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-all text-sm md:text-base"
            >
              <Key className="w-4 h-4 md:w-5 md:h-5 text-accent" />
              Nueva API Key
            </button>
            <button 
              onClick={() => setShowAddBot(true)}
              className="bg-accent text-navy-900 px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-accent/90 transition-all text-sm md:text-base"
            >
              <Plus className="w-4 h-4 md:w-5 md:h-5" />
              Nuevo Bot
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Integrations List */}
          <div className="lg:col-span-1 space-y-6">
            <h2 className="text-xl font-display font-bold flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-accent" />
              Servicios Conectados
            </h2>
            <div className="space-y-4">
              {integrations.length === 0 ? (
                <div className="glass p-8 rounded-2xl text-center border-dashed border-white/10">
                  <p className="text-white/20 text-sm">No hay integraciones activas</p>
                </div>
              ) : (
                integrations.map(integration => (
                  <div key={integration.id} className="glass p-4 rounded-xl border-white/5 flex items-center justify-between group">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-10 h-10 bg-white/5 rounded-lg flex-shrink-0 flex items-center justify-center">
                        {SERVICES.find(s => s.id === integration.service)?.icon}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-sm capitalize">{integration.service}</p>
                        <p className="text-[10px] text-white/40 font-mono truncate max-w-[150px] sm:max-w-none">
                          {integration.apiKey ? '••••••••••••' : integration.webhookUrl}
                        </p>
                      </div>
                    </div>
                    <button className="p-2 text-white/20 hover:text-red-400 transition-colors opacity-100 md:opacity-0 group-hover:opacity-100">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Bots List */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-display font-bold flex items-center gap-2">
              <Bot className="w-5 h-5 text-electric" />
              Mis Bots
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {bots.length === 0 ? (
                <div className="col-span-full glass p-12 rounded-2xl text-center border-dashed border-white/10">
                  <Bot className="w-12 h-12 text-white/10 mx-auto mb-4" />
                  <p className="text-white/20">Aún no has creado ningún bot</p>
                </div>
              ) : (
                bots.map(bot => {
                  const integration = integrations.find(i => i.id === bot.integrationId);
                  return (
                    <div key={bot.id} className="glass p-6 rounded-2xl border-white/5 hover:border-accent/30 transition-colors">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center border border-accent/20">
                          <Bot className="w-6 h-6 text-accent" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-green-500/10 text-green-400 rounded-md">
                          {bot.status}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold mb-1">{bot.name}</h3>
                      <div className="flex items-center gap-2 text-white/40 text-xs">
                        <LinkIcon className="w-3 h-3" />
                        <span>Vía {integration?.service || 'Desconocido'}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Integration Modal */}
      <AnimatePresence>
        {showAddIntegration && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowAddIntegration(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="glass p-6 md:p-8 rounded-3xl w-full max-w-lg relative z-10 max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-display font-bold mb-6">Nueva Integración</h2>
              <form onSubmit={handleAddIntegration} className="space-y-5 md:space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/40 uppercase tracking-wider">Servicio</label>
                  <select 
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-accent/50 text-sm"
                  >
                    {SERVICES.map(s => <option key={s.id} value={s.id} className="bg-navy-900">{s.name}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/40 uppercase tracking-wider">API Key (Encriptada)</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                    <input 
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="sk_live_..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-accent/50 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/40 uppercase tracking-wider">Webhook URL (Opcional)</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                    <input 
                      type="text"
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      placeholder="https://hooks.n8n.cloud/..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-accent/50 text-sm"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowAddIntegration(false)}
                    className="order-2 sm:order-1 flex-1 py-3 rounded-xl font-bold text-white/40 hover:bg-white/5 transition-colors text-sm"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    disabled={loading}
                    className="order-1 sm:order-2 flex-1 bg-accent text-navy-900 py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-sm"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Guardar'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Bot Modal */}
      <AnimatePresence>
        {showAddBot && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowAddBot(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="glass p-6 md:p-8 rounded-3xl w-full max-w-lg relative z-10 max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-display font-bold mb-6">Registrar Nuevo Bot</h2>
              <form onSubmit={handleAddBot} className="space-y-5 md:space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/40 uppercase tracking-wider">Nombre del Bot</label>
                  <input 
                    type="text"
                    value={botName}
                    onChange={(e) => setBotName(e.target.value)}
                    placeholder="Ej: Asistente de Ventas"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-accent/50 text-sm"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/40 uppercase tracking-wider">Seleccionar Integración</label>
                  <select 
                    value={selectedIntegration}
                    onChange={(e) => setSelectedIntegration(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-accent/50 text-sm"
                    required
                  >
                    <option value="" className="bg-navy-900">Selecciona una integración...</option>
                    {integrations.map(i => (
                      <option key={i.id} value={i.id} className="bg-navy-900">
                        {SERVICES.find(s => s.id === i.service)?.name} ({i.id.slice(0, 5)})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowAddBot(false)}
                    className="order-2 sm:order-1 flex-1 py-3 rounded-xl font-bold text-white/40 hover:bg-white/5 transition-colors text-sm"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    disabled={loading || !selectedIntegration}
                    className="order-1 sm:order-2 flex-1 bg-accent text-navy-900 py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-sm"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Crear Bot'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
