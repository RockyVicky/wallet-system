"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { Eye, EyeOff, UserPlus, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await api.post('/auth/register', formData);
      router.push('/login');
    } catch (err: any) {
      console.error('Registration Error:', err);
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md w-full p-10 bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-500">
        <div className="mb-10 text-center">
          <h2 className="text-4xl font-black text-black uppercase tracking-tighter mb-2">Join Vault</h2>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em]">Begin your financial journey</p>
        </div>
        
        {error && <div className="mb-8 p-4 bg-red-50 text-red-700 rounded-2xl text-[11px] font-black uppercase tracking-widest border border-red-100">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-black uppercase tracking-widest mb-3">Legal Full Name</label>
            <input
              type="text"
              required
              suppressHydrationWarning
              placeholder="e.g. John Doe"
              className="w-full px-6 py-4 border-2 border-gray-200 bg-gray-50/30 rounded-2xl text-black font-bold focus:border-indigo-600 focus:bg-white outline-none transition-all"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-black uppercase tracking-widest mb-3">Email Address</label>
            <input
              type="email"
              required
              suppressHydrationWarning
              placeholder="e.g. user@vault.com"
              className="w-full px-6 py-4 border-2 border-gray-200 bg-gray-50/30 rounded-2xl text-black font-bold focus:border-indigo-600 focus:bg-white outline-none transition-all"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-black uppercase tracking-widest mb-3">Phone Identifier</label>
            <input
              type="tel"
              required
              suppressHydrationWarning
              placeholder="+91 XXXXX XXXXX"
              className="w-full px-6 py-4 border-2 border-gray-200 bg-gray-50/30 rounded-2xl text-black font-bold focus:border-indigo-600 focus:bg-white outline-none transition-all"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-black uppercase tracking-widest mb-3">Secure Password</label>
            <div className="relative">
              <input
                key={showPassword ? 'visible' : 'hidden'}
                type={showPassword ? "text" : "password"}
                required
                suppressHydrationWarning
                placeholder="••••••••"
                className="w-full pl-6 pr-16 py-4 border-2 border-gray-200 bg-gray-50/30 rounded-2xl text-black font-bold focus:border-indigo-600 focus:bg-white outline-none transition-all"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                suppressHydrationWarning
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition p-4 z-50 rounded-xl active:bg-gray-100"
              >
                {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            suppressHydrationWarning
            className="w-full bg-black text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-gray-800 transition shadow-xl hover:-translate-y-0.5 active:translate-y-0 disabled:bg-gray-400 duration-300 flex items-center justify-center"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <Loader2 className="w-4 h-4 animate-spin mr-3" />
                Registering...
              </span>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                Create Vault Account
              </>
            )}
          </button>
        </form>
        
        <p className="mt-10 text-center text-gray-400 font-bold text-xs uppercase tracking-widest">
          Member already? <Link href="/login" className="text-indigo-600 hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
