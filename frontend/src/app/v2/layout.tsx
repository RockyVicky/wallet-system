"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, PlusCircle, Send, History, LogOut, ArrowLeft, Edit3, X, Menu, ChevronLeft, ChevronRight, User, Sparkles, ShieldCheck, Wallet, MousePointer2, Rocket, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import MesmerizedBackground from '@/components/MesmerizedBackground';

export default function V2Layout({ children }: { children: React.ReactNode }) {
  const { user, logout, updateUser, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({ name: '', phone: '' });
  const [message, setMessage] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktopExpanded, setIsDesktopExpanded] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (!loading && !user) router.push('/login');
    if (user) setProfileData({ name: user.name, phone: user.phone || '' });
  }, [user, loading, router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/user/profile', profileData);
      updateUser(profileData);
      setIsEditingProfile(false);
      setMessage('Identity Verified');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setMessage('Verification failed');
    }
  };

  if (!isMounted || loading || !user) return <div className="min-h-screen flex items-center justify-center bg-white text-slate-900 font-black uppercase tracking-widest animate-pulse">Initializing Protocol...</div>;

  const navLinks = [
    { name: 'Dashboard', href: '/v2/dashboard', icon: LayoutDashboard },
    { name: 'Add Funds', href: '/v2/add-money', icon: PlusCircle },
    { name: 'Transfer', href: '/v2/transfer', icon: Send },
    { name: 'Audit Logs', href: '/v2/history', icon: History },
  ];

  return (
    <div className="h-[100dvh] bg-white flex flex-col md:flex-row overflow-hidden font-sans relative">
      <MesmerizedBackground />

      {/* Mobile Top Bar */}
      <div className="md:hidden glass border-b border-white/20 p-4 flex justify-between items-center z-50">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-slate-950 rounded-xl flex items-center justify-center shadow-2xl">
            <Wallet className="text-white w-5 h-5" />
          </div>
          <h2 className="text-lg font-black uppercase tracking-tighter">Vault</h2>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-900">
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Identity Edit Modal */}
      <AnimatePresence>
        {isEditingProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl border border-white/20 relative overflow-hidden"
            >
              <button onClick={() => setIsEditingProfile(false)} className="absolute right-8 top-8 text-slate-400 hover:text-slate-950 transition-colors">
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-black uppercase tracking-tighter mb-8">Secure Identity</h2>
              {message && <div className="mb-8 p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-center bg-indigo-50 text-indigo-700 border border-indigo-100">{message}</div>}
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Legal Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-6 py-4 border-2 border-slate-100 bg-slate-50/50 rounded-2xl text-slate-900 font-bold focus:border-indigo-600 focus:bg-white outline-none transition-all"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Contact Phone</label>
                  <input
                    type="tel"
                    required
                    className="w-full px-6 py-4 border-2 border-slate-100 bg-slate-50/50 rounded-2xl text-slate-900 font-bold focus:border-indigo-600 focus:bg-white outline-none transition-all"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  />
                </div>
                <button type="submit" className="w-full bg-slate-950 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-slate-800 transition-all active:scale-95 mt-4">
                  Update Protocol
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 bg-white/40 backdrop-blur-2xl border-r border-white/20 flex flex-col transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) shadow-sidebar
          ${isSidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full md:translate-x-0'}
          ${isDesktopExpanded ? 'md:w-72 lg:w-80' : 'md:w-24'}
        `}
      >
        <button
          onClick={() => setIsDesktopExpanded(!isDesktopExpanded)}
          className="hidden md:flex absolute -right-3.5 top-12 bg-white border border-slate-100 text-slate-950 rounded-full p-1.5 shadow-xl transition-transform hover:scale-110 z-50"
        >
          {isDesktopExpanded ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        <div className={`p-8 ${isDesktopExpanded ? '' : 'px-4 flex flex-col items-center'}`}>
          <div className={`hidden md:flex items-center mb-12 ${!isDesktopExpanded && 'justify-center'}`}>
            <div className={`w-11 h-11 bg-slate-950 rounded-2xl flex items-center justify-center shadow-2xl shrink-0 ${isDesktopExpanded && 'mr-4'}`}>
              <Wallet className="text-white w-6 h-6" />
            </div>
            <AnimatePresence mode="wait">
              {isDesktopExpanded && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  <h2 className="text-2xl font-black uppercase tracking-tighter leading-none">Vault</h2>
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-600 mt-1">Enterprise</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <nav className="space-y-3">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`relative flex items-center rounded-2xl transition-all group overflow-hidden ${isDesktopExpanded ? 'px-5 py-4' : 'p-4 justify-center'
                    } ${isActive
                      ? 'text-white'
                      : 'text-slate-500 hover:text-slate-950'
                    }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-bg"
                      className="absolute inset-0 bg-slate-950 -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Icon className={`w-5 h-5 shrink-0 transition-colors ${isDesktopExpanded && 'mr-4'} ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-950'}`} />
                  {isDesktopExpanded && <span className="text-sm font-black uppercase tracking-widest whitespace-nowrap">{link.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className={`mt-auto p-8 space-y-6 ${!isDesktopExpanded && 'items-center flex flex-col'}`}>
          {/* Identity Widget */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`glass rounded-3xl cursor-pointer group relative overflow-hidden transition-all ${isDesktopExpanded ? 'p-5' : 'w-14 h-14 p-0 flex items-center justify-center'
              }`}
            onClick={() => setIsEditingProfile(true)}
          >
            {isDesktopExpanded ? (
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-black text-[10px] uppercase">
                    {user.name.charAt(0)}
                  </div>
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                </div>
                <p className="text-sm font-black uppercase tracking-tight text-slate-900 truncate">{user.name}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1 truncate">{user.email}</p>
              </div>
            ) : (
              <div className="text-indigo-600 font-black text-sm uppercase">{user.name.charAt(0)}</div>
            )}
            <div className="absolute inset-0 bg-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
          </motion.div>

          <div className={`space-y-3 w-full ${!isDesktopExpanded && 'flex flex-col items-center'}`}>
            <div className="relative group/v1-side w-full">
              <div className="absolute -right-1 top-1/2 -translate-y-1/2 translate-x-full hidden lg:flex items-center pointer-events-none z-50">
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 15, 0]
                  }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Rocket className="w-5 h-5 text-indigo-600 fill-indigo-100" />
                </motion.div>
              </div>
              <button
                onClick={() => router.push('/dashboard')}
                className={`flex items-center w-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  isDesktopExpanded 
                    ? 'px-5 py-4 bg-indigo-50/50 hover:bg-indigo-100/80 text-indigo-700 hover:text-indigo-900 rounded-2xl border-2 border-indigo-100/50 shadow-lg shadow-indigo-500/10' 
                    : 'p-4 justify-center text-indigo-600 hover:text-indigo-800'
                }`}
              >
                <Zap className={`w-4 h-4 shrink-0 ${isDesktopExpanded && 'mr-3'} fill-indigo-600 animate-bounce`} /> 
                {isDesktopExpanded && <span>Standard UI</span>}
              </button>
            </div>
            <button
              onClick={() => { logout(); router.push('/login'); }}
              className={`flex items-center w-full text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 rounded-2xl transition-all group ${isDesktopExpanded ? 'px-5 py-4' : 'justify-center p-4'
                }`}
            >
              <LogOut className={`w-4 h-4 shrink-0 group-hover:scale-110 transition-transform ${isDesktopExpanded && 'mr-3'}`} />
              {isDesktopExpanded && <span>Disconnect</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 overflow-y-auto relative z-10 custom-scrollbar">
        <div className="max-w-[1400px] mx-auto p-8 lg:p-16 h-full">
          {children}
        </div>
      </main>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/20 backdrop-blur-md z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
