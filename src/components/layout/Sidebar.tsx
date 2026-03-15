import { Calendar, Dumbbell, Target, History, Home, User } from 'lucide-react';
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
    { icon: User, label: 'Profile', path: '/profile' }, // Added Profile link
  ];

  return (
    <>
      {/* DESKTOP SIDEBAR - Hidden on mobile (md:flex) */}
      <aside className="hidden md:flex h-screen w-64 bg-slate-950 border-r border-slate-800 flex-col p-6 sticky top-0 z-40">
        <div className="mb-10 px-2">
          <h2 className="text-2xl font-black text-white tracking-tighter italic">
            HC<span className="text-indigo-500">.</span>PLANNER
          </h2>
          <div className="h-1 w-12 bg-indigo-500 mt-1"></div>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = router.pathname === item.path;

            return (
              <Link key={item.path} href={item.path} className="block">
                <div
                  className={`flex items-center gap-4 px-4 py-4 rounded-2xl text-sm font-bold transition-all duration-200 cursor-pointer ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                      : 'text-slate-500 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* MOBILE BOTTOM NAV - Visible only on small screens (md:hidden) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-slate-950/90 backdrop-blur-lg border-t border-slate-800 px-2 flex items-center justify-around z-50">
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
              <span className="text-[10px] font-bold uppercase tracking-tighter">
                {item.label === 'Dashboard' ? 'Home' : item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}