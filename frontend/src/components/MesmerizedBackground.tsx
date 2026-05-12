"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function MesmerizedBackground() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-slate-100/50 rounded-full blur-[160px]" />
      
      {/* Moving blobs */}
      <motion.div 
        animate={{ 
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{ 
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-1/4 left-1/3 w-64 h-64 bg-purple-500/5 rounded-full blur-[100px]"
      />
      <motion.div 
        animate={{ 
          x: [0, -150, 0],
          y: [0, 100, 0],
        }}
        transition={{ 
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-indigo-500/5 rounded-full blur-[100px]"
      />
    </div>
  );
}
