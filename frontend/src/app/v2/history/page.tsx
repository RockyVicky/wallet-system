"use client";
import { useEffect, useState, useMemo } from 'react';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Search, ChevronDown, ChevronUp, ArrowDownLeft, ArrowUpRight, Filter, Download } from 'lucide-react';

interface Transaction {
  id: string;
  date: string;
  amount: number | string;
  status: string;
  type: 'CREDIT' | 'DEBIT';
  party: {
    name: string;
    email: string;
    phone?: string;
  };
}

const tableRowVariants = {
  initial: { opacity: 0, x: -10 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 10 }
};

export default function V2HistoryPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

  useEffect(() => {
    setIsMounted(true);
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/transaction/history');
      setTransactions(res.data);
    } catch (err) {
      console.error('Error fetching history', err);
    } finally {
      setLoading(false);
    }
  };

  const processedTransactions = useMemo(() => {
    let result = [...transactions];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(tx => 
        tx.party.name.toLowerCase().includes(q) || 
        tx.party.email.toLowerCase().includes(q) ||
        tx.status.toLowerCase().includes(q) ||
        tx.amount.toString().includes(q)
      );
    }
    result.sort((a: any, b: any) => {
      let vA = a[sortConfig.key as keyof Transaction] as any;
      let vB = b[sortConfig.key as keyof Transaction] as any;
      if (sortConfig.key === 'date') {
        vA = new Date(vA).getTime();
        vB = new Date(vB).getTime();
      } else if (sortConfig.key === 'amount') {
        vA = Number(vA);
        vB = Number(vB);
      }
      if (vA < vB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (vA > vB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return result;
  }, [transactions, searchQuery, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full">
       <div className="text-slate-900 font-black uppercase tracking-[0.3em] animate-pulse">Decrypting Ledger...</div>
    </div>
  );

  return (
    <div className="h-full flex flex-col font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-8"
      >
        <div>
          <h1 className="text-4xl lg:text-5xl font-black text-slate-950 tracking-tighter mb-2 uppercase italic">Audit Logs</h1>
          <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em]">Verified immutable records • v2.4</p>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-4 w-full lg:w-auto">
          <div className="relative w-full md:w-80">
             <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
             <input 
               type="text" 
               placeholder="SEARCH THE PROTOCOL..."
               className="w-full pl-12 pr-6 py-4 bg-white border-2 border-slate-100 rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest text-slate-900 outline-none focus:border-indigo-600 transition-all shadow-sm"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
             />
          </div>
          <button className="w-full md:w-auto px-6 py-4 bg-slate-950 text-white rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest flex items-center justify-center hover:bg-slate-800 transition-all shadow-xl group">
             <Download className="w-4 h-4 mr-3 group-hover:translate-y-0.5 transition-transform" /> Export CSV
          </button>
        </div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="flex-1 glass rounded-[3rem] border border-white/40 flex flex-col overflow-hidden shadow-2xl"
      >
        <div className="p-8 lg:p-10 border-b border-slate-100 flex items-center justify-between bg-white/50 backdrop-blur-md">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-slate-950 rounded-2xl flex items-center justify-center shadow-xl">
              <History className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black uppercase tracking-tighter text-slate-950">Transaction Ledger</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Real-time verification active</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
             <div className="px-4 py-2 bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-indigo-100">
               {processedTransactions.length} ENTRIES
             </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead className="bg-slate-50/80 sticky top-0 z-20 border-b border-slate-100 backdrop-blur-xl">
              <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                <th className="py-6 px-10 w-[20%] cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => handleSort('date')}>
                  <div className="flex items-center">TIMESTAMP {sortConfig.key === 'date' && (sortConfig.direction === 'desc' ? <ChevronDown className="w-3 h-3 ml-1" /> : <ChevronUp className="w-3 h-3 ml-1" />)}</div>
                </th>
                <th className="py-6 px-10 w-[40%]">COUNTERPARTY ENTITY</th>
                <th className="py-6 px-10 w-[20%] text-right cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => handleSort('amount')}>
                  <div className="flex items-center justify-end">AMOUNT {sortConfig.key === 'amount' && (sortConfig.direction === 'desc' ? <ChevronDown className="w-3 h-3 ml-1" /> : <ChevronUp className="w-3 h-3 ml-1" />)}</div>
                </th>
                <th className="py-6 px-10 w-[20%] text-center">PROTOCOL STATE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence mode="popLayout">
                {processedTransactions.length === 0 ? (
                  <motion.tr variants={tableRowVariants} initial="initial" animate="animate">
                    <td colSpan={4} className="py-32 text-center text-slate-400 font-black text-xs uppercase tracking-widest">Zero Matching Records Found</td>
                  </motion.tr>
                ) : (
                  processedTransactions.map((tx: any, index: number) => (
                    <motion.tr 
                      key={tx.id} 
                      variants={tableRowVariants}
                      initial="initial"
                      animate="animate"
                      transition={{ delay: index * 0.02 }}
                      className="group hover:bg-slate-50/50 transition-all cursor-default"
                    >
                      <td className="py-8 px-10">
                        {isMounted ? (
                          <div className="flex flex-col">
                             <span className="text-xs font-black text-slate-900 uppercase tracking-tight">{new Date(tx.date).toLocaleDateString('en-IN', {day:'2-digit', month:'short', year:'numeric'})}</span>
                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{new Date(tx.date).toLocaleTimeString('en-IN', {hour:'2-digit', minute:'2-digit'})}</span>
                          </div>
                        ) : <div className="h-10 w-24 bg-slate-50 rounded-lg animate-pulse" />}
                      </td>
                      <td className="py-8 px-10">
                         <div className="flex items-center">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mr-5 text-lg font-black uppercase shadow-sm border transition-all group-hover:scale-110 ${
                              tx.type === 'CREDIT' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-600'
                            }`}>
                              {tx.party.name.charAt(0)}
                            </div>
                            <div className="flex flex-col min-w-0">
                               <span className="text-sm font-black text-slate-950 uppercase tracking-tight truncate">{tx.party.name}</span>
                               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 truncate">{tx.party.email}</span>
                            </div>
                         </div>
                      </td>
                      <td className={`py-8 px-10 text-right text-lg font-black tracking-tighter ${
                        tx.type === 'CREDIT' ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                        <div className="flex items-center justify-end space-x-2">
                          <span>{tx.type === 'CREDIT' ? '+' : '-'}</span>
                          <span>₹{Number(tx.amount).toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                        </div>
                      </td>
                      <td className="py-8 px-10">
                        <div className="flex items-center justify-center">
                          <span className={`inline-flex items-center px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-[0.15em] border ${
                            tx.status === 'COMPLETED' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                            : 'bg-amber-50 text-amber-700 border-amber-100'
                          }`}>
                            <div className={`w-1.5 h-1.5 rounded-full mr-2.5 ${tx.status === 'COMPLETED' ? 'bg-emerald-600' : 'bg-amber-600 animate-pulse'}`} />
                            {tx.status}
                          </span>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

