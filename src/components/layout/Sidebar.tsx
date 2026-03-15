import { Calendar, Dumbbell, Target, Settings, Home } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Sidebar() {
  const router = useRouter();

  const menuItems = [
    { icon: <Home size={20} />, label: 'Dashboard', path: '/' },
    { icon: <Calendar size={20} />, label: 'Schedule', path: '/schedule' },
    { icon: <Dumbbell size={20} />, label: 'Workouts', path: '/workouts' },
    { icon: <Target size={20} />, label: 'Goals & PRs', path: '/goals' },
  ];

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 h-screen sticky top-0 flex flex-col z-40">
      <div className="p-8">
        <h2 className="text-2xl font-black text-white tracking-tighter italic">
          HC<span className="text-indigo-500">.</span>PLANNER
        </h2>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = router.pathname === item.path;
          
          return (
            <Link href={item.path} key={item.label} className="block">
              <button
                className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-sm font-bold transition-all duration-200 ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                    : 'text-slate-500 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-900">
        <button className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-sm font-bold text-slate-500 hover:bg-slate-900 transition-all">
          <Settings size={20} />
          Settings
        </button>
      </div>
    </aside>
  );
}