"use client";
import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import api from '@/lib/api';
import { Send, X, User, Search, Check } from 'lucide-react';

export default function V2TransferPage() {
  const { user } = useAuth();
  const [transferEmail, setTransferEmail] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [filteredDropdownUsers, setFilteredDropdownUsers] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
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
    try {
      await api.post('/transaction/transfer', {
        receiverEmail: transferEmail,
        amount: Number(transferAmount)
      });
      setMessage({ type: 'success', text: 'Secure transfer completed successfully!' });
      setTransferEmail('');
      setTransferAmount('');
      setTimeout(() => router.push('/v2/dashboard'), 2000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Transfer validation failed' });
    }
  };

  return (
    <div className="max-w-xl font-sans animate-in fade-in duration-500">
      <div className="mb-10">
        <h1 className="text-2xl lg:text-3xl font-semibold text-slate-900 tracking-tight mb-1">Secure Transfer</h1>
        <p className="text-slate-500 font-medium text-sm">End-to-end verified fund movement</p>
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
          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mr-4 border border-indigo-100">
             <Send className="w-6 h-6 text-indigo-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 tracking-tight">Initiate Send</h2>
        </div>
        
        <form onSubmit={handleTransfer} className="space-y-6">
          <div className="relative" ref={dropdownRef}>
            <label className="block text-xs font-medium text-slate-600 uppercase tracking-wider mb-2">Recipient Identity</label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="email"
                required
                placeholder="Search by name or email"
                className="w-full pl-11 pr-4 py-3.5 border border-slate-200 bg-slate-50/50 rounded-xl text-slate-900 text-sm font-medium focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white outline-none transition-all"
                value={transferEmail}
                onFocus={() => setShowDropdown(true)}
                onChange={(e) => {
                  setTransferEmail(e.target.value);
                  setShowDropdown(true);
                }}
              />
            </div>

            {showDropdown && (
              <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                <div className="max-h-56 overflow-y-auto custom-scrollbar py-2">
                  {filteredDropdownUsers.length > 0 ? (
                    filteredDropdownUsers.map((u) => (
                      <div
                        key={u.id}
                        className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-center justify-between group transition-colors"
                        onClick={() => { setTransferEmail(u.email); setShowDropdown(false); }}
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center mr-3">
                             <span className="text-xs font-semibold text-slate-600">{u.name.charAt(0).toUpperCase()}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900">{u.name}</p>
                            <p className="text-xs text-slate-500">{u.email}</p>
                          </div>
                        </div>
                        {transferEmail === u.email && <Check className="w-4 h-4 text-indigo-600" />}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-6 text-center text-slate-400 font-medium text-sm">Recipient not found</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {selectedUserInfo && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl animate-in fade-in">
               <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Verified Destination</p>
               <p className="text-sm font-semibold text-slate-900 leading-tight">{selectedUserInfo.name}</p>
               <p className="text-xs text-slate-600 mt-0.5">{selectedUserInfo.phone || 'Phone Unverified'}</p>
            </div>
          )}
          
          <div>
            <label className="block text-xs font-medium text-slate-600 uppercase tracking-wider mb-2">Transfer Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-xl">₹</span>
              <input
                type="number"
                min="0.01"
                step="0.01"
                required
                placeholder="0.00"
                className="w-full pl-10 pr-4 py-3.5 border border-slate-200 bg-slate-50/50 rounded-xl text-slate-900 text-lg font-medium focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white outline-none transition-all"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
              />
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-medium text-sm shadow-sm hover:shadow hover:bg-indigo-700 transition-all active:scale-[0.98] mt-2"
          >
            Authorize Transfer
          </button>
        </form>
      </div>
    </div>
  );
}
