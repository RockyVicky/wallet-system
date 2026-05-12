"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { LayoutDashboard, PlusCircle, Send, History, LogOut, ArrowLeft, Edit3, X, Menu, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function V2Layout({ children }: { children: React.ReactNode }) {
  const { user, logout, updateUser, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  // Profile Edit
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({ name: '', phone: '' });
  const [message, setMessage] = useState('');
  
  // Sidebar State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile
  const [isDesktopExpanded, setIsDesktopExpanded] = useState(true); // Desktop
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (!loading && !user) {
      router.push('/login');
    }
    if (user) {
      setProfileData({ name: user.name, phone: user.phone || '' });
    }
  }, [user, loading, router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/user/profile', profileData);
      updateUser(profileData);
      setIsEditingProfile(false);
      setMessage('Profile updated successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setMessage('Update failed. Please try again.');
    }
  };

  if (!isMounted || loading || !user) return <div className="min-h-screen flex items-center justify-center text-slate-500 font-medium tracking-wide">Loading workspace...</div>;

  const navLinks = [
    { name: 'Overview', href: '/v2/dashboard', icon: LayoutDashboard },
    { name: 'Deposit', href: '/v2/add-money', icon: PlusCircle },
    { name: 'Transfer', href: '/v2/transfer', icon: Send },
    { name: 'Ledger', href: '/v2/history', icon: History },
  ];

  return (
    <div className="h-[100dvh] bg-slate-50 flex flex-col md:flex-row overflow-hidden font-sans relative">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-white/80 backdrop-blur-md border-b border-slate-200 p-4 flex justify-between items-center z-50">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center mr-3 shadow-sm">
            <div className="w-3 h-3 bg-white rounded-sm rotate-45" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900 tracking-tight">Vault</h2>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-600 hover:text-slate-900 transition-colors">
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Profile Edit Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl border border-slate-100 relative">
            <button onClick={() => setIsEditingProfile(false)} className="absolute right-6 top-6 text-slate-400 hover:text-slate-900 transition-colors">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold text-slate-900 mb-6 tracking-tight">Edit Identity</h2>
            {message && <div className="mb-6 p-3 rounded-lg font-medium text-sm text-center bg-indigo-50 text-indigo-700 border border-indigo-100">{message}</div>}
            <form onSubmit={handleUpdateProfile} className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-slate-600 uppercase tracking-wider mb-2">Legal Name</label>
                <input
                  type="text"
                  required
                  placeholder="Enter full name"
                  className="w-full px-4 py-3 border border-slate-200 bg-slate-50/50 rounded-xl text-slate-900 font-medium focus:border-indigo-500 outline-none transition-all"
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
                  className="w-full px-4 py-3 border border-slate-200 bg-slate-50/50 rounded-xl text-slate-900 font-medium focus:border-indigo-500 outline-none transition-all"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                />
              </div>
              <button type="submit" className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-medium text-sm shadow-sm hover:bg-slate-800 transition-all hover:shadow mt-2">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed md:static inset-y-0 left-0 z-40 bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'}
          ${isDesktopExpanded ? 'md:w-64 lg:w-72' : 'md:w-20'}
        `}
      >
        {/* Toggle Button (Desktop Only) */}
        <button 
          onClick={() => setIsDesktopExpanded(!isDesktopExpanded)}
          className="hidden md:flex absolute -right-3 top-8 bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 rounded-full p-1 shadow-sm transition-colors z-50"
        >
          {isDesktopExpanded ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        <div className={`p-6 ${isDesktopExpanded ? 'lg:p-8' : 'px-4 flex flex-col items-center'}`}>
          <div className={`hidden md:flex items-center mb-8 ${!isDesktopExpanded && 'justify-center'}`}>
            <div className={`w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-sm shrink-0 ${isDesktopExpanded && 'mr-3'}`}>
              <div className="w-4 h-4 bg-white rounded-sm rotate-45" />
            </div>
            {isDesktopExpanded && <h2 className="text-xl font-semibold text-slate-900 tracking-tight animate-in fade-in duration-300">Vault V2</h2>}
          </div>
          
          {/* Mobile Only Header */}
          <div className="md:hidden flex items-center mb-8">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-sm mr-3 shrink-0">
              <div className="w-4 h-4 bg-white rounded-sm rotate-45" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 tracking-tight">Vault V2</h2>
          </div>
          
          <nav className="space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsSidebarOpen(false)}
                  title={!isDesktopExpanded ? link.name : undefined}
                  className={`flex items-center rounded-xl transition-all group ${
                    isDesktopExpanded ? 'px-4 py-3' : 'p-3 justify-center'
                  } ${
                    isActive 
                    ? 'bg-slate-900 text-white font-medium shadow-md' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isDesktopExpanded && 'mr-3'} ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
                  {isDesktopExpanded && <span className="text-sm font-medium animate-in fade-in duration-300 whitespace-nowrap">{link.name}</span>}
                  
                  {/* Mobile always shows text */}
                  <span className="md:hidden text-sm font-medium ml-3">{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className={`mt-auto pb-6 ${isDesktopExpanded ? 'px-6 lg:px-8' : 'px-4'} space-y-4`}>
          {/* Active Account Widget */}
          <div 
            className={`bg-slate-50 border border-slate-200 cursor-pointer hover:bg-indigo-50/50 hover:border-indigo-100 transition-all group relative ${
              isDesktopExpanded ? 'p-4 rounded-xl' : 'p-2 rounded-xl flex justify-center hidden md:flex'
            }`}
            onClick={() => setIsEditingProfile(true)}
            title={!isDesktopExpanded ? 'Edit Profile' : undefined}
          >
            {isDesktopExpanded ? (
              <div className="animate-in fade-in duration-300 overflow-hidden">
                <div className="flex items-center justify-between mb-1.5">
                   <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active Account</p>
                   <Edit3 className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                </div>
                <p className="text-sm font-semibold text-slate-900 truncate leading-tight">{user.name}</p>
                <p className="text-xs text-slate-500 truncate mt-0.5">{user.phone || 'Phone unlinked'}</p>
              </div>
            ) : (
              <div className="w-10 h-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center group-hover:border-indigo-200 group-hover:bg-indigo-50 transition-all">
                <User className="w-5 h-5 text-slate-500 group-hover:text-indigo-600" />
              </div>
            )}

            {/* Mobile rendering for profile block */}
            <div className="md:hidden w-full">
              <div className="flex items-center justify-between mb-1.5">
                 <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active Account</p>
                 <Edit3 className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <p className="text-sm font-semibold text-slate-900 truncate leading-tight">{user.name}</p>
              <p className="text-xs text-slate-500 truncate mt-0.5">{user.phone || 'Phone unlinked'}</p>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => router.push('/dashboard')}
              title={!isDesktopExpanded ? 'Switch to V1' : undefined}
              className={`flex items-center w-full text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors ${
                isDesktopExpanded ? 'px-4 py-2.5' : 'p-3 justify-center'
              }`}
            >
              <ArrowLeft className={`w-4 h-4 shrink-0 text-slate-400 ${isDesktopExpanded && 'mr-3'}`} /> 
              {isDesktopExpanded && <span className="animate-in fade-in whitespace-nowrap">Switch to V1</span>}
              <span className="md:hidden ml-3">Switch to V1</span>
            </button>
            <button
              onClick={() => { logout(); router.push('/login'); }}
              title={!isDesktopExpanded ? 'Sign Out' : undefined}
              className={`flex items-center w-full text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors group ${
                isDesktopExpanded ? 'px-4 py-2.5' : 'p-3 justify-center'
              }`}
            >
              <LogOut className={`w-4 h-4 shrink-0 text-rose-500 group-hover:scale-110 transition-transform ${isDesktopExpanded && 'mr-3'}`} /> 
              {isDesktopExpanded && <span className="animate-in fade-in whitespace-nowrap">Sign Out</span>}
              <span className="md:hidden ml-3">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-slate-50 p-6 lg:p-10 relative">
        <div className="max-w-[1600px] mx-auto h-full">
          {children}
        </div>
      </main>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
