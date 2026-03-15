import React, { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import { Exercise } from '../types/workout';
import { 
  Timer, Plus, X, Target, Flame, 
  Dumbbell, Trophy, Play, ChevronDown, Save 
} from 'lucide-react';

interface WorkoutTemplate {
  id: string;
  name: string;
  exercises: Exercise[];
}

export default function Home() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [sessionName, setSessionName] = useState('Custom Session');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [streak, setStreak] = useState(0);
  const [weeklyProgress, setWeeklyProgress] = useState(0);
  const [activeTimer, setActiveTimer] = useState<{id: number, seconds: number} | null>(null);

  useEffect(() => {
    const savedExercises = localStorage.getItem('hc-exercises');
    const savedHistory = localStorage.getItem('hc-history');
    const savedTemplates = localStorage.getItem('hc-templates');
    if (savedExercises) setExercises(JSON.parse(savedExercises));
    if (savedTemplates) setTemplates(JSON.parse(savedTemplates));
    if (savedHistory) calculateStats(JSON.parse(savedHistory));
  }, []);

  useEffect(() => {
    localStorage.setItem('hc-exercises', JSON.stringify(exercises));
  }, [exercises]);

  useEffect(() => {
    let interval: any;
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
    const uniqueDates = Array.from(new Set(history.map(h => new Date(h.date).setHours(0, 0, 0, 0)))).sort((a: any, b: any) => b - a);
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
    const completedWorkout = { id: Date.now().toString(), date: new Date().toISOString(), name: sessionName, exercises, totalVolume };
    const existingHistory = JSON.parse(localStorage.getItem('hc-history') || '[]');
    const newHistory = [...existingHistory, completedWorkout];
    localStorage.setItem('hc-history', JSON.stringify(newHistory));
    setExercises([]);
    setSessionName('Custom Session');
    calculateStats(newHistory);
    alert("Workout Saved!");
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {/* STATS */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-3xl flex items-center gap-4">
              <Flame /> <div><p className="text-white/70 text-xs font-bold uppercase">Streak</p><p className="text-2xl font-black italic">{streak} Days</p></div>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex items-center gap-4">
              <Target className="text-indigo-400" /> <div className="flex-1"><p className="text-slate-500 text-xs font-bold uppercase">Goal</p><div className="h-2 bg-slate-800 rounded-full mt-2"><div className="h-full bg-indigo-500 rounded-full" style={{width: `${weeklyProgress}%`}}></div></div></div>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex items-center gap-4">
              <Trophy className="text-emerald-400" /> <div><p className="text-slate-500 text-xs font-bold uppercase">Volume</p><p className="text-2xl font-black text-emerald-400">{exercises.reduce((acc, curr) => acc + (curr.weight * curr.sets * curr.repetitions), 0).toLocaleString()} lb</p></div>
            </div>
          </section>

          {/* HEADER */}
          <header className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-black uppercase italic">{sessionName}</h2>
            <div className="flex gap-3">
              <button onClick={saveAsNewTemplate} className="bg-slate-900 border border-indigo-500/50 text-indigo-400 px-5 py-3 rounded-2xl font-bold flex items-center gap-2"><Save size={18}/> Save Template</button>
              <div className="relative group">
                <button className="bg-slate-800 px-5 py-3 rounded-2xl font-bold flex items-center gap-2">Load <ChevronDown size={16}/></button>
                <div className="absolute right-0 mt-2 hidden group-hover:block bg-slate-900 border border-slate-800 p-2 rounded-2xl w-56 z-50">
                  {templates.map(t => <button key={t.id} onClick={() => loadTemplate(t)} className="w-full text-left p-3 hover:bg-indigo-600 rounded-xl text-sm font-bold">{t.name}</button>)}
                </div>
              </div>
              <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 px-6 py-3 rounded-2xl font-bold flex items-center gap-2"><Plus/></button>
              <button onClick={finishWorkout} className="bg-emerald-600 px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs">Finish</button>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
            {exercises.map((ex, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-[2.5rem] relative group">
                <div className="flex justify-between mb-6">
                  <div><h3 className="text-xl font-bold uppercase">{ex.name}</h3><span className="text-[10px] font-black bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded-lg uppercase">{ex.primary_muscle}</span></div>
                  <button onClick={() => setExercises(exercises.filter((_, idx) => idx !== i))} className="text-slate-700 hover:text-red-500"><X size={20}/></button>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  <div className="bg-slate-950 p-4 rounded-2xl text-center border border-slate-800">
                    <p className="text-[10px] text-slate-600 font-bold uppercase mb-1">Lb</p>
                    <input type="number" value={ex.weight} onChange={(e) => {
                      const n = [...exercises]; n[i].weight = parseInt(e.target.value) || 0; setExercises(n);
                    }} className="bg-transparent w-full text-center text-xl font-black text-emerald-400 outline-none" />
                  </div>
                  <div className="bg-slate-950 p-4 rounded-2xl text-center border border-slate-800"><p className="text-[10px] text-slate-600 font-bold uppercase mb-1">Sets</p><p className="text-xl font-black">{ex.sets}</p></div>
                  <div className="bg-slate-950 p-4 rounded-2xl text-center border border-slate-800"><p className="text-[10px] text-slate-600 font-bold uppercase mb-1">Reps</p><p className="text-xl font-black">{ex.repetitions}</p></div>
                  <button onClick={() => setActiveTimer({id: i, seconds: ex.rest_time})} className={`p-4 rounded-2xl border ${activeTimer?.id === i ? 'bg-indigo-600 border-indigo-400 animate-pulse' : 'bg-slate-950/50 border-slate-800'}`}>
                    <p className="text-[10px] font-bold uppercase mb-1">{activeTimer?.id === i ? 'Resting' : 'Rest'}</p>
                    <p className={`text-xl font-black ${activeTimer?.id === i ? 'text-white' : 'text-indigo-400'}`}>{activeTimer?.id === i ? activeTimer.seconds : ex.rest_time}s</p>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MODAL (UNIFIED LOGIC) */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-lg p-8 rounded-[2.5rem]">
              <h2 className="text-2xl font-black mb-8 uppercase italic">Add Exercise</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                const d = new FormData(e.currentTarget);
                const ex: Exercise = {
                  name: d.get('name') as string, primary_muscle: d.get('muscle') as string, secondary_muscle: [],
                  movement_type: 'Compound', sets: Number(d.get('sets')), repetitions: Number(d.get('reps')),
                  weight: Number(d.get('weight')), rest_time: Number(d.get('rest')), video_url: ''
                };
                setExercises([...exercises, ex]);
                setIsModalOpen(false);
              }} className="space-y-4">
                <input name="name" placeholder="Name" className="w-full bg-slate-800 p-4 rounded-2xl font-bold" required />
                <div className="grid grid-cols-2 gap-4">
                  <input name="muscle" placeholder="Muscle" className="bg-slate-800 p-4 rounded-2xl font-bold" />
                  <input name="weight" type="number" placeholder="Weight" className="bg-slate-800 p-4 rounded-2xl font-bold text-emerald-400" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <input name="sets" type="number" placeholder="Sets" className="bg-slate-800 p-4 rounded-2xl font-bold" />
                  <input name="reps" type="number" placeholder="Reps" className="bg-slate-800 p-4 rounded-2xl font-bold" />
                  <input name="rest" type="number" placeholder="Rest(s)" className="bg-slate-800 p-4 rounded-2xl font-bold text-indigo-400" />
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white font-black py-5 rounded-2xl uppercase">Add Exercise</button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}