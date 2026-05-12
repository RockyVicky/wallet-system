"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import api from '@/lib/api';
import { PlusCircle, X } from 'lucide-react';

export default function V2AddMoneyPage() {
  const [amountToAdd, setAmountToAdd] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const router = useRouter();

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ type: '', text: '' }), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleAddMoney = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/wallet/add-money', { amount: Number(amountToAdd) });
      setMessage({ type: 'success', text: 'Deposit authorized successfully!' });
      setAmountToAdd('');
      setTimeout(() => router.push('/v2/dashboard'), 2000);
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Deposit failed. Please try again.' });
    }
  };

  return (
    <div className="max-w-xl font-sans animate-in fade-in duration-500">
      <div className="mb-10">
        <h1 className="text-2xl lg:text-3xl font-semibold text-slate-900 tracking-tight mb-1">Fund Assets</h1>
        <p className="text-slate-500 font-medium text-sm">Instant liquidity injection to your vault</p>
      </div>
      
      {message.text && (
        <div className={`mb-8 p-4 rounded-xl font-medium text-sm border flex justify-between items-center animate-in fade-in slide-in-from-top-2 ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
        }`}>
          <span>{message.text}</span>
          <button onClick={() => setMessage({ type: '', text: '' })}><X className="w-4 h-4 opacity-70 hover:opacity-100 transition-opacity" /></button>
        </div>
      )}

      <div className="bg-white rounded-2xl p-8 lg:p-10 shadow-sm border border-slate-200">
        <div className="flex items-center mb-8">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mr-4 border border-emerald-100">
             <PlusCircle className="w-6 h-6 text-emerald-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 tracking-tight">Add Liquidity</h2>
        </div>
        
        <form onSubmit={handleAddMoney} className="space-y-6">
          <div>
            <label className="block text-xs font-medium text-slate-600 uppercase tracking-wider mb-2">Total Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-xl">₹</span>
              <input
                type="number"
                min="0.01"
                step="0.01"
                required
                placeholder="0.00"
                className="w-full pl-10 pr-4 py-3.5 border border-slate-200 bg-slate-50/50 rounded-xl text-slate-900 text-lg font-medium focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white outline-none transition-all"
                value={amountToAdd}
                onChange={(e) => setAmountToAdd(e.target.value)}
              />
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-4 rounded-xl font-medium text-sm shadow-sm hover:shadow hover:bg-emerald-700 transition-all active:scale-[0.98] mt-2"
          >
            Confirm Deposit
          </button>
        </form>
      </div>
    </div>
  );
}
