"use client";
import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import { Send, X, User, Search, Check, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';

const formVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
};

export default function V2TransferPage() {
  const { user } = useAuth();
  const [transferEmail, setTransferEmail] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [filteredDropdownUsers, setFilteredDropdownUsers] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (user && users.length > 0) {
      const others = users.filter(u => u.email !== user.email);
      if (transferEmail === '') {
        setFilteredDropdownUsers(others);
      } else {
        const filtered = others.filter(u => 
          u.email.toLowerCase().includes(transferEmail.toLowerCase()) || 
          u.name.toLowerCase().includes(transferEmail.toLowerCase())
        );
        setFilteredDropdownUsers(filtered);
      }
    }
  }, [transferEmail, users, user]);

  const selectedUserInfo = useMemo(() => {
    return users.find(u => u.email === transferEmail);
  }, [transferEmail, users]);

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ type: '', text: '' }), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/user');
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users', err);
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/transaction/transfer', {
        receiverEmail: transferEmail,
        amount: Number(transferAmount)
      });
      setMessage({ type: 'success', text: 'PROTOCOL VERIFIED: Transfer Executed' });
      setTransferEmail('');
      setTransferAmount('');
      setTimeout(() => router.push('/v2/dashboard'), 2000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Transfer validation failed' });
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
        <h1 className="text-4xl lg:text-5xl font-black text-slate-950 tracking-tighter mb-2 uppercase italic">Transfer</h1>
        <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em]">Secure Peer-to-Peer Protocol • v2.4</p>
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
          <div className="w-14 h-14 bg-slate-950 rounded-2xl flex items-center justify-center mr-5 shadow-2xl">
             <Send className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-tighter text-slate-950">Initiate Protocol</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Authorized Transaction</p>
          </div>
        </div>
        
        <form onSubmit={handleTransfer} className="space-y-8 relative z-10">
          <div className="relative" ref={dropdownRef}>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Recipient Identity</label>
            <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-indigo-600 transition-colors" />
              <input
                type="email"
                required
                placeholder="SEARCH BY IDENTITY OR ALIAS..."
                className="w-full pl-14 pr-6 py-5 border-2 border-slate-100 bg-slate-50/50 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-900 focus:border-indigo-600 focus:bg-white outline-none transition-all shadow-sm"
                value={transferEmail}
                onFocus={() => setShowDropdown(true)}
                onChange={(e) => {
                  setTransferEmail(e.target.value);
                  setShowDropdown(true);
                }}
              />
            </div>

            <AnimatePresence>
              {showDropdown && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute z-50 w-full mt-4 bg-white/80 backdrop-blur-xl border-2 border-slate-100 rounded-[2rem] shadow-2xl overflow-hidden"
                >
                  <div className="max-h-64 overflow-y-auto custom-scrollbar p-3">
                    {filteredDropdownUsers.length > 0 ? (
                      filteredDropdownUsers.map((u) => (
                        <div
                          key={u.id}
                          className="px-5 py-4 hover:bg-indigo-50/50 rounded-2xl cursor-pointer flex items-center justify-between group transition-all"
                          onClick={() => { setTransferEmail(u.email); setShowDropdown(false); }}
                        >
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                               <span className="text-xs font-black text-slate-600 uppercase">{u.name.charAt(0)}</span>
                            </div>
                            <div>
                              <p className="text-xs font-black text-slate-950 uppercase tracking-tight">{u.name}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{u.email}</p>
                            </div>
                          </div>
                          {transferEmail === u.email && <Check className="w-5 h-5 text-indigo-600" />}
                        </div>
                      ))
                    ) : (
                      <div className="px-5 py-10 text-center text-slate-400 font-black text-[10px] uppercase tracking-widest">Protocol Search: No Results</div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {selectedUserInfo && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 bg-indigo-50/50 border-2 border-indigo-100 rounded-[2rem] flex items-center space-x-5"
              >
                 <div className="w-14 h-14 rounded-2xl bg-white border border-indigo-100 flex items-center justify-center text-indigo-600 font-black text-xl">
                   {selectedUserInfo.name.charAt(0)}
                 </div>
                 <div>
                    <p className="text-[9px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-1.5">Verified Identity</p>
                    <p className="text-base font-black text-slate-950 uppercase tracking-tight leading-none">{selectedUserInfo.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">{selectedUserInfo.phone || 'Phone Unverified'}</p>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Transfer Quota</label>
            <div className="relative group">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-black text-2xl group-focus-within:text-indigo-600 transition-colors">₹</span>
              <input
                type="number"
                min="0.01"
                step="0.01"
                required
                placeholder="0.00"
                className="w-full pl-14 pr-6 py-5 border-2 border-slate-100 bg-slate-50/50 rounded-2xl text-2xl font-black text-slate-950 focus:border-indigo-600 focus:bg-white outline-none transition-all shadow-sm"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full relative bg-slate-950 text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-slate-800 transition-all active:scale-95 group overflow-hidden mt-4 disabled:bg-slate-400"
          >
            <span className="relative z-10 flex items-center justify-center">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-3 w-5 h-5 animate-spin" /> Authenticating...
                </>
              ) : (
                <>
                  Authorize Protocol <ShieldCheck className="ml-3 w-5 h-5 group-hover:scale-110 transition-transform" />
                </>
              )}
            </span>
            {!isSubmitting && <div className="absolute inset-0 bg-indigo-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />}
          </button>
        </form>

        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-600/5 rounded-full blur-[100px]" />
      </motion.div>
    </motion.div>
  );
}

