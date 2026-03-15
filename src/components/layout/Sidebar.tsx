import { Calendar, Dumbbell, Target, History, Home } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Sidebar() {
  const router = useRouter();

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: Dumbbell, label: 'Workouts', path: '/workouts' },
    { icon: Calendar, label: 'Schedule', path: '/schedule' },
    { icon: History, label: 'History', path: '/history' },
    { icon: Target, label: 'Goals', path: '/goals' },
  ];

  return (
    <>
      {/* DESKTOP SIDEBAR - Hidden on small screens */}
      <aside className="hidden md:flex h-screen w-64 bg-slate-900 border-r border-slate-800 flex-col p-6 sticky top-0">
        <div className="mb-10">
          <h1 className="text-2xl font-black italic tracking-tighter text-white">HC PLANNER</h1>
          <div className="h-1 w-12 bg-indigo-500 mt-1"></div>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = router.pathname === item.path;

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-4 px-4 py-3 rounded-2xl font-bold transition-all ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* MOBILE BOTTOM NAV - Visible only on small screens */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-slate-900/90 backdrop-blur-lg border-t border-slate-800 px-2 flex items-center justify-around z-50">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = router.pathname === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                isActive ? 'text-indigo-400' : 'text-slate-500'
              }`}
            >
              <Icon size={20} />
              <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}