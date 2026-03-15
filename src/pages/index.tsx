import React, { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import ExcerciseCard from '../components/workouts/ExcerciseCard';
import { Exercise } from '../types/workout';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, Target, Flame, 
  Trophy, ChevronDown, X, LogIn, Save, Play
} from 'lucide-react';

interface WorkoutTemplate {
  id: string;
  name: string;
  exercises: Exercise[];
}

export default function Home() {
  // --- AUTH ---
  const { user, signInWithGoogle } = useAuth();

  // --- STATE ---
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [sessionName, setSessionName] = useState('Custom Session');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [streak, setStreak] = useState(0);
  const [weeklyProgress, setWeeklyProgress] = useState(0);
  const [activeTimer, setActiveTimer] = useState<{id: number, seconds: number} | null>(null);

  // --- INITIAL LOAD ---
  useEffect(() => {
    const savedExercises = localStorage.getItem('hc-exercises');
    const savedHistory = localStorage.getItem('hc-history');
    const savedTemplates = localStorage.getItem('hc-templates');
    
    if (savedExercises) setExercises(JSON.parse(savedExercises));
    if (savedTemplates) setTemplates(JSON.parse(savedTemplates));
    if (savedHistory) calculateStats(JSON.parse(savedHistory));
  }, []);

  // --- PERSISTENCE ---
  useEffect(() => {
    localStorage.setItem('hc-exercises', JSON.stringify(exercises));
  }, [exercises]);

  // --- TIMER LOGIC ---
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeTimer && activeTimer.seconds > 0) {
      interval = setInterval(() => {
        setActiveTimer(prev => prev ? { ...prev, seconds: prev.seconds - 1 } : null);
      }, 1000);
    } else if (activeTimer?.seconds === 0) {
      setActiveTimer(null);
    }
    return () => clearInterval(interval);
  }, [activeTimer]);

  const calculateStats = (history: any[]) => {
    if (history.length === 0) return;
    const today = new Date().setHours(0, 0, 0, 0);
    const uniqueDates = Array.from(new Set(history.map(h => new Date(h.date).setHours(0, 0, 0, 0))))
      .sort((a: any, b: any) => b - a);
    
    let currentStreak = 0;
    for (let i = 0; i < uniqueDates.length; i++) {
      const diff = (today - (uniqueDates[i] as number)) / (1000 * 60 * 60 * 24);
      if (diff === i || diff === i + 1) currentStreak++;
      else break;
    }
    setStreak(currentStreak);
    const oneWeekAgo = new Date().getTime() - (7 * 24 * 60 * 60 * 1000);
    const lastWeekCount = uniqueDates.filter(date => (date as number) >= oneWeekAgo).length;
    setWeeklyProgress(Math.min((lastWeekCount / 4) * 100, 100));
  };

  const loadTemplate = (template: WorkoutTemplate) => {
    setExercises(template.exercises);
    setSessionName(template.name);
  };

  const saveAsNewTemplate = () => {
    if (exercises.length === 0) return;
    const name = prompt("Enter a name for this routine:", sessionName);
    if (!name) return;
    const newTemplate = { id: Date.now().toString(), name, exercises: [...exercises] };
    const existing = JSON.parse(localStorage.getItem('hc-templates') || '[]');
    const updated = [...existing, newTemplate];
    localStorage.setItem('hc-templates', JSON.stringify(updated));
    setTemplates(updated);
    alert("Routine saved to Library!");
  };

  const finishWorkout = () => {
    if (exercises.length === 0) return;
    const totalVolume = exercises.reduce((acc, curr) => acc + (curr.weight * curr.sets * curr.repetitions), 0);
    const completedWorkout = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      name: sessionName,
      exercises,
      totalVolume
    };
    const existingHistory = JSON.parse(localStorage.getItem('hc-history') || '[]');
    localStorage.setItem('hc-history', JSON.stringify([...existingHistory, completedWorkout]));
    setExercises([]);
    setSessionName('Custom Session');
    alert("Workout Saved!");
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          
          {/* AUTH & WELCOME HEADER */}
          <section className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-900/40 p-6 rounded-[2.5rem] border border-slate-800/50 shadow-2xl">
            <div>
              <p className="text-indigo-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-1">Performance Tracking</p>
              <h1 className="text-3xl md:text-4xl font-black italic uppercase text-white">
                Welcome, {user ? user.displayName?.split(' ')[0] : 'Athlete'}
              </h1>
              {user && <p className="text-slate-500 text-xs mt-1 font-medium">{user.email}</p>}
            </div>
            
            {!user && (
              <button 
                onClick={signInWithGoogle}
                className="bg-white text-black px-6 py-3 rounded-2xl font-bold flex items-center gap-3 hover:bg-indigo-500 hover:text-white transition-all group active:scale-95 shadow-xl"
              >
                <LogIn size={18} className="group-hover:translate-x-1 transition-transform" />
                Sign In with Google
              </button>
            )}
          </section>

          {/* STATS ROW */}
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8 md:mb-12">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-5 rounded-3xl flex items-center gap-4 shadow-xl">
              <Flame className="text-white" />
              <div>
                <p className="text-white/70 text-[10px] font-bold uppercase tracking-tight">Streak</p>
                <p className="text-xl font-black text-white italic">{streak} Days</p>
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl flex items-center gap-4">
              <Target className="text-indigo-400" />
              <div className="flex-1">
                <p className="text-slate-500 text-[10px] font-bold uppercase mb-1">Weekly Goal</p>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${weeklyProgress}%` }}></div>
                </div>
              </div>
            </div>
            <div className="hidden sm:flex bg-slate-900 border border-slate-800 p-5 rounded-3xl items-center gap-4">
              <Trophy className="text-emerald-400" />
              <div>
                <p className="text-slate-500 text-[10px] font-bold uppercase">Volume</p>
                <p className="text-lg font-black text-emerald-400">
                  {exercises.reduce((acc, curr) => acc + (curr.weight * curr.sets * curr.repetitions), 0).toLocaleString()} lb
                </p>
              </div>
            </div>
          </section>

          {/* SESSION CONTROLS */}
          <header className="flex flex-col gap-6 mb-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl md:text-3xl font-black uppercase italic text-white/90">{sessionName}</h2>
              <button onClick={finishWorkout} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all shadow-lg shadow-emerald-900/20">Finish</button>
            </div>
            
            <div className="flex overflow-x-auto gap-2 pb-2 no-scrollbar">
               <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 whitespace-nowrap transition-all shadow-lg shadow-indigo-900/20 active:scale-95">
                 <Plus size={18} /> Add Exercise
               </button>
               <button onClick={saveAsNewTemplate} className="whitespace-nowrap bg-slate-900 border border-slate-800 text-slate-400 px-6 py-3 rounded-xl text-xs font-bold italic hover:text-white transition-colors flex items-center gap-2">
                 <Save size={14} /> Save Routine
               </button>
               <div className="relative group">
                 <button className="whitespace-nowrap bg-slate-900 border border-slate-800 text-slate-400 px-6 py-3 rounded-xl text-xs font-bold flex items-center gap-2 hover:text-white">
                   <Play size={14} /> Load Routine <ChevronDown size={14} />
                 </button>
                 <div className="absolute left-0 mt-2 hidden group-hover:block bg-slate-900 border border-slate-800 p-2 rounded-xl w-48 z-50 shadow-2xl">
                    {templates.map(t => (
                      <button key={t.id} onClick={() => loadTemplate(t)} className="w-full text-left p-3 hover:bg-indigo-600 rounded-lg text-xs font-bold transition-colors">{t.name}</button>
                    ))}
                 </div>
               </div>
            </div>
          </header>

          {/* EXERCISE LIST */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-32 md:pb-8">
            {exercises.map((ex, i) => (
              <ExcerciseCard 
                key={i} 
                exercise={ex} 
                onStartTimer={(secs) => setActiveTimer({id: i, seconds: secs})} 
              />
            ))}
            {exercises.length === 0 && (
              <div className="col-span-full border-2 border-dashed border-slate-800 rounded-[2.5rem] p-16 flex flex-col items-center justify-center text-slate-600">
                <div className="bg-slate-900 p-4 rounded-full mb-4">
                  <Plus size={32} className="text-slate-700" />
                </div>
                <p className="font-bold italic uppercase tracking-widest text-sm text-slate-400">Empty Session</p>
                <p className="text-[10px] mt-1 uppercase font-bold text-slate-600 tracking-tighter">Tap "Add Exercise" to begin</p>
              </div>
            )}
          </div>
        </div>

        {/* MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-lg p-8 rounded-[2.5rem] relative shadow-2xl">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white"><X size={24} /></button>
              <h2 className="text-2xl font-black mb-8 uppercase italic text-white">Quick Add</h2>
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
              }} className="space-y-4">
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-2 tracking-widest">Movement Name</label>
                    <input name="name" placeholder="Bench Press" className="w-full bg-slate-800 p-4 rounded-2xl font-bold outline-none border border-slate-700 focus:border-indigo-500 transition-all text-white placeholder:text-slate-600" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-2 tracking-widest">Target Muscle</label>
                    <input name="muscle" placeholder="Chest" className="w-full bg-slate-800 p-4 rounded-2xl font-bold border border-slate-700 focus:border-indigo-500 outline-none text-white placeholder:text-slate-600" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-2 tracking-widest">Weight (lb)</label>
                    <input name="weight" type="number" placeholder="135" className="w-full bg-slate-800 p-4 rounded-2xl font-bold border border-slate-700 focus:border-indigo-500 outline-none text-emerald-400 placeholder:text-slate-600" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-2 tracking-widest">Sets</label>
                    <input name="sets" type="number" placeholder="3" className="w-full bg-slate-800 p-4 rounded-2xl font-bold border border-slate-700 focus:border-indigo-500 outline-none text-white placeholder:text-slate-600" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-2 tracking-widest">Reps</label>
                    <input name="reps" type="number" placeholder="10" className="w-full bg-slate-800 p-4 rounded-2xl font-bold border border-slate-700 focus:border-indigo-500 outline-none text-white placeholder:text-slate-600" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-2 tracking-widest">Rest</label>
                    <input name="rest" type="number" placeholder="60s" className="w-full bg-slate-800 p-4 rounded-2xl font-bold border border-slate-700 focus:border-indigo-500 outline-none text-indigo-400 placeholder:text-slate-600" />
                  </div>
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white font-black py-5 rounded-2xl uppercase tracking-widest shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 transition-all mt-4">
                  Add to Session
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}