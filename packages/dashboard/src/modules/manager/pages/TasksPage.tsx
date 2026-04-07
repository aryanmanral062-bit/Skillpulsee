import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { CheckSquare, Clock, AlertCircle } from 'lucide-react';

const MOCK_TASKS = [
  { id: 1, title: "Complete Jest Fundamentals Lab", employee: "Sarah Jenkins", status: "In Progress", progress: 65, timeTaken: "4 Hours", overdue: false },
  { id: 2, title: "Resolve Critical Vulnerability (CVE-2026-X)", employee: "Alex Chen", status: "Done", progress: 100, timeTaken: "1.5 Hours", overdue: false },
  { id: 3, title: "Docker Core Orchestration Path", employee: "Elena Rostova", status: "Pending", progress: 10, timeTaken: "0 Hours", overdue: true },
  { id: 4, title: "Rate Limiting Architecture Review", employee: "Marcus Torres", status: "In Progress", progress: 40, timeTaken: "2 Hours", overdue: false },
];

export default function TasksPage() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      className="max-w-5xl mx-auto space-y-8 pb-12"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Header Area */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Employee Tasks</h1>
          <p className="text-slate-500 font-medium mt-1 text-sm md:text-base">Monitor specific training paths and assignments scaling team capabilities locally.</p>
        </div>
      </motion.div>

      {/* Task List Iteration */}
      <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-md rounded-[24px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="divide-y divide-slate-100/80">
           {MOCK_TASKS.map(task => (
             <div key={task.id} className="p-6 hover:bg-slate-50/50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                   
                   <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1.5">
                        <h3 className="font-bold text-slate-800 text-lg leading-tight">{task.title}</h3>
                        {task.overdue && <span className="inline-flex text-[10px] items-center gap-1 font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100 uppercase tracking-widest"><AlertCircle size={10}/> Overdue</span>}
                      </div>
                      <p className="text-sm font-semibold text-slate-500">Assigned to: <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">{task.employee}</span></p>
                   </div>

                   <div className="flex items-center gap-6 w-full md:w-auto">
                     
                     {/* Progress Display */}
                     <div className="w-full md:w-48 text-right">
                       <div className="flex justify-between items-end mb-1">
                          <span className={`text-[10px] font-black uppercase tracking-wider ${task.status === 'Done' ? 'text-green-600' : 'text-slate-400'}`}>
                            {task.status}
                          </span>
                          <span className="text-xs font-bold text-slate-700">{task.progress}%</span>
                       </div>
                       <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${task.status === 'Done' ? 'bg-green-500' : task.overdue ? 'bg-red-500' : 'bg-indigo-500'}`} style={{ width: `${task.progress}%` }} />
                       </div>
                     </div>

                     {/* Stat Tag */}
                     <div className="hidden sm:flex flex-col items-end">
                       <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1"><Clock size={12}/> Time</span>
                       <span className="text-sm font-bold text-slate-700 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">{task.timeTaken}</span>
                     </div>

                   </div>

                </div>
             </div>
           ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
