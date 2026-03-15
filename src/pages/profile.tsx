import React, { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';

export default function Profile() {
  const [profile, setProfile] = useState({
    name: '',
    weight: '',
    height: '',
    goal: 'Maintenance'
  });

  useEffect(() => {
    const saved = localStorage.getItem('hc-profile');
    if (saved) setProfile(JSON.parse(saved));
  }, []);

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('hc-profile', JSON.stringify(profile));
    alert("Profile Updated!");
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <main className="flex-1 p-6 md:p-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-black italic uppercase mb-8">Athlete Profile</h1>
          
          <form onSubmit={saveProfile} className="space-y-6 bg-slate-900 p-8 rounded-[2rem] border border-slate-800">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-2">Display Name</label>
              <input 
                value={profile.name}
                onChange={e => setProfile({...profile, name: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl font-bold focus:border-indigo-500 outline-none transition-all"
                placeholder="e.g. Haiden"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-2">Weight (lb)</label>
                <input 
                  type="number"
                  value={profile.weight}
                  onChange={e => setProfile({...profile, weight: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl font-bold outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-2">Height (in)</label>
                <input 
                  type="number"
                  value={profile.height}
                  onChange={e => setProfile({...profile, height: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl font-bold outline-none"
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-xl uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20">
              Update Stats
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}