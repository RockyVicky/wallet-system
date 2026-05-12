"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { useAuth } from '@/lib/AuthContext';
import { Eye, EyeOff, Lock, AlertCircle, Loader2 } from 'lucide-react';
import api from '@/lib/api';

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const togglePassword = () => {
    setShowPassword((current) => !current);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const res = await api.post('/auth/login', formData);
      login(res.data.access_token, res.data.user);
      router.push('/dashboard');
    } catch (err: unknown) {
      console.error('Login Error:', err);

      if (!axios.isAxiosError(err) || !err.response) {
        setError('Network Error: Cannot connect to the server. Please ensure your backend is running and you are on the same Wi-Fi.');
      } else {
        const message =
          typeof err.response.data?.message === 'string'
            ? err.response.data.message
            : 'Login failed. Please check your email and password.';
        setError(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md w-full p-10 bg-white rounded-[2.5rem] shadow-2xl border border-gray-100">
        <div className="mb-10 text-center">
          <h2 className="text-4xl font-black text-black uppercase tracking-tighter mb-2">Welcome Back</h2>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em]">Access your digital vault</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 text-red-700 rounded-2xl text-[11px] font-black uppercase tracking-widest border border-red-100 flex items-start">
            <AlertCircle className="w-4 h-4 mr-3 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-black uppercase tracking-widest mb-3">Email Address</label>
            <input
              type="email"
              required
              placeholder="e.g. user@vault.com"
              className="w-full px-6 py-4 border-2 border-gray-200 bg-gray-50/30 rounded-2xl text-black font-bold focus:border-indigo-600 focus:bg-white outline-none transition-all"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-black uppercase tracking-widest mb-3">Master Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="********"
                className="w-full pl-6 pr-16 py-4 border-2 border-gray-200 bg-gray-50/30 rounded-2xl text-black font-bold focus:border-indigo-600 focus:bg-white outline-none transition-all"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                onClick={togglePassword}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition p-4 z-50 rounded-xl active:bg-gray-100"
              >
                {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-gray-800 transition shadow-xl hover:-translate-y-0.5 active:translate-y-0 disabled:bg-gray-400 duration-300 flex items-center justify-center"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <Loader2 className="w-4 h-4 animate-spin mr-3" />
                Connecting...
              </span>
            ) : (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Sign In Securely
              </>
            )}
          </button>
        </form>

        <p className="mt-10 text-center text-gray-400 font-bold text-xs uppercase tracking-widest">
          New to Vault? <Link href="/register" className="text-indigo-600 hover:underline">Create Account</Link>
        </p>
      </div>
    </div>
  );
}
