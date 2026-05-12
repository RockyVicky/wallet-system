"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, ArrowUpRight, ArrowDownLeft, TrendingUp, Activity, ShieldCheck, Zap, CreditCard } from 'lucide-react';

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
};

export default function V2DashboardPage() {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      const res = await api.get('/wallet/balance');
      setBalance(res.data.balance);
    } catch (err) {
      console.error('Error fetching balance', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="text-slate-900 font-black uppercase tracking-[0.3em] animate-pulse">Syncing Ledger...</div>
    </div>
  );

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      transition={{ staggerChildren: 0.1 }}
      className="space-y-12 lg:space-y-16"
    >
      <motion.div variants={cardVariants}>
        <h1 className="text-4xl lg:text-5xl font-black text-slate-950 tracking-tighter mb-2 uppercase italic">Workspace</h1>
        <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em]">Protocol active • End-to-end encrypted</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Balance Card */}
        <motion.div 
          variants={cardVariants}
          className="lg:col-span-2 relative group"
        >
          <div className="absolute inset-0 bg-indigo-600 rounded-[3rem] blur-2xl opacity-10 group-hover:opacity-20 transition-opacity" />
          <div className="relative bg-slate-950 rounded-[3rem] p-10 lg:p-14 overflow-hidden text-white shadow-2xl">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10">
                    <Wallet className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Net Liquidity</p>
                    <p className="text-xs font-bold text-white mt-0.5">Vault Protocol v2.0</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                  <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Live</span>
                </div>
              </div>
              
              <div className="mb-12">
                <motion.p 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-6xl lg:text-8xl font-black tracking-tighter"
                >
                  {isMounted ? `₹${Number(balance).toLocaleString('en-IN', {minimumFractionDigits: 2})}` : '₹0.00'}
                </motion.p>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 rounded-2xl shadow-lg">
                  <ShieldCheck className="w-4 h-4 text-white" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">Quantum Secure</span>
                </div>
                <div className="flex items-center space-x-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-2xl">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Instant Settlement</span>
                </div>
              </div>
            </div>
            
            {/* Decorative BG Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4" />
          </div>
        </motion.div>

        {/* Action Quick Stats */}
        <div className="grid grid-cols-1 gap-8">
           <motion.div 
             variants={cardVariants}
             whileHover={{ y: -5 }}
             className="glass rounded-[2.5rem] p-8 flex flex-col justify-between border-2 border-transparent hover:border-indigo-100 transition-all group"
           >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                   <ArrowDownLeft className="text-emerald-600 w-6 h-6" />
                </div>
                <TrendingUp className="text-emerald-500 w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Incoming Stream</p>
                <p className="text-2xl font-black text-slate-950 uppercase tracking-tight italic">Authenticated</p>
              </div>
           </motion.div>

           <motion.div 
             variants={cardVariants}
             whileHover={{ y: -5 }}
             className="glass rounded-[2.5rem] p-8 flex flex-col justify-between border-2 border-transparent hover:border-rose-100 transition-all group"
           >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                   <ArrowUpRight className="text-rose-600 w-6 h-6" />
                </div>
                <CreditCard className="text-rose-500 w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Transfer Limit</p>
                <p className="text-2xl font-black text-slate-950 uppercase tracking-tight italic">Unrestricted</p>
              </div>
           </motion.div>
        </div>
      </div>

      {/* Security Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "IP Address", value: "Verified", icon: Globe, color: "text-blue-600" },
          { label: "Hardware", value: "Enclaved", icon: ShieldCheck, color: "text-indigo-600" },
          { label: "Session", value: "Secure", icon: Zap, color: "text-amber-600" },
          { label: "Encryption", value: "AES-256", icon: Sparkles, color: "text-purple-600" }
        ].map((item, i) => (
          <motion.div 
            key={i}
            variants={cardVariants}
            className="glass rounded-3xl p-6 flex items-center space-x-4 border border-slate-100 hover:shadow-xl transition-all"
          >
            <div className={`w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center ${item.color}`}>
              <item.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{item.label}</p>
              <p className="text-sm font-black uppercase text-slate-900 tracking-tight">{item.value}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// Re-import Sparkles and Globe as they were missing
import { Sparkles, Globe } from 'lucide-react';

