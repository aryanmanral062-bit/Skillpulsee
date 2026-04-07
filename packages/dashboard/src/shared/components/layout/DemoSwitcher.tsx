import React from 'react';
import { useRole } from '../../context/RoleContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserCircle2, Briefcase } from 'lucide-react';

export default function DemoSwitcher() {
  const { role, setRole } = useRole();
  const navigate = useNavigate();
  const location = useLocation();

  const handleToggle = () => {
    const newRole = role === 'manager' ? 'employee' : 'manager';
    setRole(newRole);
    
    // Redirect cleanly upon contextual swap simulating authentication redirect logic
    if (newRole === 'manager') {
      navigate('/manager/dashboard');
    } else {
      navigate('/employee/dashboard');
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 shadow-2xl p-2 bg-white/60 backdrop-blur-xl rounded-2xl border border-white">
       <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center">Demo Mode</span>
       <button 
         onClick={handleToggle}
         className="flex items-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-xl shadow-md hover:-translate-y-1 transition-all duration-300 font-semibold text-sm"
       >
         {role === 'manager' ? <UserCircle2 size={18} className="text-green-400"/> : <Briefcase size={18} className="text-[#2C5AFF]"/>}
         <span>Switch to {role === 'manager' ? 'Employee' : 'Manager'}</span>
       </button>
    </div>
  );
}
