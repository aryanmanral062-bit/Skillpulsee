import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { TrendingUp, Filter, Search, Award, AlertTriangle, ChevronRight } from 'lucide-react';

const TEAM_PERFORMANCE = [
  { id: 1, name: "Alex Chen", skillScore: 94, readability: 92, efficiency: 98, project: "API Gateway Refactor", status: "Active" },
  { id: 2, name: "Sarah Jenkins", skillScore: 68, readability: 72, efficiency: 64, project: "Frontend Dashboard", status: "At Risk" },
  { id: 3, name: "Marcus Torres", skillScore: 88, readability: 90, efficiency: 84, project: "API Gateway Refactor", status: "Active" },
  { id: 4, name: "Priya Patel", skillScore: 76, readability: 82, efficiency: 70, project: "Auth Service Migration", status: "Active" },
  { id: 5, name: "James Wilson", skillScore: 91, readability: 88, efficiency: 94, project: "Frontend Dashboard", status: "Active" },
  { id: 6, name: "Elena Rostova", skillScore: 62, readability: 68, efficiency: 58, project: "Auth Service Migration", status: "At Risk" }
];

export default function PerformancesPage() {
  const [search, setSearch] = useState('');
  const [projectFilter, setProjectFilter] = useState('All Projects');

  const uniqueProjects = ['All Projects', ...Array.from(new Set(TEAM_PERFORMANCE.map(p => p.project)))];

  const filteredTeam = TEAM_PERFORMANCE.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(search.toLowerCase());
    const matchesProject = projectFilter === 'All Projects' || emp.project === projectFilter;
    return matchesSearch && matchesProject;
  });

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-700 font-black';
    if (score < 70) return 'text-red-600 font-black';
    return 'text-slate-700 font-bold';
  };

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
      className="max-w-7xl mx-auto space-y-8 pb-12"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Team Performances</h1>
          <p className="text-slate-500 font-medium mt-1 text-sm md:text-base">Track and evaluate real-time employee analytics across all active projects.</p>
        </div>
      </motion.div>

      {/* Filter Bar */}
      <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-md rounded-[20px] shadow-sm border border-slate-100 p-4 lg:p-5 flex flex-col md:flex-row items-center gap-4">
        <div className="relative w-full md:flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text"
            placeholder="Search employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 outline-none rounded-2xl pl-11 pr-4 py-3 text-sm font-medium text-slate-700 transition-colors focus:ring-2 focus:ring-slate-200"
          />
        </div>
        <select 
          className="w-full md:w-64 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-700 rounded-2xl px-4 py-3 outline-none cursor-pointer transition-colors"
          value={projectFilter}
          onChange={(e) => setProjectFilter(e.target.value)}
        >
          {uniqueProjects.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </motion.div>

      {/* Primary Table */}
      <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-md rounded-[24px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
             <thead className="bg-slate-50/50 text-slate-500 uppercase font-bold text-[11px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-6 py-5">Employee Name</th>
                  <th className="px-6 py-5 text-center">Skill Score</th>
                  <th className="px-6 py-5 text-center">Readability</th>
                  <th className="px-6 py-5 text-center">Efficiency</th>
                  <th className="px-6 py-5">Project Assigned</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5 text-right w-16"></th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-100/80">
                {filteredTeam.map(emp => {
                  const isTop = emp.skillScore >= 90;
                  const isWeak = emp.skillScore < 70;
                  
                  return (
                    <tr key={emp.id} className={`hover:bg-slate-50/50 transition-colors group cursor-default`}>
                       {/* Employee Name */}
                       <td className="px-6 py-4">
                         <div className="flex items-center gap-3">
                           <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm ${isTop ? 'bg-green-100 text-green-700 border border-green-200' : isWeak ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-slate-100 text-slate-700 border border-slate-200'}`}>
                             {emp.name.charAt(0)}
                           </div>
                           <div className="font-bold text-sm text-slate-800 flex items-center gap-2">
                              {emp.name}
                              {isTop && <span className="inline-flex text-[10px] items-center gap-1 font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-100 uppercase tracking-widest"><Award size={10}/> Top</span>}
                              {isWeak && <span className="inline-flex text-[10px] items-center gap-1 font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100 uppercase tracking-widest"><AlertTriangle size={10}/> Watch</span>}
                           </div>
                         </div>
                       </td>
                       
                       {/* Scores */}
                       <td className="px-6 py-4 text-center"><span className={getScoreColor(emp.skillScore)}>{emp.skillScore}</span></td>
                       <td className="px-6 py-4 text-center"><span className={getScoreColor(emp.readability)}>{emp.readability}</span></td>
                       <td className="px-6 py-4 text-center"><span className={getScoreColor(emp.efficiency)}>{emp.efficiency}</span></td>

                       {/* Project Assigned */}
                       <td className="px-6 py-4">
                         <span className="text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                           {emp.project}
                         </span>
                       </td>

                       {/* Status */}
                       <td className="px-6 py-4">
                          <span className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${emp.status === 'Active' ? 'bg-indigo-50 border-indigo-100 text-indigo-700' : 'bg-amber-50 border-amber-100 text-amber-700'}`}>
                             {emp.status}
                          </span>
                       </td>

                       {/* Action */}
                       <td className="px-6 py-4 text-right">
                          <button className="p-2 text-slate-300 group-hover:text-slate-600 hover:bg-slate-200 transition-colors rounded-lg">
                            <ChevronRight size={18} />
                          </button>
                       </td>
                    </tr>
                  );
                })}
                {filteredTeam.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-20 text-center text-slate-400 font-semibold text-sm">
                      No employees match the current filters.
                    </td>
                  </tr>
                )}
             </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
