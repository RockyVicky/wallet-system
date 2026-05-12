"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Shield, Zap, Globe, ArrowRight, CheckCircle2, ChevronRight, Lock, Fingerprint, Coins } from 'lucide-react';
import Vault3D from '@/components/Vault3D';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-950 selection:bg-indigo-600 selection:text-white">
      <div className="grain-overlay" />
      
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 ${isScrolled ? 'bg-white/80 backdrop-blur-xl border-b border-slate-100 py-4' : 'bg-transparent py-8'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center shadow-2xl">
              <Wallet className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tighter uppercase">Vault</span>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-8"
          >
            <Link href="/login" className="text-xs font-bold uppercase tracking-widest hover:text-indigo-600 transition-colors">Sign In</Link>
            <Link href="/register" className="group relative bg-slate-950 text-white px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-[0.15em] overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl">
              <span className="relative z-10">Get Started</span>
              <div className="absolute inset-0 bg-indigo-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-44 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="relative z-10"
            >
              <motion.div 
                variants={fadeIn}
                className="inline-flex items-center px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full mb-8"
              >
                <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mr-2.5 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-700">Digital Asset Protocol v2.0</span>
              </motion.div>
              
              <motion.h1 
                variants={fadeIn}
                className="text-7xl lg:text-9xl font-black tracking-tighter leading-[0.85] mb-10"
              >
                SECURE <br />
                <span className="text-slate-400">YOUR</span> <br />
                <span className="relative inline-block">
                   WEALTH
                   <motion.div 
                     initial={{ scaleX: 0 }}
                     animate={{ scaleX: 1 }}
                     transition={{ delay: 1, duration: 1 }}
                     className="absolute -bottom-2 left-0 w-full h-2 bg-indigo-600 origin-left"
                   />
                </span>
              </motion.h1>
              
              <motion.p 
                variants={fadeIn}
                className="text-xl text-slate-500 font-medium max-w-lg mb-12 leading-relaxed"
              >
                Experience radical transparency and military-grade encryption. The first digital vault built for the next era of decentralized finance.
              </motion.p>
              
              <motion.div variants={fadeIn} className="flex flex-wrap gap-6">
                <Link href="/register" className="bg-slate-950 text-white px-10 py-5 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-2xl flex items-center group">
                  Open Vault <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/login" className="px-10 py-5 bg-white border border-slate-200 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center">
                  Live Dashboard
                </Link>
              </motion.div>

              <motion.div 
                variants={fadeIn}
                className="mt-16 flex items-center space-x-12"
              >
                 <div className="flex -space-x-3">
                    {[1,2,3,4].map(i => (
                      <div key={i} className={`w-10 h-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold`}>U{i}</div>
                    ))}
                 </div>
                 <div className="text-xs font-medium text-slate-400">
                    <span className="text-slate-900 font-bold">12,000+</span> users trusting <br /> Vault globally.
                 </div>
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="relative lg:h-[700px] flex items-center justify-center"
            >
              <Vault3D />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent pointer-events-none" />
            </motion.div>
          </div>
        </div>
        
        {/* Background Decorative Elements */}
        <div className="absolute top-1/4 -right-20 w-[500px] h-[500px] bg-indigo-100/50 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-1/4 -left-20 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-[120px] -z-10" />
      </section>

      {/* Trust & Bento Grid */}
      <section className="py-32 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-20">
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-600 mb-4">Core Architecture</h2>
            <p className="text-4xl lg:text-5xl font-black tracking-tight text-slate-950">Designed for absolute precision.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main Bento Item */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="md:col-span-2 glass rounded-[3rem] p-12 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
                <Shield className="w-64 h-64" />
              </div>
              <div className="relative z-10">
                <Shield className="w-12 h-12 text-indigo-600 mb-8" />
                <h3 className="text-3xl font-bold mb-4 tracking-tight">Quantum-Safe Guard</h3>
                <p className="text-slate-500 font-medium text-lg max-w-md leading-relaxed">
                  Your assets are encrypted with multi-layer verification protocols, ensuring zero-knowledge privacy and military-grade protection.
                </p>
                <div className="mt-12 flex items-center space-x-4">
                  <div className="px-4 py-2 bg-white border border-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-sm">SOC 2 TYPE II</div>
                  <div className="px-4 py-2 bg-white border border-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-sm">PCI DSS</div>
                </div>
              </div>
            </motion.div>

            {/* Small Bento Item */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="glass rounded-[3rem] p-10 flex flex-col justify-between bg-slate-950 text-white"
            >
              <Zap className="w-10 h-10 text-indigo-400" />
              <div>
                <h3 className="text-2xl font-bold mb-3 tracking-tight">Instant Sync</h3>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">
                  Sub-millisecond processing speeds for global settlements.
                </p>
              </div>
            </motion.div>

            {/* Another Small Item */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="glass rounded-[3rem] p-10 flex flex-col justify-between"
            >
              <Fingerprint className="w-10 h-10 text-indigo-600" />
              <div>
                <h3 className="text-2xl font-bold mb-3 tracking-tight">Biometric Auth</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">
                  Passwordless access via secure hardware enclaves.
                </p>
              </div>
            </motion.div>

            {/* Bottom Wide Item */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="md:col-span-2 glass rounded-[3rem] p-12 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white relative overflow-hidden"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 relative z-10">
                <div>
                  <h3 className="text-3xl font-bold mb-4 tracking-tight">Global Connectivity</h3>
                  <p className="text-indigo-100 font-medium text-lg max-w-md leading-relaxed">
                    Connect your vault to over 150+ financial institutions globally with 0% gateway fees.
                  </p>
                </div>
                <div className="flex-none bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center space-x-6 mb-4">
                    <div className="w-12 h-8 bg-white/20 rounded" />
                    <div className="w-24 h-4 bg-white/20 rounded" />
                  </div>
                  <div className="text-2xl font-black tracking-tighter uppercase italic">Verified</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center"
          >
            <h2 className="text-5xl lg:text-7xl font-black tracking-tighter mb-10">READY TO UPGRADE <br /> YOUR FINANCE?</h2>
            <Link href="/register" className="bg-slate-950 text-white px-12 py-6 rounded-full text-sm font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center group">
              Start Your Journey <ArrowRight className="ml-4 w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-slate-100 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center space-x-4">
             <div className="w-8 h-8 bg-slate-950 rounded-lg flex items-center justify-center">
                <Wallet className="text-white w-4 h-4" />
             </div>
             <span className="text-xs font-black uppercase tracking-widest text-slate-400">Vault Digital Protocol © 2026</span>
          </div>
          <div className="flex space-x-12 text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
            <Link href="#" className="hover:text-slate-950 transition-colors">Infrastructure</Link>
            <Link href="#" className="hover:text-slate-950 transition-colors">Governance</Link>
            <Link href="#" className="hover:text-slate-950 transition-colors">Intelligence</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

