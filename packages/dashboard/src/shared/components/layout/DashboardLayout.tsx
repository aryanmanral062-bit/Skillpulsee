import React from 'react';
import Sidebar from '../../../modules/manager/components/Sidebar';
import EmployeeSidebar from '../../../modules/employee/components/EmployeeSidebar';
import { motion } from 'framer-motion';
import { Bell, Settings, Search } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isEmployeeMode = location.pathname.startsWith('/employee');

  return (
    <div className="min-h-screen py-10 px-4 md:px-8 flex text-slate-800">
      
      {/* Outer Floating Glass Container matching Reference UI Bounds */}
      {/* Structural Fix: Removed rigid fixed heights and overflow-hidden clips for responsive scrolling */}
      <motion.div 
        className="w-full max-w-[1400px] min-h-[85vh] mx-auto bg-white/70 backdrop-blur-3xl shadow-soft-2xl border border-white/50 rounded-[32px] flex flex-col md:flex-row relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Dynamic Sidebar Mapping */}
        {isEmployeeMode ? <EmployeeSidebar /> : <Sidebar />}
        
        {/* Main Application Inner Surface */}
        <div className="flex-1 flex flex-col bg-[#F9FAFC]/50 rounded-b-[32px] md:rounded-b-none md:rounded-r-[32px]">
          
          {/* Dashboard Header Bar */}
          <header className="h-auto md:h-24 px-6 md:px-10 py-6 md:py-0 flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 shrink-0 gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0">
                 <div className="w-full h-full bg-slate-200" style={{ backgroundImage: isEmployeeMode ? "url('https://i.pravatar.cc/100?img=33')" : "url('https://i.pravatar.cc/100?img=11')", backgroundSize: 'cover' }} />
              </div>
              <div className="leading-tight">
                <h1 className="text-xl font-bold tracking-tight text-slate-800">Hey, {isEmployeeMode ? 'Alex' : 'Manager'}</h1>
                <p className="text-sm text-slate-400 font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 md:gap-6">
               <div className="relative hidden md:block">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                 <input 
                   type="text" 
                   placeholder="Start searching here..."
                   className="pl-12 pr-6 py-3 w-[260px] lg:w-[300px] bg-white border border-slate-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-100 shadow-sm text-sm transition-all"
                 />
               </div>
               <div className="flex items-center gap-3">
                 <button className="h-10 w-10 flex items-center justify-center bg-white border border-slate-100 rounded-full shadow-sm text-slate-500 hover:text-slate-800 transition-colors">
                   <Settings size={18} />
                 </button>
                 <button className="h-10 w-10 flex items-center justify-center bg-white border border-slate-100 rounded-full shadow-sm text-slate-500 hover:text-slate-800 transition-colors relative">
                   <div className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full" />
                   <Bell size={18} />
                 </button>
               </div>
            </div>
          </header>

          {/* Scrollable Canvas Output (Soft container with structural padding) */}
          <main className="flex-1 p-6 md:p-10 text-slate-800">
            {children}
          </main>
        </div>
      </motion.div>
    </div>
  );
}
