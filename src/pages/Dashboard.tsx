import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Bot, 
  Zap, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  CreditCard,
  Plus,
  Search,
  Bell,
  ChevronRight,
  Cpu,
  MessageSquare,
  Users
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

const ANALYTICS_DATA = [
  { name: 'Lun', messages: 400, leads: 24, rate: 85 },
  { name: 'Mar', messages: 600, leads: 32, rate: 88 },
  { name: 'Mie', messages: 500, leads: 28, rate: 82 },
  { name: 'Jue', messages: 900, leads: 45, rate: 91 },
  { name: 'Vie', messages: 800, leads: 38, rate: 89 },
  { name: 'Sab', messages: 1200, leads: 62, rate: 94 },
  { name: 'Dom', messages: 1100, leads: 55, rate: 92 },
];

const PLANS = [
  {
    id: 1,
    title: 'Customer Support Bot',
    description: 'Automatización de respuestas frecuentes con IA.',
    type: 'ManyChat',
    status: 'Active',
    color: 'bg-accent/20 text-accent'
  },
  {
    id: 2,
    title: 'Lead Gen Workflow',
    description: 'Captura de leads y sincronización con CRM.',
    type: 'n8n',
    status: 'Paused',
    color: 'bg-electric/20 text-electric'
  },
  {
    id: 3,
    title: 'Appointment Scheduler',
    description: 'Agendamiento automático vía WhatsApp.',
    type: 'ManyChat',
    status: 'Active',
    color: 'bg-purple-500/20 text-purple-400'
  }
];

