import React from 'react';
import { motion, Variants } from 'framer-motion';
import { FolderGit2, Users, PieChart, Activity, Clock } from 'lucide-react';

const MOCK_PROJECTS = [
  {
     id: "p1",
     name: "API Gateway Refactor",
     members: ["Alex Chen", "Marcus Torres"],
     completion: 85,
     avgEfficiency: 92,
     avgConsistency: 88,
     status: "On Track"
  },
  {
     id: "p2",
     name: "Frontend Dashboard Modules",
     members: ["Sarah Jenkins", "James Wilson"],
     completion: 45,
     avgEfficiency: 70,
     avgConsistency: 62,
     status: "Delayed"
  },
  {
     id: "p3",
     name: "Auth Service Migration",
     members: ["Priya Patel", "Elena Rostova"],
     completion: 15,
     avgEfficiency: 64,
     avgConsistency: 71,
     status: "At Risk"
  }
];

export default function ProjectsPage() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 15 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      className="max-w-7xl mx-auto space-y-8 pb-12"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Project Overview</h1>
        <p className="text-slate-500 font-medium mt-1 text-sm md:text-base">Track project-level progress bounding underlying team capabilities.</p>
      </motion.div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {MOCK_PROJECTS.map((proj) => (
           <motion.div key={proj.id} variants={itemVariants} className="bg-white/70 backdrop-blur-md rounded-[24px] shadow-sm border border-slate-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow cursor-pointer group">
              <div className="p-6 flex-1">
                 
                 <div className="flex justify-between items-start mb-6">
                   <div className="bg-indigo-50 p-3 rounded-2xl">
                     <FolderGit2 size={24} className="text-indigo-600" />
                   </div>
                   <span className={`text-[10px] uppercase font-black tracking-wider px-2.5 py-1 rounded-md border ${proj.status === 'On Track' ? 'bg-green-50 text-green-700 border-green-100' : proj.status === 'Delayed' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                      {proj.status}
                   </span>
                 </div>

                 <h3 className="text-lg font-bold text-slate-800 mb-1 leading-tight group-hover:text-indigo-600 transition-colors">{proj.name}</h3>
                 <p className="text-xs font-semibold text-slate-400 mb-6 flex items-center gap-1.5">
                   <Users size={14}/> {proj.members.join(', ')}
                 </p>

                 <div className="space-y-4">
                    {/* Completion SVG Visualizer */}
                    <div>
                      <div className="flex justify-between items-end mb-1">
                        <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5"><Clock size={12}/> Completion</span>
                        <span className="text-sm font-black text-slate-800">{proj.completion}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${proj.completion}%` }} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                       <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                          <div className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center gap-1"><Activity size={10}/> Avg Efficiency</div>
                          <div className="text-lg font-black text-slate-700">{proj.avgEfficiency}<span className="text-xs text-slate-400 font-bold">%</span></div>
                       </div>
                       <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                          <div className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center gap-1"><PieChart size={10}/> Avg Consistency</div>
                          <div className="text-lg font-black text-slate-700">{proj.avgConsistency}<span className="text-xs text-slate-400 font-bold">%</span></div>
                       </div>
                    </div>
                 </div>

              </div>
              <div className="bg-slate-50/50 border-t border-slate-100 p-4 text-center text-xs font-bold text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                 View Contribution Chart →
              </div>
           </motion.div>
         ))}
      </div>
    </motion.div>
  );
}
