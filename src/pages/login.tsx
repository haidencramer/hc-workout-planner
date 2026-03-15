import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { LogIn, Dumbbell, ShieldCheck, Zap } from 'lucide-react';

export default function Login() {
  const { user, signInWithGoogle, loading } = useAuth();
  const router = useRouter();

  // Redirect to dashboard if user is already authenticated
  useEffect(() => {
    if (user && !loading) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full" />

      <div className="z-10 w-full max-w-md text-center">
        <div className="inline-flex p-5 rounded-[2.5rem] bg-slate-900 border border-slate-800 mb-8 shadow-2xl ring-1 ring-slate-700/50">
          <Dumbbell size={42} className="text-indigo-500" />
        </div>

        <h1 className="text-6xl font-black italic text-white uppercase tracking-tighter mb-2">
          HC<span className="text-indigo-500">.</span>PLANNER
        </h1>
        <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[10px] mb-12">
          Elite Performance System
        </p>

        <div className="space-y-4 mb-12">
           <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-2xl border border-slate-800/50">
              <Zap size={20} className="text-yellow-500" />
              <p className="text-xs text-slate-300 font-medium text-left">Real-time volume and intensity tracking.</p>
           </div>
           <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-2xl border border-slate-800/50">
              <ShieldCheck size={20} className="text-emerald-500" />
              <p className="text-xs text-slate-300 font-medium text-left">Secure cloud-sync via Google Authentication.</p>
           </div>
        </div>

        <button 
          onClick={signInWithGoogle}
          className="w-full bg-white text-black hover:bg-indigo-600 hover:text-white px-8 py-6 rounded-[2rem] font-black uppercase tracking-[0.15em] flex items-center justify-center gap-4 transition-all duration-500 shadow-2xl active:scale-95 group"
        >
          <LogIn size={22} className="group-hover:translate-x-1 transition-transform" />
          Enter The Lab
        </button>

        <p className="mt-10 text-[9px] text-slate-600 font-black uppercase tracking-[0.5em] opacity-50">
          Version 2.0 // Authorized Access Only
        </p>
      </div>
    </div>
  );
}