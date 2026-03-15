import React, { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import { Exercise } from '../types/workout';
import { Trophy, Target, TrendingUp, Star, Award, Zap } from 'lucide-react';

export default function Goals() {
  const [prs, setPrs] = useState<Exercise[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('hc-exercises');
    if (saved) {
      const allExercises: Exercise[] = JSON.parse(saved);
      
      // Logic to find unique exercises and their highest weight (PR)
      const prMap = allExercises.reduce((acc: { [key: string]: Exercise }, current) => {
        if (!acc[current.name] || current.weight > acc[current.name].weight) {
          acc[current.name] = current;
        }
        return acc;
      }, {});

      setPrs(Object.values(prMap));
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          
          {/* PAGE HEADER */}
          <header className="mb-12">
            <div className="flex items-center gap-4 mb-2">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Trophy size={24} className="text-white" />
              </div>
              <h1 className="text-sm font-bold text-indigo-500 uppercase tracking-[0.2em]">Achievement Center</h1>
            </div>
            <h2 className="text-5xl font-black tracking-tighter italic uppercase">Goals & <span className="text-indigo-500">PRs</span></h2>
          </header>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            {/* LEFT COLUMN: PR HALL OF FAME */}
            <section className="xl:col-span-2 space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Star className="text-yellow-500" fill="currentColor" size={20} /> 
                  Personal Records
                </h3>
                <span className="text-xs text-slate-500 font-mono">{prs.length} Records Found</span>
              </div>

              {prs.length === 0 ? (
                <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-20 text-center">
                  <Zap size={40} className="mx-auto mb-4 text-slate-800" />
                  <p className="text-slate-500 font-medium">No records found. Log a workout to see your PRs!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {prs.map((pr, i) => (
                    <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-[2rem] hover:border-indigo-500/50 transition-all group relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-20 transition-opacity">
                        <Award size={80} />
                      </div>
                      <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">{pr.primary_muscle}</p>
                      <h4 className="text-xl font-bold mb-4">{pr.name}</h4>
                      <div className="flex items-end gap-2">
                        <span className="text-4xl font-black tracking-tighter">{pr.weight}</span>
                        <span className="text-slate-500 font-bold mb-1 underline decoration-indigo-500/50">LBS</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* RIGHT COLUMN: ACTIVE GOALS & PROGRESS */}
            <section className="space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
                <Target className="text-emerald-500" size={20} /> 
                Active Missions
              </h3>

              <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 space-y-10">
                {/* GOAL 1 */}
                <div>
                  <div className="flex justify-between items-end mb-4">
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Weight Goal</p>
                      <p className="text-lg font-bold text-white">Target: 185 lbs</p>
                    </div>
                    <p className="text-indigo-400 font-black text-sm">72%</p>
                  </div>
                  <div className="h-3 bg-slate-950 rounded-full border border-slate-800 overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.4)]" style={{ width: '72%' }}></div>
                  </div>
                </div>

                {/* GOAL 2 */}
                <div>
                  <div className="flex justify-between items-end mb-4">
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Consistency</p>
                      <p className="text-lg font-bold text-white">4 Workouts / Week</p>
                    </div>
                    <p className="text-emerald-400 font-black text-sm">3/4</p>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3].map(i => <div key={i} className="h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]"></div>)}
                    <div className="h-2 bg-slate-800 rounded-full"></div>
                  </div>
                </div>

                {/* GOAL 3 */}
                <div className="pt-6 border-t border-slate-800">
                  <div className="bg-indigo-600/10 border border-indigo-500/20 p-6 rounded-3xl text-center">
                    <TrendingUp className="mx-auto mb-2 text-indigo-400" />
                    <p className="text-sm font-bold text-indigo-200 uppercase tracking-tighter">Growth Mindset</p>
                    <p className="text-xs text-slate-500 mt-1 italic">"The only bad workout is the one that didn't happen."</p>
                  </div>
                </div>
              </div>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
}