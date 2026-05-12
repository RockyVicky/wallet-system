"use client";
import { useEffect, useState, useMemo } from 'react';
import api from '@/lib/api';
import { History, Search, ChevronDown, ChevronUp } from 'lucide-react';

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

export default function V2HistoryPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  
  // Search & Sort
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

  if (loading) return <div className="text-slate-400 font-medium tracking-wide animate-pulse mt-10">Retrieving audit logs...</div>;

  return (
    <div className="h-full flex flex-col font-sans animate-in fade-in duration-500">
      <div className="mb-8 flex-none flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-semibold text-slate-900 tracking-tight mb-1">Audit Logs</h1>
          <p className="text-slate-500 font-medium text-sm">Verified transaction history</p>
        </div>
        <div className="relative w-full md:w-80 lg:w-96">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
           <input 
             type="text" 
             placeholder="Filter the ledger..."
             className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm"
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
           />
        </div>
      </div>
      
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
        <div className="p-6 bg-white border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-2 bg-slate-50 rounded-lg mr-4 border border-slate-100">
              <History className="w-5 h-5 text-slate-600" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900 tracking-tight">Transaction Ledger</h2>
          </div>
          <span className="bg-slate-100 text-slate-600 text-xs font-semibold px-3 py-1 rounded-full">{processedTransactions.length} Items</span>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <table className="w-full text-left table-fixed">
            <thead className="bg-slate-50/50 sticky top-0 z-10 border-b border-slate-200 backdrop-blur-sm">
              <tr className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <th className="py-4 px-6 lg:px-8 w-[25%] lg:w-[20%] cursor-pointer hover:text-slate-800 transition-colors" onClick={() => handleSort('date')}>
                  <div className="flex items-center">Date {sortConfig.key === 'date' && (sortConfig.direction === 'desc' ? <ChevronDown className="w-3 h-3 ml-1" /> : <ChevronUp className="w-3 h-3 ml-1" />)}</div>
                </th>
                <th className="py-4 px-6 lg:px-8 w-[30%] lg:w-[38%]">Counterparty Identity</th>
                <th className="py-4 px-6 lg:px-8 w-[20%] lg:w-[16%]">Phone</th>
                <th className="py-4 px-6 lg:px-8 w-[15%] lg:w-[16%] text-right cursor-pointer hover:text-slate-800 transition-colors" onClick={() => handleSort('amount')}>
                  <div className="flex items-center justify-end">Amount {sortConfig.key === 'amount' && (sortConfig.direction === 'desc' ? <ChevronDown className="w-3 h-3 ml-1" /> : <ChevronUp className="w-3 h-3 ml-1" />)}</div>
                </th>
                <th className="py-4 px-6 lg:px-8 w-[10%] text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {processedTransactions.length === 0 ? (
                <tr><td colSpan={5} className="py-20 text-center text-slate-400 font-medium text-sm">No Records Matching Filter</td></tr>
              ) : (
                processedTransactions.map((tx: any) => (
                  <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="py-5 px-6 lg:px-8">
                      {isMounted ? (
                        <div className="flex flex-col">
                           <span className="text-sm font-medium text-slate-900">{new Date(tx.date).toLocaleDateString('en-IN', {day:'2-digit', month:'short', year:'numeric'})}</span>
                           <span className="text-xs text-slate-500 mt-0.5">{new Date(tx.date).toLocaleTimeString('en-IN', {hour:'2-digit', minute:'2-digit'})}</span>
                        </div>
                      ) : <div className="h-8 w-24 bg-slate-100 animate-pulse rounded"></div>}
                    </td>
                    <td className="py-5 px-6 lg:px-8">
                       <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center mr-3 text-slate-600 font-semibold text-xs shrink-0">
                            {tx.party.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex flex-col min-w-0">
                             <span className="text-sm font-semibold text-slate-900 truncate">{tx.party.name}</span>
                             <span className="text-xs text-slate-500 truncate">{tx.party.email}</span>
                          </div>
                       </div>
                    </td>
                    <td className="py-5 px-6 lg:px-8 text-sm text-slate-600">
                       {tx.party.phone || '—'}
                    </td>
                    <td className={`py-5 px-6 lg:px-8 text-sm lg:text-base font-semibold text-right ${
                      tx.type === 'CREDIT' ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {tx.type === 'CREDIT' ? '+' : '-'}₹{Number(tx.amount).toLocaleString('en-IN', {minimumFractionDigits: 2})}
                    </td>
                    <td className="py-5 px-6 lg:px-8 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        tx.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20' : 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
