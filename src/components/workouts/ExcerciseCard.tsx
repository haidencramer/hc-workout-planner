import React from 'react';
import { Exercise } from '../../types/workout'; 
import { Dumbbell, Clock, Play } from 'lucide-react';

interface ExerciseCardProps {
  exercise: Exercise;
  onStartTimer?: (seconds: number) => void;
}

export default function ExcerciseCard({ exercise, onStartTimer }: ExerciseCardProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-[2.5rem] hover:border-indigo-500/30 transition-all">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold uppercase text-white tracking-tight">{exercise.name}</h3>
          <span className="text-[10px] font-black bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-1 rounded-lg uppercase">
            {exercise.primary_muscle}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-950/50 p-4 rounded-2xl text-center border border-slate-800/50">
          <p className="text-[10px] text-slate-600 font-bold uppercase mb-1">Sets</p>
          <p className="text-xl font-black text-slate-100">{exercise.sets}</p>
        </div>
        <div className="bg-slate-950/50 p-4 rounded-2xl text-center border border-slate-800/50">
          <p className="text-[10px] text-slate-600 font-bold uppercase mb-1">Reps</p>
          <p className="text-xl font-black text-slate-100">{exercise.repetitions}</p>
        </div>
        <button 
          onClick={() => onStartTimer?.(exercise.rest_time)}
          className="bg-slate-950/50 p-4 rounded-2xl text-center border border-slate-800/50 hover:border-indigo-500 transition-all group"
        >
          <p className="text-[10px] text-slate-600 font-bold uppercase mb-1 group-hover:text-indigo-400 transition-colors">Rest</p>
          <p className="text-xl font-black text-indigo-400 italic">{exercise.rest_time}s</p>
        </button>
      </div>
    </div>
  );
}