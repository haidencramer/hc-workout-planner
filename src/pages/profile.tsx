import React from 'react';
import Sidebar from '../components/layout/Sidebar';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Settings, Shield, Mail } from 'lucide-react';

export default function Profile() {
  const { user, logout } = useAuth();

  // If there's no user, we don't render the profile content
  if (!user) return null;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          
          <div className="mb-10">
            <p className="text-indigo-400 font-bold text-[10px] uppercase tracking-[0.3em] mb-1">Athlete Settings</p>
            <h1 className="text-4xl font-black italic uppercase text-white tracking-tighter">Your Profile</h1>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
            {/* Background Decorative Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 blur-[50px] rounded-full" />
            
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full mb-6 flex items-center justify-center border-4 border-slate-800 shadow-xl">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User size={40} className="text-white" />
                )}
              </div>

              <h2 className="text-3xl font-black italic uppercase text-white mb-2">
                {user.displayName || 'Elite Athlete'}
              </h2>
              
              <div className="flex items-center gap-2 text-slate-500 mb-10">
                <Mail size={14} />
                <span className="text-xs font-bold tracking-wider">{user.email}</span>
              </div>

              <div className="w-full grid grid-cols-1 gap-3 mb-10">
                <div className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl border border-slate-800/50">
                  <div className="flex items-center gap-3">
                    <Shield size={18} className="text-indigo-400" />
                    <span className="text-sm font-bold text-slate-300">Account Status</span>
                  </div>
                  <span className="text-[10px] font-black uppercase text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full">Verified</span>
                </div>
              </div>

              {/* THE LOGOUT BUTTON */}
              <button 
                onClick={() => logout()}
                className="w-full bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all duration-300 flex items-center justify-center gap-3 active:scale-95"
              >
                <LogOut size={18} />
                Terminate Session
              </button>
            </div>
          </div>

          <p className="text-center mt-8 text-[9px] text-slate-700 font-black uppercase tracking-[0.4em]">
            Data synced with Firebase Cloud Auth
          </p>
        </div>
      </main>
    </div>
  );
}