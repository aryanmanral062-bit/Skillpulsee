import { LayoutDashboard, FileText, Target, Activity, Settings } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const links = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/employee/dashboard' },
  { name: 'Submissions', icon: FileText, path: '/employee/dashboard/submissions' },
  { name: 'Skill Targets', icon: Target, path: '/employee/dashboard/targets' },
  { name: 'Progress', icon: Activity, path: '/employee/dashboard/progress' },
  { name: 'Settings', icon: Settings, path: '/employee/dashboard/settings' },
];

export default function EmployeeSidebar() {
  const location = useLocation();

  return (
    <aside className="w-full md:w-64 flex flex-col pt-6 pb-8 border-b md:border-b-0 md:border-r border-slate-100/50 bg-white/40 backdrop-blur-3xl md:h-full md:rounded-l-[32px] shrink-0">
      <div className="px-8 mb-6 md:mb-10 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
          <div className="w-4 h-4 bg-white rounded-full opacity-90" />
        </div>
        <span className="font-bold text-xl tracking-tight text-slate-800">SkillPulse</span>
      </div>

      <div className="px-6 flex-1 flex flex-row md:flex-col gap-2 md:gap-2 overflow-x-auto md:overflow-visible no-scrollbar">
        <div className="hidden md:block text-xs font-medium text-slate-400 mb-4 px-2 tracking-wider">My Space</div>
        {links.map((link) => {
          const isActive = location.pathname === link.path || (link.path === '/employee/dashboard' && location.pathname === '/employee/dashboard');

          return (
            <Link key={link.name} to={link.path} className="relative block shrink-0">
              {isActive && (
                <motion.div 
                  layoutId="employee-active-pill"
                  className="absolute inset-0 bg-green-500 rounded-full shadow-[0_4px_16px_rgba(34,197,94,0.4)]"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <div className={`relative flex items-center gap-3 md:gap-4 px-4 py-3 rounded-full transition-colors z-10 ${isActive ? 'text-white font-medium' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'}`}>
                <link.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[14px] md:text-[15px]">{link.name}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
