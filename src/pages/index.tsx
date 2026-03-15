import React, { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import ExcerciseCard from '../components/workouts/ExcerciseCard';
import { Exercise } from '../types/workout';
import { 
  Plus, Target, Flame, 
  Trophy, Play, ChevronDown, Save, X
} from 'lucide-react';

interface WorkoutTemplate {
  id: string;
  name: string;
  exercises: Exercise[];
}

export default function Home() {
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
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          
          {/* STATS SECTION */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-3xl flex items-center gap-4 shadow-xl">
              <Flame className="text-white" />
              <div>
                <p className="text-white/70 text-xs font-bold uppercase tracking-tight">Streak</p>
                <p className="text-2xl font-black text-white italic">{streak} Days</p>
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex items-center gap-4">
              <Target className="text-indigo-400" />
              <div className="flex-1">
                <p className="text-slate-500 text-xs font-bold uppercase mb-1">Weekly Goal</p>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${weeklyProgress}%` }}></div>
                </div>
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex items-center gap-4">
              <Trophy className="text-emerald-400" />
              <div>
                <p className="text-slate-500 text-xs font-bold uppercase">Volume</p>
                <p className="text-xl font-black text-emerald-400">
                  {exercises.reduce((acc, curr) => acc + (curr.weight * curr.sets * curr.repetitions), 0).toLocaleString()} lb
                </p>
              </div>
            </div>
          </section>

          {/* DASHBOARD HEADER */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <h2 className="text-3xl font-black uppercase italic text-white">{sessionName}</h2>
            <div className="flex flex-wrap gap-3">
               <button onClick={saveAsNewTemplate} className="bg-slate-900 border border-indigo-500/50 text-indigo-400 px-5 py-3 rounded-2xl font-bold flex items-center gap-2"><Save size={18} /> Save Template</button>
               
               <div className="relative group">
                 <button className="bg-slate-800 text-white px-5 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all">
                   <Play size={18} className="text-indigo-400" /> Load <ChevronDown size={16} />
                 </button>
                 <div className="absolute right-0 mt-2 hidden group-hover:block bg-slate-900 border border-slate-800 p-2 rounded-2xl w-56 z-50 shadow-2xl">
                    {templates.map(t => (
                      <button key={t.id} onClick={() => loadTemplate(t)} className="w-full text-left p-3 hover:bg-indigo-600 rounded-xl text-sm font-bold transition-colors">{t.name}</button>
                    ))}
                 </div>
               </div>

               <button onClick={() => setIsModalOpen(true)} className="bg-slate-800 text-white px-5 py-3 rounded-2xl font-bold flex items-center gap-2"><Plus size={20} /></button>
               <button onClick={finishWorkout} className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg transition-all">Finish</button>
            </div>
          </header>

          {/* EXERCISE CARDS LIST */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
            {exercises.map((ex, i) => (
              <ExcerciseCard 
                key={i} 
                exercise={ex} 
                onStartTimer={(secs) => setActiveTimer({id: i, seconds: secs})} 
              />
            ))}
          </div>
        </div>

        {/* QUICK ADD MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-lg p-8 rounded-[2.5rem] relative">
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
                <input name="name" placeholder="Exercise Name" className="w-full bg-slate-800 p-4 rounded-2xl font-bold outline-none border border-slate-700 focus:border-indigo-500" required />
                <div className="grid grid-cols-2 gap-4">
                  <input name="muscle" placeholder="Target Muscle" className="bg-slate-800 p-4 rounded-2xl font-bold outline-none border border-slate-700" />
                  <input name="weight" type="number" placeholder="Weight (lb)" className="bg-slate-800 p-4 rounded-2xl font-bold text-emerald-400 outline-none border border-slate-700" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <input name="sets" type="number" placeholder="Sets" className="bg-slate-800 p-4 rounded-2xl font-bold outline-none border border-slate-700" />
                  <input name="reps" type="number" placeholder="Reps" className="bg-slate-800 p-4 rounded-2xl font-bold outline-none border border-slate-700" />
                  <input name="rest" type="number" placeholder="Rest (s)" className="bg-slate-800 p-4 rounded-2xl font-bold text-indigo-400 outline-none border border-slate-700" />
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white font-black py-5 rounded-2xl uppercase tracking-widest shadow-lg shadow-indigo-500/20 transition-all">Add Exercise</button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}