import React, { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import { Exercise } from '../types/workout';
import { 
  Calendar as CalendarIcon, 
  ChevronRight, 
  ChevronDown, 
  Printer,
  Plus,
  Activity,
  Clock,
  Dumbbell
} from 'lucide-react';

interface WorkoutTemplate {
  id: string;
  name: string;
  exercises: Exercise[];
}

export default function Schedule() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const [schedule, setSchedule] = useState<{[key: string]: string}>({});
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  useEffect(() => {
    const savedSched = localStorage.getItem('hc-schedule');
    const savedTemplates = localStorage.getItem('hc-templates');
    if (savedSched) setSchedule(JSON.parse(savedSched));
    if (savedTemplates) setTemplates(JSON.parse(savedTemplates));
  }, []);

  const assignWorkout = (day: string, workoutName: string) => {
    const newSched = { ...schedule, [day]: workoutName };
    setSchedule(newSched);
    localStorage.setItem('hc-schedule', JSON.stringify(newSched));
  };

  const getTemplateForDay = (day: string) => {
    return templates.find(t => t.name === schedule[day]);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* SIDEBAR - Hidden during print */}
      <div className="print:hidden">
        <Sidebar />
      </div>
      
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          
          {/* HEADER - Hidden during print */}
          <header className="mb-12 flex justify-between items-end print:hidden">
            <div>
              <h1 className="text-sm font-bold text-indigo-500 uppercase tracking-[0.2em] mb-2">Training Block</h1>
              <h2 className="text-5xl font-black tracking-tighter italic uppercase">Weekly <span className="text-indigo-500">Program</span></h2>
            </div>
            <button 
              onClick={handlePrint}
              className="bg-slate-900 border border-slate-800 hover:border-indigo-500 text-slate-300 hover:text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 transition-all"
            >
              <Printer size={18} /> Print Program
            </button>
          </header>

          {/* PRINT-ONLY VERSION (Only visible when printing) */}
          <div className="hidden print:block text-black p-4">
            <h1 className="text-3xl font-black uppercase mb-8 border-b-4 border-black pb-2">Weekly Workout Manifest</h1>
            {days.map(day => {
              const workout = getTemplateForDay(day);
              if (!workout) return null;
              return (
                <div key={day} className="mb-10 avoid-break">
                  <h2 className="text-xl font-bold uppercase bg-gray-100 p-2 mb-4">{day}: {workout.name}</h2>
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b-2 border-black">
                        <th className="py-2">Exercise</th>
                        <th>Sets</th>
                        <th>Reps</th>
                        <th>Weight</th>
                        <th>Completed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {workout.exercises.map((ex, i) => (
                        <tr key={i} className="border-b border-gray-300 text-sm">
                          <td className="py-3 font-bold uppercase">{ex.name}</td>
                          <td>{ex.sets}</td>
                          <td>{ex.repetitions}</td>
                          <td>{ex.weight} lbs</td>
                          <td className="border border-gray-400 w-12 text-center"> [ ] </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>

          {/* MAIN UI - Hidden during print */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 print:hidden">
            
            {/* LEFT: CALENDAR SLOTS */}
            <div className="xl:col-span-8 space-y-4">
              {days.map((day) => {
                const isToday = day === days[new Date().getDay() - 1];
                const activeTemplate = getTemplateForDay(day);
                const isExpanded = expandedDay === day;

                return (
                  <div key={day} className="space-y-2">
                    <div 
                      onClick={() => setSelectedDay(day)}
                      className={`group bg-slate-900 border transition-all cursor-pointer rounded-[2rem] p-6 flex items-center justify-between ${
                        selectedDay === day ? 'border-indigo-500 ring-2 ring-indigo-500/10' : 'border-slate-800 hover:border-slate-700'
                      } ${isToday ? 'bg-slate-900/80 border-indigo-500/40' : ''}`}
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-24">
                          <p className={`text-[10px] font-black uppercase tracking-widest ${isToday ? 'text-indigo-400' : 'text-slate-500'}`}>
                            {isToday ? 'Today' : 'Cycle'}
                          </p>
                          <h3 className="text-xl font-black uppercase tracking-tight">{day}</h3>
                        </div>

                        <div className="h-10 w-[1px] bg-slate-800"></div>

                        <div>
                          {activeTemplate ? (
                            <div className="flex items-center gap-4">
                              <p className="text-lg font-bold text-white uppercase italic tracking-tight">{activeTemplate.name}</p>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpandedDay(isExpanded ? null : day);
                                }}
                                className="p-2 hover:bg-slate-800 rounded-lg text-slate-500"
                              >
                                {isExpanded ? <ChevronDown size={18} className="text-indigo-400" /> : <ChevronRight size={18} />}
                              </button>
                            </div>
                          ) : (
                            <p className="text-sm font-bold text-slate-700 uppercase italic">Rest Day / Empty</p>
                          )}
                        </div>
                      </div>

                      {activeTemplate && (
                        <div className="bg-indigo-500/10 px-4 py-1.5 rounded-full border border-indigo-500/20 text-[10px] font-black text-indigo-400 uppercase">
                          {activeTemplate.exercises.length} Exercises
                        </div>
                      )}
                    </div>

                    {/* DROP DOWN EXERCISE PREVIEW */}
                    {isExpanded && activeTemplate && (
                      <div className="mx-6 p-6 bg-slate-950 border-x border-b border-slate-800 rounded-b-[2rem] grid grid-cols-2 md:grid-cols-3 gap-4 animate-in slide-in-from-top-2">
                        {activeTemplate.exercises.map((ex, idx) => (
                          <div key={idx} className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800/50">
                            <p className="text-xs font-black uppercase text-white truncate mb-1">{ex.name}</p>
                            <p className="text-[10px] text-indigo-400 font-bold">{ex.sets}x{ex.repetitions} @ {ex.weight}lb</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* RIGHT: THE INSPECTOR SIDEBAR */}
            <div className="xl:col-span-4">
              <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-8 sticky top-8">
                {selectedDay ? (
                  <div className="space-y-8">
                    <header>
                      <h3 className="text-xs font-black text-indigo-500 uppercase tracking-widest mb-1">Inspecting</h3>
                      <h4 className="text-4xl font-black uppercase italic text-white tracking-tighter">{selectedDay}</h4>
                    </header>

                    {/* LIST OF EXERCISES ON THE RIGHT */}
                    {getTemplateForDay(selectedDay) ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-slate-500 uppercase">Active Exercises</p>
                          <button 
                            onClick={() => assignWorkout(selectedDay, '')}
                            className="text-[10px] font-black text-red-500 hover:text-red-400 uppercase tracking-tighter"
                          >
                            Clear Day
                          </button>
                        </div>
                        <div className="bg-slate-950 rounded-[2rem] p-6 border border-slate-800 space-y-5">
                          {getTemplateForDay(selectedDay)?.exercises.map((ex, i) => (
                            <div key={i} className="flex items-start gap-4">
                              <div className="w-8 h-8 mt-0.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 text-xs font-black">
                                {i + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-black uppercase text-white truncate">{ex.name}</p>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">
                                  {ex.primary_muscle} • {ex.weight}lb
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="py-16 text-center border-2 border-dashed border-slate-800 rounded-[2rem]">
                        <Activity className="mx-auto text-slate-800 mb-3" size={32} />
                        <p className="text-xs font-bold text-slate-600 uppercase italic">No workout scheduled</p>
                      </div>
                    )}

                    {/* QUICK ASSIGN SELECTOR */}
                    <div className="space-y-3">
                      <p className="text-xs font-bold text-slate-500 uppercase">Switch Routine:</p>
                      <div className="space-y-2">
                        {templates.map(t => (
                          <button 
                            key={t.id} 
                            onClick={() => assignWorkout(selectedDay, t.name)}
                            className={`w-full text-left p-4 rounded-2xl border transition-all flex justify-between items-center group ${
                              schedule[selectedDay] === t.name 
                              ? 'bg-indigo-600 border-indigo-400' 
                              : 'bg-slate-800/40 border-slate-700 hover:border-slate-500'
                            }`}
                          >
                            <span className={`font-black uppercase text-xs tracking-tight ${schedule[selectedDay] === t.name ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                              {t.name}
                            </span>
                            <Dumbbell size={14} className={schedule[selectedDay] === t.name ? 'text-indigo-200' : 'text-slate-600'} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-800 flex items-center gap-3 text-slate-600">
                      <Clock size={16} />
                      <p className="text-[10px] font-bold uppercase tracking-tighter">Plan your work, work your plan.</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-32 text-center opacity-20">
                    <CalendarIcon size={64} className="mb-4" />
                    <p className="text-sm font-black uppercase tracking-[0.2em]">Select a day<br/>to edit plan</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}