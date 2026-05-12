"use client";
import { useEffect, useState, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import api from '@/lib/api';
import { LogOut, Wallet, Send, PlusCircle, History, X, Search, User, Check, Edit3, MousePointer2 } from 'lucide-react';

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

export default function DashboardPage() {
  const { user, logout, updateUser, loading } = useAuth();
  const router = useRouter();
  const [balance, setBalance] = useState(0);
  const [amountToAdd, setAmountToAdd] = useState('');
  const [transferEmail, setTransferEmail] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [filteredDropdownUsers, setFilteredDropdownUsers] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isMounted, setIsMounted] = useState(false);
  
  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({ name: '', phone: '' });
  
  // History Search & Sort
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
    if (user) {
      fetchDashboardData();
      setProfileData({ name: user.name, phone: user.phone || '' });
    }
  }, [user, loading]);

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

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ type: '', text: '' }), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchDashboardData = async () => {
    try {
      const [balanceRes, historyRes, usersRes] = await Promise.all([
        api.get('/wallet/balance'),
        api.get('/transaction/history'),
        api.get('/user')
      ]);
      setBalance(balanceRes.data.balance);
      setTransactions(historyRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error('Error fetching dashboard data', err);
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
      let valA = a[sortConfig.key as keyof Transaction] as any;
      let valB = b[sortConfig.key as keyof Transaction] as any;
      if (sortConfig.key === 'date') {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      } else if (sortConfig.key === 'amount') {
        valA = Number(valA);
        valB = Number(valB);
      }
      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
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

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/user/profile', profileData);
      updateUser(profileData);
      setIsEditingProfile(false);
      setMessage({ type: 'success', text: 'Profile updated!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Update failed' });
    }
  };

  const handleAddMoney = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/wallet/add-money', { amount: Number(amountToAdd) });
      setMessage({ type: 'success', text: 'Funds deposited successfully' });
      setAmountToAdd('');
      fetchDashboardData();
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Deposit failed' });
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/transaction/transfer', {
        receiverEmail: transferEmail,
        amount: Number(transferAmount)
      });
      setMessage({ type: 'success', text: 'Transfer completed successfully' });
      setTransferEmail('');
      setTransferAmount('');
      fetchDashboardData();
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Transfer failed' });
    }
  };

  const selectedUserInfo = useMemo(() => {
    return users.find(u => u.email === transferEmail);
  }, [transferEmail, users]);

  if (!isMounted || loading || !user) return <div className="min-h-screen flex items-center justify-center text-slate-500 font-medium tracking-wide">Loading...</div>;

  return (
    <div className="h-[100dvh] bg-slate-50 flex flex-col font-sans overflow-hidden">
      {/* Header */}
      <header className="flex-none z-20 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm px-6 lg:px-8 py-4 sticky top-0">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center">
          <div className="flex items-center group cursor-pointer" onClick={() => setIsEditingProfile(true)}>
            <div className="w-10 h-10 lg:w-11 lg:h-11 bg-slate-50 rounded-xl flex items-center justify-center mr-3 lg:mr-4 border border-slate-200 group-hover:bg-slate-100 group-hover:shadow-sm transition-all duration-300">
               <User className="w-5 h-5 text-slate-700" />
            </div>
            <div>
              <div className="flex items-center">
                <h2 className="text-sm lg:text-lg font-semibold text-slate-900 tracking-tight leading-none">{user.name}</h2>
                <Edit3 className="w-3 h-3 ml-2 text-slate-400 group-hover:text-indigo-500 transition-colors" />
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1 hidden sm:block">{user.email} • {user.phone || 'No Phone'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 lg:space-x-6">
            <div className="relative flex items-center group/v2">
              <div className="absolute -left-28 top-1/2 -translate-y-1/2 hidden md:flex items-center pointer-events-none animate-pulse-horizontal">
                <span className="bg-indigo-600 text-[9px] text-white px-2 py-1 rounded-md font-black uppercase tracking-widest shadow-lg mr-2 whitespace-nowrap">Try Premium UI</span>
                <MousePointer2 className="w-4 h-4 text-indigo-600 rotate-90 fill-indigo-600" />
              </div>
              <button
                onClick={() => router.push('/v2/dashboard')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs lg:text-sm font-black uppercase tracking-wider hover:bg-indigo-700 transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_20px_rgba(79,70,229,0.5)] active:scale-95"
              >
                V2 UI
              </button>
            </div>
            <button
              onClick={() => { logout(); router.push('/login'); }}
              className="flex items-center text-slate-500 hover:text-rose-600 font-medium text-xs lg:text-sm transition-colors group"
            >
              <LogOut className="w-4 h-4 mr-2 group-hover:-translate-x-0.5 transition-transform" /> <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Profile Edit Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl p-8 lg:p-10 w-full max-w-md shadow-xl border border-slate-100 relative">
            <button onClick={() => setIsEditingProfile(false)} className="absolute right-6 top-6 text-slate-400 hover:text-slate-900 transition-colors">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl lg:text-2xl font-semibold text-slate-900 mb-6 tracking-tight">Edit Profile</h2>
            <form onSubmit={handleUpdateProfile} className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-slate-600 uppercase tracking-wider mb-2">Display Name</label>
                <input
                  type="text"
                  required
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 border border-slate-200 bg-slate-50/50 rounded-xl text-slate-900 font-medium focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white outline-none transition-all"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 uppercase tracking-wider mb-2">Phone</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full px-4 py-3 border border-slate-200 bg-slate-50/50 rounded-xl text-slate-900 font-medium focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white outline-none transition-all"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                />
              </div>
              <button type="submit" className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-medium text-sm hover:bg-slate-800 transition-all shadow-sm hover:shadow active:scale-[0.98] mt-2">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      <main className="flex-1 overflow-y-auto lg:overflow-hidden">
        <div className="max-w-[1700px] mx-auto w-full flex flex-col lg:flex-row h-auto lg:h-full p-4 lg:p-8 gap-6 lg:gap-8">
          
          {/* Left Column (Actions) */}
          <div className="flex-none lg:w-[320px] xl:w-[380px] h-auto lg:h-full lg:overflow-y-auto pr-0 lg:pr-2 custom-scrollbar space-y-6">
            {message.text && (
              <div className={`p-4 rounded-xl font-medium shadow-sm border text-sm flex justify-between items-center animate-in fade-in slide-in-from-top-2 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                <span>{message.text}</span>
                <button onClick={() => setMessage({ type: '', text: '' })}><X className="w-4 h-4 opacity-70 hover:opacity-100" /></button>
              </div>
            )}
            
            {/* Balance Widget */}
            <div className="bg-slate-900 rounded-2xl p-8 shadow-lg text-white relative overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500 pointer-events-none">
                <Wallet className="w-32 h-32" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center mb-6">
                  <div className="bg-white/10 p-2 rounded-lg mr-3 backdrop-blur-md">
                    <Wallet className="w-5 h-5 text-indigo-300" />
                  </div>
                  <h2 className="text-xs font-medium uppercase tracking-wider text-slate-400">Total Balance</h2>
                </div>
                <p className="text-4xl font-semibold tracking-tight text-white">
                  {isMounted ? `₹${Number(balance).toLocaleString('en-IN', {minimumFractionDigits: 2})}` : '₹0.00'}
                </p>
              </div>
            </div>

            {/* Deposit Form */}
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200 hover:shadow-2xl transition-shadow duration-300">
              <h2 className="text-lg font-semibold flex items-center mb-6 text-slate-900 tracking-tight">
                <PlusCircle className="w-5 h-5 mr-3 text-emerald-500" /> Add Funds
              </h2>
              <form onSubmit={handleAddMoney} className="space-y-4">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-lg">₹</span>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    required
                    placeholder="0.00"
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 bg-slate-50/50 rounded-xl text-slate-900 text-lg font-medium focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white outline-none transition-all"
                    value={amountToAdd}
                    onChange={(e) => setAmountToAdd(e.target.value)}
                  />
                </div>
                <button type="submit" className="w-full bg-emerald-600 text-white py-3.5 rounded-xl font-medium text-sm hover:bg-emerald-700 transition-all shadow-sm hover:shadow active:scale-[0.98]">
                  Deposit Amount
                </button>
              </form>
            </div>

            {/* Send Form */}
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200 hover:shadow-2xl transition-shadow duration-300">
              <h2 className="text-lg font-semibold flex items-center mb-6 text-slate-900 tracking-tight">
                <Send className="w-5 h-5 mr-3 text-indigo-500" /> Transfer
              </h2>
              <form onSubmit={handleTransfer} className="space-y-4">
                <div className="relative" ref={dropdownRef}>
                  <div className="relative">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                     <input
                       type="email"
                       required
                       placeholder="Recipient email or name"
                       className="w-full pl-10 pr-4 py-3 border border-slate-200 bg-slate-50/50 rounded-xl text-slate-900 text-sm font-medium focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white outline-none transition-all"
                       value={transferEmail}
                       onFocus={() => setShowDropdown(true)}
                       onChange={(e) => {
                         setTransferEmail(e.target.value);
                         setShowDropdown(true);
                       }}
                     />
                  </div>
                  {showDropdown && (
                    <div className="absolute z-[100] w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                      <div className="max-h-56 overflow-y-auto custom-scrollbar py-2">
                        {filteredDropdownUsers.length > 0 ? (
                          filteredDropdownUsers.map((u) => (
                            <div
                              key={u.id}
                              className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors"
                              onClick={() => { setTransferEmail(u.email); setShowDropdown(false); }}
                            >
                              <div>
                                <p className="text-sm font-medium text-slate-900">{u.name}</p>
                                <p className="text-xs text-slate-500">{u.email}</p>
                              </div>
                              {transferEmail === u.email && <Check className="w-4 h-4 text-indigo-600" />}
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-6 text-center text-slate-400 text-sm font-medium">No matches found</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {selectedUserInfo && (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl animate-in fade-in">
                     <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Sending to</p>
                     <p className="text-sm font-semibold text-slate-900">{selectedUserInfo.name}</p>
                     <p className="text-xs text-slate-600">{selectedUserInfo.phone || 'No Phone recorded'}</p>
                  </div>
                )}

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-lg">₹</span>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    required
                    placeholder="0.00"
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 bg-slate-50/50 rounded-xl text-slate-900 text-lg font-medium focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white outline-none transition-all"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                  />
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-medium text-sm hover:bg-indigo-700 transition-all shadow-sm hover:shadow active:scale-[0.98]">
                  Confirm Transfer
                </button>
              </form>
            </div>
          </div>

          {/* Right Column (History) */}
          <div className="flex-1 bg-white rounded-2xl shadow-xl border border-slate-200 flex flex-col h-[600px] lg:h-full overflow-hidden shrink-0">
            <div className="flex-none p-6 lg:p-8 bg-white border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center">
                <div className="p-2 bg-slate-50 rounded-lg mr-4">
                  <History className="w-5 h-5 text-slate-700" />
                </div>
                <h2 className="text-xl font-semibold text-slate-900 tracking-tight">Recent Transactions</h2>
              </div>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Search by name, email, or amount..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:bg-white transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar">
              <table className="w-full text-left min-w-[800px]">
                <thead className="bg-slate-50/50 sticky top-0 z-10 backdrop-blur-sm">
                  <tr className="text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
                    <th className="py-4 px-6 cursor-pointer hover:text-slate-800 transition-colors" onClick={() => handleSort('date')}>Date & Time</th>
                    <th className="py-4 px-6">Counterparty</th>
                    <th className="py-4 px-6">Phone</th>
                    <th className="py-4 px-6 text-right cursor-pointer hover:text-slate-800 transition-colors" onClick={() => handleSort('amount')}>Amount</th>
                    <th className="py-4 px-6 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {processedTransactions.map((tx: any) => (
                    <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="py-5 px-6">
                        {isMounted ? (
                          <div className="flex flex-col">
                             <span className="text-sm font-medium text-slate-900">{new Date(tx.date).toLocaleDateString('en-IN', {day:'2-digit', month:'short', year:'numeric'})}</span>
                             <span className="text-xs text-slate-500 mt-0.5">{new Date(tx.date).toLocaleTimeString('en-IN', {hour:'2-digit', minute:'2-digit'})}</span>
                          </div>
                        ) : <div className="h-8 w-24 bg-slate-100 animate-pulse rounded"></div>}
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center mr-3 text-slate-600 font-semibold text-xs">
                            {tx.party.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                             <span className="text-sm font-semibold text-slate-900">{tx.party.name}</span>
                             <span className="text-xs text-slate-500">{tx.party.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-6 text-sm text-slate-600">
                        {tx.party.phone || '—'}
                      </td>
                      <td className={`py-5 px-6 text-right font-semibold ${
                        tx.type === 'CREDIT' ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                        {tx.type === 'CREDIT' ? '+' : '-'}₹{Number(tx.amount).toLocaleString('en-IN', {minimumFractionDigits: 2})}
                      </td>
                      <td className="py-5 px-6 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          tx.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20' : 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {processedTransactions.length === 0 && isMounted && (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-500 text-sm">
                        No transactions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        
        @keyframes pulse-horizontal {
          0%, 100% { transform: translate(-8px, -50%); opacity: 0.8; }
          50% { transform: translate(0px, -50%); opacity: 1; }
        }
        .animate-pulse-horizontal {
          animation: pulse-horizontal 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