export default function Dashboard() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false); // Default closed on mobile
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-navy-900 flex overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-[70] lg:relative glass-dark border-r border-white/5 transition-all duration-300 flex flex-col",
          sidebarOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0",
          desktopSidebarOpen ? "lg:w-64" : "lg:w-20"
        )}
      >
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center border border-accent/20 shrink-0">
              <Bot className="w-6 h-6 text-accent" />
            </div>
            {(sidebarOpen || desktopSidebarOpen) && (
              <span className="font-display font-bold text-xl tracking-tight">PILOT</span>
            )}
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-white/5 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-8">
          <SidebarItem icon={<LayoutDashboard />} label="Dashboard" active sidebarOpen={sidebarOpen || desktopSidebarOpen} />
          <Link to="/dashboard/pricing">
            <SidebarItem icon={<CreditCard />} label="Planes y Precios" sidebarOpen={sidebarOpen || desktopSidebarOpen} />
          </Link>
          <Link to="/dashboard/integrations">
            <SidebarItem icon={<Zap />} label="Integraciones" sidebarOpen={sidebarOpen || desktopSidebarOpen} />
          </Link>
          <SidebarItem icon={<Cpu />} label="Configuración" sidebarOpen={sidebarOpen || desktopSidebarOpen} />
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center gap-4 p-3 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all"
          >
            <LogOut className="w-6 h-6 shrink-0" />
            {(sidebarOpen || desktopSidebarOpen) && <span className="font-medium">Cerrar Sesión</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Header */}
        <header className="h-20 glass border-b border-white/5 flex items-center justify-between px-4 md:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                if (window.innerWidth < 1024) {
                  setSidebarOpen(true);
                } else {
                  setDesktopSidebarOpen(!desktopSidebarOpen);
                }
              }}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input 
                type="text" 
                placeholder="Buscar planes..."
                className="bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-accent/50 w-64"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <button className="relative p-2 hover:bg-white/5 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-white/60" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-navy-900"></span>
            </button>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold truncate max-w-[100px]">{user?.displayName || 'Usuario'}</p>
                <p className="text-[10px] text-white/40 truncate max-w-[100px]">{user?.email}</p>
              </div>
              <img 
                src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} 
                alt="Profile" 
                className="w-8 h-8 md:w-10 md:h-10 rounded-xl border border-white/10"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-display font-bold">Planes de Automatización</h2>
                <p className="text-white/40 text-sm mt-1">Gestiona tus bots e integraciones activas.</p>
              </div>
              <button className="w-full sm:w-auto bg-accent text-navy-900 font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-accent/90 transition-all active:scale-[0.98]">
                <Plus className="w-5 h-5" />
                Nuevo Plan
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard 
                label="Mensajes Procesados" 
                value="8,432" 
                trend="+12.5%"
                icon={<MessageSquare className="text-accent" />} 
                gradient="from-accent/20 to-transparent"
              />
              <StatCard 
                label="Leads Capturados" 
                value="452" 
                trend="+8.2%"
                icon={<Users className="text-electric" />} 
                gradient="from-electric/20 to-transparent"
              />
              <StatCard 
                label="Tasa de Apertura" 
                value="94.2%" 
                trend="+2.1%"
                icon={<Zap className="text-purple-400" />} 
                gradient="from-purple-500/20 to-transparent"
              />
            </div>

            {/* Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 glass p-8 rounded-3xl border-white/5">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-display font-bold">Actividad Semanal</h3>
                    <p className="text-white/40 text-sm">Mensajes procesados por día</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-accent bg-accent/10 px-3 py-1 rounded-full">
                      Live
                    </span>
                  </div>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={ANALYTICS_DATA}>
                      <defs>
                        <linearGradient id="colorMsg" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#64ffda" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#64ffda" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        stroke="#ffffff20" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                      />
                      <YAxis 
                        stroke="#ffffff20" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                        tickFormatter={(value) => `${value}`}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#0a192f', 
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '12px',
                          fontSize: '12px'
                        }}
                        itemStyle={{ color: '#64ffda' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="messages" 
                        stroke="#64ffda" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorMsg)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="glass p-8 rounded-3xl border-white/5 flex flex-col">
                <h3 className="text-xl font-display font-bold mb-2">Conversión</h3>
                <p className="text-white/40 text-sm mb-8">Leads por día</p>
                <div className="flex-1 h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ANALYTICS_DATA}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        stroke="#ffffff20" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                      />
                      <Tooltip 
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        contentStyle={{ 
                          backgroundColor: '#0a192f', 
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '12px',
                          fontSize: '12px'
                        }}
                      />
                      <Bar dataKey="leads" radius={[4, 4, 0, 0]}>
                        {ANALYTICS_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 5 ? '#64ffda' : '#7dd3fc'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-6 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-white/40">Mejor día</span>
                    <span className="text-xs font-bold text-accent">Sábado</span>
                  </div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-accent h-full w-[85%]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              {PLANS.map((plan) => (
                <motion.div
                  key={plan.id}
                  whileHover={{ y: -5 }}
                  className="glass p-6 rounded-2xl group cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={cn("p-3 rounded-xl", plan.color)}>
                      <Bot className="w-6 h-6" />
                    </div>
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md",
                      plan.status === 'Active' ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"
                    )}>
                      {plan.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">{plan.title}</h3>
                  <p className="text-white/40 text-sm mb-6 leading-relaxed">
                    {plan.description}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <span className="text-xs font-semibold text-white/20 uppercase tracking-wider">{plan.type}</span>
                    <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-accent transition-colors" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active = false, sidebarOpen }: { icon: React.ReactNode, label: string, active?: boolean, sidebarOpen: boolean }) {
  return (
    <button className={cn(
      "w-full flex items-center gap-4 p-3 rounded-xl transition-all group",
      active ? "bg-accent/10 text-accent" : "text-white/40 hover:bg-white/5 hover:text-white"
    )}>
      <div className={cn("shrink-0", active ? "text-accent" : "text-white/40 group-hover:text-white")}>
        {React.cloneElement(icon as React.ReactElement, { className: "w-6 h-6" })}
      </div>
      {sidebarOpen && <span className="font-medium">{label}</span>}
    </button>
  );
}

function StatCard({ label, value, icon, trend, gradient }: { label: string, value: string, icon: React.ReactNode, trend?: string, gradient?: string }) {
  return (
    <div className={cn(
      "glass p-6 rounded-3xl flex items-center gap-6 relative overflow-hidden group transition-all hover:border-white/20",
      "before:absolute before:inset-0 before:bg-gradient-to-br before:opacity-0 before:transition-opacity hover:before:opacity-100",
      gradient && `before:${gradient}`
    )}>
      <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shrink-0 group-hover:scale-110 transition-transform">
        {React.cloneElement(icon as React.ReactElement, { className: "w-7 h-7" })}
      </div>
      <div className="relative z-10">
        <div className="flex items-center gap-2">
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{label}</p>
          {trend && (
            <span className="text-[10px] font-bold text-accent bg-accent/10 px-1.5 py-0.5 rounded-md">
              {trend}
            </span>
          )}
        </div>
        <p className="text-3xl font-display font-bold mt-1 tracking-tight">{value}</p>
      </div>
    </div>
  );
}
