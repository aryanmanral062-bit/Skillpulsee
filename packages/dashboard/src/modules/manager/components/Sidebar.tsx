import { LayoutDashboard, Inbox, TrendingUp, FolderGit2, Users, PieChart } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const links = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/manager/dashboard' },
  { name: 'Inboxes', icon: Inbox, path: '/manager/dashboard/inbox' },
  { name: 'Performances', icon: TrendingUp, path: '/manager/dashboard/performances' },
  { name: 'Projects', icon: FolderGit2, path: '/manager/dashboard/projects' },
  { name: 'Employee Task', icon: Users, path: '/manager/dashboard/tasks' },
  { name: 'Analytics', icon: PieChart, path: '/manager/dashboard/analytics' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 flex flex-col pt-6 pb-8 border-r border-slate-100/50 bg-white/40 backdrop-blur-3xl h-full">
      <div className="px-8 mb-10 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center">
          <div className="w-4 h-4 bg-white rounded-full opacity-90" />
        </div>
        <span className="font-bold text-xl tracking-tight text-slate-800">SkillPulse</span>
      </div>

      <div className="px-6 flex-1 space-y-2">
        <div className="text-xs font-medium text-slate-400 mb-4 px-2 tracking-wider">Dashboard</div>
        {links.map((link) => {
          // Temporarily match active state closely for demo
          const isActive = location.pathname === link.path || (link.path === '/manager/dashboard' && location.pathname.startsWith('/manager/dashboard/employees'));

          return (
            <Link key={link.name} to={link.path} className="relative block">
              {isActive && (
                <motion.div 
                  layoutId="active-pill"
                  className="absolute inset-0 bg-[#2C5AFF] rounded-full shadow-[0_4px_16px_rgba(44,90,255,0.4)]"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <div className={`relative flex items-center gap-4 px-4 py-3 rounded-full transition-colors z-10 ${isActive ? 'text-white font-medium' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'}`}>
                <link.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[15px]">{link.name}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
