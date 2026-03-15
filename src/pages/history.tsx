import React, { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import { Exercise } from '../types/workout';
import { Calendar as CalendarIcon, History as HistoryIcon, Hash, Activity, ChevronRight } from 'lucide-react';

interface CompletedWorkout {
  id: string;
  date: string;
  name: string;
  exercises: Exercise[];
  totalVolume: number;
}

export default function History() {
  const [history, setHistory] = useState<CompletedWorkout[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('hc-history');
    if (saved) {
      setHistory(JSON.parse(saved).reverse()); // Newest first
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          
          <header className="mb-12">
            <h1 className="text-sm font-bold text-indigo-500 uppercase tracking-[0.2em] mb-2">Training Logs</h1>
            <h2 className="text-5xl font-black tracking-tighter italic uppercase">Workout <span className="text-indigo-500">History</span></h2>
          </header>

          <div className="space-y-4">
            {history.length === 0 ? (
              <div className="py-20 border-2 border-dashed border-slate-800 rounded-[3rem] text-center opacity-40">
                <HistoryIcon size={48} className="mx-auto mb-4 text-slate-600" />
                <p className="text-xl font-bold">No sessions logged yet.</p>
                <p className="text-sm">Finish a workout on your dashboard to see it here.</p>
              </div>
            ) : (
              history.map((session) => (
                <div key={session.id} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl hover:border-slate-700 transition-all flex items-center justify-between group">
                  <div className="flex items-center gap-6">
                    <div className="bg-slate-800 p-4 rounded-2xl text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <CalendarIcon size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black uppercase tracking-tight">{session.name || "Custom Session"}</h3>
                      <div className="flex gap-4 mt-1 text-slate-500 text-xs font-bold uppercase tracking-widest">
                        <span>{new Date(session.date).toLocaleDateString()}</span>
                        <span className="text-indigo-500">•</span>
                        <span>{session.exercises.length} Exercises</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-12">
                    <div className="text-right hidden md:block">
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Total Volume</p>
                      <p className="text-xl font-mono font-black text-emerald-400">{session.totalVolume.toLocaleString()} lb</p>
                    </div>
                    <ChevronRight className="text-slate-700 group-hover:text-white transition-colors" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}