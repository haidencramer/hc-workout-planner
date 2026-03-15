import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '../components/layout/Sidebar';
import ExcerciseCard from '../components/workouts/ExcerciseCard';
import { Exercise } from '../types/workout';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, Target, Flame, 
  Trophy, ChevronDown, X, Save, Play, Activity, Dumbbell
} from 'lucide-react';

interface WorkoutTemplate {
  id: string;
  name: string;
  exercises: Exercise[];
}

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // --- PROTECTED ROUTE LOGIC ---
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // --- DASHBOARD STATE ---
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [sessionName, setSessionName] = useState('Custom Session');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [streak, setStreak] = useState(0);
  const [weeklyProgress, setWeeklyProgress] = useState(0);

  // --- INITIAL DATA LOAD ---
  useEffect(() => {
    const savedExercises = localStorage.getItem('hc-exercises');
    const savedHistory = localStorage.getItem('hc-history');
    const savedTemplates = localStorage.getItem('hc-templates');
    
    if (savedExercises) setExercises(JSON.parse(savedExercises));
    if (savedTemplates) setTemplates(JSON.parse(savedTemplates));
    if (savedHistory) calculateStats(JSON.parse(savedHistory));
  }, []);

  const calculateStats = (history: any[]) => {
    if (history.length === 0) return;
    const today = new Date().setHours(0, 0, 0, 0);
    const uniqueDates = Array.from(new Set(history.map(h => new Date(h.date).setHours(0, 0, 0, 0)))).sort((a: any, b: any) => b - a);
    let currentStreak = 0;
    for (let i = 0; i < uniqueDates.length; i++) {
      const diff = (today - (uniqueDates[i] as number)) / (1000 * 60 * 60 * 24);
      if (diff === i || diff === i + 1) currentStreak++; else break;
    }
    setStreak(currentStreak);
    const oneWeekAgo = new Date().getTime() - (7 * 24 * 60 * 60 * 1000);
    const lastWeekCount = uniqueDates.filter(d => (d as number) >= oneWeekAgo).length;
    setWeeklyProgress(Math.min((lastWeekCount / 4) * 100, 100));
  };

  const finishWorkout = () => {
    if (exercises.length === 0) return;
    const completedWorkout = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      name: sessionName,
      exercises,
      totalVolume: exercises.reduce((acc, curr) => acc + (curr.weight * curr.sets * curr.repetitions), 0)
    };
    const existing = JSON.parse(localStorage.getItem('hc-history') || '[]');
    localStorage.setItem('hc-history', JSON.stringify([...existing, completedWorkout]));
    setExercises([]);
    setSessionName('Custom Session');
    alert("Workout Saved!");
  };

  // --- LOADING / AUTH CHECK VIEW ---
  if (loading || !user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px]">
            Securing Session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          
          {/* Dashboard Header */}
          <div className="mb-10">
            <p className="text-indigo-400 font-bold text-[10px] uppercase tracking-[0.3em] mb-1">Athlete Dashboard</p>
            <h1 className="text-4xl font-black italic uppercase text-white tracking-tighter">
              Welcome back, {user.displayName?.split(' ')[0]}
            </h1>
          </div>

          {/* Stats Summary */}
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-12">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-[2rem] flex items-center gap-4 shadow-xl shadow-indigo-500/10">
              <Flame className="text-white" size={28} />
              <div>
                <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest">Current Streak</p>
                <p className="text-2xl font-black text-white italic">{streak} Days</p>
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-[2rem] flex items-center gap-4">
              <Target className="text-indigo-400" size={28} />
              <div className="flex-1">
                <p className="text-slate-500 text-[10px] font-bold uppercase mb-2">Weekly Goal</p>
                <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${weeklyProgress}%` }}></div>
                </div>
              </div>
            </div>
            <div className="hidden sm:flex bg-slate-900 border border-slate-800 p-6 rounded-[2rem] items-center gap-4">
              <Activity className="text-emerald-400" size={28} />
              <div>
                <p className="text-slate-500 text-[10px] font-bold uppercase">Active Session Volume</p>
                <p className="text-xl font-black text-emerald-400">
                  {exercises.reduce((acc, curr) => acc + (curr.weight * curr.sets * curr.repetitions), 0).toLocaleString()} lb
                </p>
              </div>
            </div>
          </section>

          {/* Active Session Header */}
          <header className="flex flex-col gap-6 mb-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl md:text-3xl font-black uppercase italic text-white/90">{sessionName}</h2>
              <button onClick={finishWorkout} className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-lg shadow-emerald-900/20 active:scale-95">
                Finish Session
              </button>
            </div>
            
            <div className="flex overflow-x-auto gap-3 pb-2 no-scrollbar">
               <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-4 rounded-2xl font-bold flex items-center gap-2 whitespace-nowrap transition-all shadow-lg shadow-indigo-900/20 active:scale-95">
                 <Plus size={18} /> Add Movement
               </button>
               <button className="whitespace-nowrap bg-slate-900 border border-slate-800 text-slate-400 px-6 py-4 rounded-2xl text-xs font-bold italic hover:text-white transition-colors flex items-center gap-2">
                 <Save size={14} /> Save Routine
               </button>
            </div>
          </header>

          {/* Exercise Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-32 md:pb-8">
            {exercises.map((ex, i) => (
              <ExcerciseCard key={i} exercise={ex} onStartTimer={() => {}} />
            ))}
            {exercises.length === 0 && (
              <div className="col-span-full border-2 border-dashed border-slate-800 rounded-[3rem] py-24 flex flex-col items-center justify-center text-slate-600">
                <Dumbbell size={40} className="mb-4 opacity-20" />
                <p className="font-bold italic uppercase tracking-[0.2em] text-sm text-slate-400">No Movements Added</p>
                <p className="text-[10px] mt-1 uppercase font-bold text-slate-700 tracking-tighter">Start your session by adding an exercise</p>
              </div>
            )}
          </div>
        </div>

        {/* Add Exercise Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-lg p-8 rounded-[3rem] relative shadow-2xl ring-1 ring-white/5">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors"><X size={24} /></button>
              <h2 className="text-3xl font-black mb-8 uppercase italic text-white tracking-tighter">Add Movement</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                const d = new FormData(e.currentTarget);
                const ex: Exercise = {
                  name: d.get('name') as string,
                  primary_muscle: d.get('muscle') as string,
                  secondary_muscle: [],
                  movement_type: 'Compound',
                  sets: Number(d.get('sets')),
                  repetitions: Number(d.get('reps')),
                  weight: Number(d.get('weight')),
                  rest_time: Number(d.get('rest')),
                  video_url: ''
                };
                setExercises([...exercises, ex]);
                setIsModalOpen(false);
              }} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">Exercise Name</label>
                    <input name="name" placeholder="Incline Bench Press" className="w-full bg-slate-950 p-5 rounded-2xl font-bold outline-none border border-slate-800 focus:border-indigo-500 transition-all text-white" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">Muscle Group</label>
                    <input name="muscle" placeholder="Chest" className="w-full bg-slate-950 p-5 rounded-2xl font-bold border border-slate-800 focus:border-indigo-500 outline-none text-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">Weight (lb)</label>
                    <input name="weight" type="number" placeholder="225" className="w-full bg-slate-950 p-5 rounded-2xl font-bold border border-slate-800 focus:border-emerald-500 outline-none text-emerald-400" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">Sets</label>
                    <input name="sets" type="number" placeholder="4" className="w-full bg-slate-950 p-5 rounded-2xl font-bold border border-slate-800 outline-none text-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">Reps</label>
                    <input name="reps" type="number" placeholder="8" className="w-full bg-slate-950 p-5 rounded-2xl font-bold border border-slate-800 outline-none text-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">Rest (s)</label>
                    <input name="rest" type="number" placeholder="90" className="w-full bg-slate-950 p-5 rounded-2xl font-bold border border-slate-800 outline-none text-indigo-400" />
                  </div>
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white font-black py-6 rounded-2xl uppercase tracking-widest shadow-xl shadow-indigo-900/40 hover:bg-indigo-500 transition-all mt-4 active:scale-95">
                  Confirm Movement
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}