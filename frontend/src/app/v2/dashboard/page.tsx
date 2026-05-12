"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Wallet, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

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

  if (loading) return <div className="text-slate-400 font-medium tracking-wide animate-pulse mt-10">Fetching account state...</div>;

  return (
    <div className="space-y-8 lg:space-y-10 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl lg:text-3xl font-semibold text-slate-900 tracking-tight mb-1">Account Overview</h1>
        <p className="text-slate-500 font-medium text-sm">Real-time digital assets and analytics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        <div className="bg-slate-900 rounded-2xl p-8 lg:p-10 shadow-xl text-white relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center mb-8">
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl mr-4 border border-white/5">
                <Wallet className="w-6 h-6 text-indigo-300" />
              </div>
              <h2 className="text-xs font-medium uppercase tracking-widest text-slate-300">Net Balance</h2>
            </div>
            <p className="text-4xl lg:text-5xl font-semibold tracking-tight mb-4">
              {isMounted ? `₹${Number(balance).toLocaleString('en-IN', {minimumFractionDigits: 2})}` : '₹0.00'}
            </p>
            <div className="flex space-x-2 mt-4">
               <span className="text-xs bg-indigo-500/20 text-indigo-200 border border-indigo-500/30 px-3 py-1 rounded-full font-medium">Verified Secure</span>
            </div>
          </div>
          <div className="absolute top-[-30%] right-[-10%] w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl transition-transform group-hover:scale-110 duration-700 pointer-events-none"></div>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:gap-6">
           <div className="bg-white rounded-2xl p-6 lg:p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center mb-6">
                 <ArrowDownLeft className="text-emerald-600 w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Incoming</p>
                <p className="text-lg font-semibold text-slate-900 tracking-tight">Active Stream</p>
              </div>
           </div>
           <div className="bg-white rounded-2xl p-6 lg:p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center mb-6">
                 <ArrowUpRight className="text-indigo-600 w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Outgoing</p>
                <p className="text-lg font-semibold text-slate-900 tracking-tight">Secure Tunnel</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
