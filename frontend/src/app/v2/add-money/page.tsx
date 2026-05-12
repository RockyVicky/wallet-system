"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import { PlusCircle, X, Check, AlertCircle, ShieldCheck, Zap, Loader2 } from 'lucide-react';

const formVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
};

export default function V2AddMoneyPage() {
  const [amountToAdd, setAmountToAdd] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ type: '', text: '' }), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleAddMoney = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/wallet/add-money', { amount: Number(amountToAdd) });
      setMessage({ type: 'success', text: 'LIQUIDITY INJECTED: Protocol Balanced' });
      setAmountToAdd('');
      setTimeout(() => router.push('/v2/dashboard'), 2000);
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Deposit failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      transition={{ staggerChildren: 0.1 }}
      className="max-w-2xl font-sans"
    >
      <motion.div variants={formVariants} className="mb-12">
        <h1 className="text-4xl lg:text-5xl font-black text-slate-950 tracking-tighter mb-2 uppercase italic">Deposit</h1>
        <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em]">Instant Liquidity Injection • v2.4</p>
      </motion.div>
      
      <AnimatePresence>
        {message.text && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className={`mb-10 p-6 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest border-2 flex justify-between items-center shadow-2xl ${
              message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'
            }`}
          >
            <div className="flex items-center">
              {message.type === 'success' ? <Check className="w-5 h-5 mr-4" /> : <AlertCircle className="w-5 h-5 mr-4" />}
              <span>{message.text}</span>
            </div>
            <button onClick={() => setMessage({ type: '', text: '' })}><X className="w-5 h-5 opacity-50 hover:opacity-100 transition-opacity" /></button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={formVariants} className="glass rounded-[3rem] p-10 lg:p-14 border border-white/40 shadow-2xl relative overflow-hidden">
        <div className="flex items-center mb-12">
          <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center mr-5 shadow-2xl">
             <PlusCircle className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-tighter text-slate-950">Fund Assets</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Authenticated Stream</p>
          </div>
        </div>
        
        <form onSubmit={handleAddMoney} className="space-y-8 relative z-10">
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Injection Amount</label>
            <div className="relative group">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-black text-2xl group-focus-within:text-emerald-600 transition-colors">₹</span>
              <input
                type="number"
                min="0.01"
                step="0.01"
                required
                placeholder="0.00"
                className="w-full pl-14 pr-6 py-5 border-2 border-slate-100 bg-slate-50/50 rounded-2xl text-2xl font-black text-slate-950 focus:border-emerald-600 focus:bg-white outline-none transition-all shadow-sm"
                value={amountToAdd}
                onChange={(e) => setAmountToAdd(e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             {[500, 1000, 5000, 10000].map(val => (
               <button 
                 key={val}
                 type="button"
                 onClick={() => setAmountToAdd(val.toString())}
                 className="py-3 px-4 bg-slate-50 border-2 border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:border-emerald-600 hover:text-emerald-600 transition-all"
               >
                 + ₹{val.toLocaleString()}
               </button>
             ))}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full relative bg-slate-950 text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-slate-800 transition-all active:scale-95 group overflow-hidden mt-4 disabled:bg-slate-400"
          >
            <span className="relative z-10 flex items-center justify-center">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-3 w-5 h-5 animate-spin" /> Processing...
                </>
              ) : (
                <>
                  Execute Deposit <Zap className="ml-3 w-5 h-5 group-hover:scale-110 transition-transform" />
                </>
              )}
            </span>
            {!isSubmitting && <div className="absolute inset-0 bg-emerald-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />}
          </button>
        </form>

        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-emerald-600/5 rounded-full blur-[100px]" />
      </motion.div>
    </motion.div>
  );
}

