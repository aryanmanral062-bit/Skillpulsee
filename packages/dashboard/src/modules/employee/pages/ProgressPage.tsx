import React, { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { TrendingUp, Activity, BarChart2, GitPullRequest, LayoutList, GitCommit, Target, Lightbulb, AlertTriangle, ArrowUpRight, CheckSquare } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { apiClient } from '../../../api/client';

export default function ProgressPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating the aggregation using native mock resolution if DB fails
    const loadData = async () => {
      try {
        setLoading(true);
        // We simulate fetching /employees/:id/history and /score natively
        const MOCK_CURRENT = {
           skillScore: 88,
           activityScore: 84,
           efficiencyScore: 92,
           consistencyScore: 76,
           rawMetrics: { mergedPRs: 24, completedTasks: 42, reposTouched: 4, issuesResolved: 18 }
        };
        const MOCK_PREVIOUS = {
           skillScore: 78,
           activityScore: 72,
           efficiencyScore: 88,
           consistencyScore: 60,
           rawMetrics: { mergedPRs: 18, completedTasks: 30, reposTouched: 3, issuesResolved: 10 }
        };
        
        setData({ current: MOCK_CURRENT, previous: MOCK_PREVIOUS });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const calculateGrowth = (current: number, previous: number) => {
    if (!previous) return 0;
    return Number((((current - previous) / previous) * 100).toFixed(1));
  };

  const chartData = [
    { name: 'Week 1', score: 68 },
    { name: 'Week 2', score: 72 },
    { name: 'Week 3', score: 75 },
    { name: 'Week 4', score: 74 },
    { name: 'Week 5', score: 78 },
    { name: 'Week 6', score: 82 },
    { name: 'Week 7', score: 88 },
  ];

  // Helper Custom Heatmap Logic inline mapping
  const heatmapCells = Array.from({ length: 28 }).map((_, i) => Math.floor(Math.random() * 4)); 
  const getIntensityColor = (intensity: number) => {
    if (intensity === 0) return 'bg-slate-100';
    if (intensity === 1) return 'bg-indigo-200';
    if (intensity === 2) return 'bg-indigo-400';
    return 'bg-indigo-600';
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  if (loading || !data) return (
     <div className="flex h-full w-full justify-center items-center opacity-50"><div className="animate-pulse bg-slate-300 w-16 h-16 rounded-full" /></div>
  );

  const scoreGrowth = calculateGrowth(data.current.skillScore, data.previous.skillScore);
  const activityGrowth = calculateGrowth(data.current.activityScore, data.previous.activityScore);
  const efficiencyGrowth = calculateGrowth(data.current.efficiencyScore, data.previous.efficiencyScore);
  const consistencyGrowth = calculateGrowth(data.current.consistencyScore, data.previous.consistencyScore);

  return (
    <motion.div 
      className="max-w-7xl mx-auto space-y-8 pb-12"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Header Area */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Performance Progress</h1>
          <p className="text-slate-500 font-medium mt-1 text-sm md:text-base">Track your real impact, verify execution trends, and unlock velocity.</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
        
        {/* ============================================================== */}
        {/* LEFT COLUMN (70%) - MAIN ANALYTICS */}
        {/* ============================================================== */}
        <div className="space-y-8">
           
           {/* Growth Score Trend */}
           <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-md rounded-[24px] shadow-sm border border-slate-100 p-8">
             <div className="flex items-center justify-between mb-8">
                 <div>
                   <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                      <TrendingUp size={20} className="text-fuchsia-500" /> Skill Growth Over Time
                   </h3>
                   <span className="text-xs text-slate-400 font-medium">Historical mapping of aggregated PR payloads</span>
                 </div>
                 <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-xl border border-green-100">
                    <ArrowUpRight size={16} className="text-green-600" />
                    <span className="text-sm font-bold text-green-700">+{scoreGrowth}%</span>
                 </div>
             </div>
             
             <div className="h-[260px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={chartData}>
                   <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#d946ef" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#d946ef" stopOpacity={0}/>
                      </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#64748b', fontWeight: 600 }} dy={10} />
                   <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
                   <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', padding: '12px 16px' }}
                      itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                   />
                   <Area 
                     type="monotone" 
                     dataKey="score" 
                     stroke="#d946ef" 
                     strokeWidth={4} 
                     fillOpacity={1} 
                     fill="url(#colorScore)"
                     activeDot={{ r: 8, fill: '#c026d3', strokeWidth: 4, stroke: '#fff' }} 
                     animationDuration={1500}
                   />
                 </AreaChart>
               </ResponsiveContainer>
             </div>
           </motion.div>

           {/* Progress Breakdown */}
           <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-md rounded-[24px] shadow-sm border border-slate-100 p-8">
             <h3 className="font-bold text-slate-800 mb-6 text-lg flex items-center gap-2">
               <BarChart2 size={20} className="text-indigo-500" /> Progress Breakdown
             </h3>
             <div className="space-y-7">
                {[
                  { label: "Skill Score Growth", val: scoreGrowth, color: "bg-fuchsia-500", raw: data.current.skillScore },
                  { label: "Activity Growth", val: activityGrowth, color: "bg-green-500", raw: data.current.activityScore },
                  { label: "Efficiency Growth", val: efficiencyGrowth, color: "bg-blue-500", raw: data.current.efficiencyScore },
                  { label: "Consistency Growth", val: consistencyGrowth, color: "bg-orange-500", raw: data.current.consistencyScore },
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-slate-700">{stat.label}</span>
                      <span className="text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-md border border-green-100 flex items-center gap-1">
                         <ArrowUpRight size={12}/> +{stat.val}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${stat.raw}%` }} transition={{ duration: 1, delay: i * 0.1 }} className={`${stat.color} h-full rounded-full relative`} />
                    </div>
                  </div>
                ))}
             </div>
           </motion.div>

           {/* Impact Metrics vs Heatmap Split Row */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

             {/* Impact Metrics */}
             <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-md rounded-[24px] shadow-sm border border-slate-100 p-6 flex flex-col justify-between">
                <h3 className="font-bold text-slate-800 mb-5 text-lg flex items-center gap-2">
                  <Target size={20} className="text-rose-500" /> Your Impact
                </h3>
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4">
                      <GitPullRequest size={18} className="text-slate-400 mb-2"/>
                      <div className="text-2xl font-black text-slate-800">{data.current.rawMetrics.mergedPRs}</div>
                      <div className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">PRs Merged</div>
                   </div>
                   <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4">
                      <CheckSquare size={18} className="text-slate-400 mb-2"/>
                      <div className="text-2xl font-black text-slate-800">{data.current.rawMetrics.completedTasks}</div>
                      <div className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">Tasks Completed</div>
                   </div>
                   <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4">
                      <LayoutList size={18} className="text-slate-400 mb-2"/>
                      <div className="text-2xl font-black text-slate-800">{data.current.rawMetrics.reposTouched}</div>
                      <div className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">Repos Contributed</div>
                   </div>
                   <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4">
                      <Activity size={18} className="text-slate-400 mb-2"/>
                      <div className="text-2xl font-black text-slate-800">{data.current.rawMetrics.issuesResolved}</div>
                      <div className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">Issues Resolved</div>
                   </div>
                </div>
             </motion.div>

             {/* Custom Heatmap */}
             <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-md rounded-[24px] shadow-sm border border-slate-100 p-6 flex flex-col justify-between">
                <h3 className="font-bold text-slate-800 mb-2 text-lg flex items-center gap-2">
                  <GitCommit size={20} className="text-indigo-500" /> Commit Density
                </h3>
                <span className="text-xs text-slate-400 font-medium mb-6">Last 28 active developmental days</span>
                
                <div className="grid grid-cols-7 gap-2 mt-auto">
                   {heatmapCells.map((val, i) => (
                      <motion.div 
                         key={i} 
                         initial={{ scale: 0 }} 
                         animate={{ scale: 1 }} 
                         transition={{ delay: i * 0.02, type: "spring" }}
                         className={`aspect-square rounded-md ${getIntensityColor(val)}`} 
                      />
                   ))}
                </div>
                <div className="flex items-center justify-end gap-2 mt-4 text-[10px] font-bold text-slate-400 uppercase">
                   <span>Less</span>
                   <div className="w-3 h-3 rounded-sm bg-slate-100" />
                   <div className="w-3 h-3 rounded-sm bg-indigo-200" />
                   <div className="w-3 h-3 rounded-sm bg-indigo-400" />
                   <div className="w-3 h-3 rounded-sm bg-indigo-600" />
                   <span>More</span>
                </div>
             </motion.div>

           </div>

        </div>


        {/* ============================================================== */}
        {/* RIGHT COLUMN (30%) - INSIGHTS PANEL */}
        {/* ============================================================== */}
        <div className="space-y-6">
           
           {/* AI Insight Summary */}
           <motion.div variants={itemVariants} className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-[24px] shadow-xl p-6 relative overflow-hidden group">
              <div className="absolute -right-10 -top-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
                <Lightbulb size={120} />
              </div>
              <h3 className="font-bold text-white mb-4 flex items-center gap-2 relative z-10">
                 <Lightbulb size={20} className="text-amber-400" /> Overall Summary
              </h3>
              <p className="text-slate-300 text-sm font-medium leading-relaxed relative z-10">
                You are improving steadily! This week indicates exceptional activity bridging across core architectures. Focus on <strong className="text-white">consistency</strong> moving forward to accelerate growth bounds globally.
              </p>
           </motion.div>

           {/* Impact Analysis Cards */}
           <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-md rounded-[24px] shadow-sm border border-slate-100 p-6">
              <h3 className="font-bold text-slate-800 mb-5 flex items-center gap-2">
                 <Activity size={18} className="text-emerald-500" /> Impact Analysis
              </h3>
              <div className="space-y-4">
                 
                 <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-2xl">
                   <div className="flex items-center justify-between mb-2">
                     <span className="font-bold text-slate-800 text-sm">PR Activity Surged</span>
                     <span className="text-[10px] uppercase font-extrabold text-emerald-600 bg-emerald-100/80 px-2 py-0.5 rounded-sm">High Value</span>
                   </div>
                   <p className="text-xs text-slate-500 font-medium leading-relaxed">Your biggest improvement came directly from isolated tracking indicating increased PR frequency.</p>
                 </div>

                 <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl">
                   <div className="flex items-center justify-between mb-2">
                     <span className="font-bold text-slate-800 text-sm">Consistency Shift</span>
                     <span className="text-[10px] uppercase font-extrabold text-blue-600 bg-blue-100/80 px-2 py-0.5 rounded-sm">Improving</span>
                   </div>
                   <p className="text-xs text-slate-500 font-medium leading-relaxed">Consistency scaled dynamically up by 26% natively preventing overall velocity drops.</p>
                 </div>

              </div>
           </motion.div>

           {/* Weak Growth Areas */}
           <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-md rounded-[24px] shadow-sm border border-slate-100 p-6 flex flex-col justify-between">
              <h3 className="font-bold text-slate-800 mb-5 flex items-center gap-2">
                 <AlertTriangle size={18} className="text-amber-500" /> Action Required
              </h3>
              
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl">
                <p className="text-sm font-bold text-amber-800 leading-relaxed text-center">
                   Efficiency growth is scaling slower comparatively — Needs attention.
                </p>
              </div>
           </motion.div>

        </div>
      </div>
    </motion.div>
  );
}
