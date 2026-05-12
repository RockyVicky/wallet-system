"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Wallet, Shield, Zap, Globe, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-black overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center mr-3 shadow-lg">
              <Wallet className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-black uppercase tracking-tighter">Vault Wallet</span>
          </div>
          <div className="flex items-center space-x-8">
            <Link href="/login" className="text-xs font-black uppercase tracking-widest hover:text-indigo-600 transition">Sign In</Link>
            <Link href="/register" className="bg-black text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition shadow-xl">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-row-2 gap-16 items-center text-center">
          <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <div className="inline-flex items-center px-4 py-2 bg-indigo-50 rounded-full mb-8">
              <span className="w-2 h-2 bg-indigo-600 rounded-full mr-3 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">The Future of Digital Finance</span>
            </div>
            <h1 className="text-6xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-8">
              SECURE YOUR <span className="text-indigo-600">WEALTH</span> IN THE DIGITAL VAULT.
            </h1>
            <p className="text-lg lg:text-xl text-gray-500 font-medium mb-10 leading-relaxed">
              Experience the next generation of money management. Instant transfers, military-grade security, and a beautiful interface designed for the modern world.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/register" className="w-full sm:w-auto bg-black text-white px-10 py-5 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-gray-800 transition shadow-2xl flex items-center justify-center">
                Create Free Account <ArrowRight className="ml-3 w-5 h-5" />
              </Link>
              <Link href="/login" className="w-full sm:w-auto px-10 py-5 border-2 border-gray-100 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-gray-50 transition flex items-center justify-center">
                Access Dashboard
              </Link>
            </div>
          </div>
          
          <div className="relative animate-in zoom-in-95 fade-in duration-1000 delay-300">
             <div className="bg-gradient-to-br from-gray-900 to-black rounded-[3rem] p-1 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] overflow-hidden">
                <div className="bg-white/5 backdrop-blur-sm rounded-[2.8rem] p-10 flex flex-col items-center">
                   <div className="w-full flex justify-between items-center mb-12">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-red-400 rounded-full" />
                        <div className="w-3 h-3 bg-amber-400 rounded-full" />
                        <div className="w-3 h-3 bg-green-400 rounded-full" />
                      </div>
                      <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest">vault-v2.dashboard.secure</div>
                   </div>
                   <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-left">
                      <div className="p-6 bg-white/10 rounded-3xl border border-white/10">
                         <p className="text-[10px] text-gray-400 font-black uppercase mb-2">Balance</p>
                         <p className="text-3xl font-black text-white tracking-tighter">₹84,290.00</p>
                      </div>
                      <div className="p-6 bg-white/10 rounded-3xl border border-white/10">
                         <p className="text-[10px] text-gray-400 font-black uppercase mb-2">Volume</p>
                         <p className="text-3xl font-black text-white tracking-tighter">+12.4%</p>
                      </div>
                      <div className="p-6 bg-indigo-600 rounded-3xl shadow-xl">
                         <p className="text-[10px] text-white/60 font-black uppercase mb-2">Status</p>
                         <p className="text-3xl font-black text-white tracking-tighter">Verified</p>
                      </div>
                   </div>
                   <div className="w-full h-40 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center">
                      <div className="flex space-x-1 items-end h-20">
                         {[40, 70, 45, 90, 65, 80, 50, 95].map((h, i) => (
                           <div key={i} className="w-6 bg-indigo-500/30 rounded-t-lg transition-all duration-1000" style={{ height: `${h}%` }} />
                         ))}
                      </div>
                   </div>
                </div>
             </div>
             {/* Decorative Blobs */}
             <div className="absolute -top-20 -right-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-[100px] z-[-1]" />
             <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] z-[-1]" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: Shield, title: "Military Security", desc: "Your assets are protected by advanced cryptographic protocols and multi-factor verification." },
              { icon: Zap, title: "Instant Settlements", desc: "No more waiting. Transfers are processed in real-time, ensuring your money is always where it needs to be." },
              { icon: Globe, title: "Borderless Access", desc: "Access your vault from anywhere in the world with our responsive unified interface." }
            ].map((f, i) => (
              <div key={i} className="p-10 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-xl transition duration-500">
                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-8">
                  <f.icon className="w-7 h-7 text-black" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight mb-4">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Footer */}
      <footer className="py-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center">
            <Wallet className="w-6 h-6 mr-3" />
            <span className="text-sm font-black uppercase tracking-widest">Vault Wallet © 2026</span>
          </div>
          <div className="flex space-x-10 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <Link href="#" className="hover:text-black">Privacy</Link>
            <Link href="#" className="hover:text-black">Security</Link>
            <Link href="#" className="hover:text-black">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
