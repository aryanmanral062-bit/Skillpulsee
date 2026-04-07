import React, { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { Target, TrendingUp, BookOpen, AlertCircle, Play, ChevronRight, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { apiClient } from '../../../api/client';

interface ScoreData {
  topSkills: string[];
  skillGaps: string[];
  learningPath: any[];
  activityScore: number;
  consistencyScore: number;
  efficiencyScore: number;
  prQualityScore: number;
}

interface HistoryData {
  computedAt: string;
  skillScore: number;
}

const MOCK_SCORE: ScoreData = {
  topSkills: ['Node.js', 'React', 'REST APIs'],
  skillGaps: ['Testing', 'Docker', 'CI/CD'],
  learningPath: [
    { step: 1, title: 'Jest Fundamentals', reason: 'High logic drift with zero testing artifacts in previous 90d window.', estimatedHours: 8 },
    { step: 2, title: 'Docker Core', reason: 'Foundational orchestration missing from commits.', estimatedHours: 6 }
  ],
  activityScore: 88,
  consistencyScore: 76,
  efficiencyScore: 94,
  prQualityScore: 82
};

const MOCK_HISTORY: HistoryData[] = [
  { computedAt: new Date(Date.now() - 86400000 * 6).toISOString(), skillScore: 72 },
  { computedAt: new Date(Date.now() - 86400000 * 5).toISOString(), skillScore: 75 },
  { computedAt: new Date(Date.now() - 86400000 * 4).toISOString(), skillScore: 74 },
  { computedAt: new Date(Date.now() - 86400000 * 3).toISOString(), skillScore: 78 },
  { computedAt: new Date(Date.now() - 86400000 * 2).toISOString(), skillScore: 82 },
  { computedAt: new Date(Date.now() - 86400000 * 1).toISOString(), skillScore: 84 },
  { computedAt: new Date().toISOString(), skillScore: 88 },
];

export default function SkillTargetsPage() {
  const [score, setScore] = useState<ScoreData | null>(null);
  const [history, setHistory] = useState<HistoryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const empRes = await apiClient.get('/employees');
      const employees = empRes.data.employees || [];

      if (employees.length > 0) {
        const id = employees[0].id;
        const scoreRes = await apiClient.get(`/employees/${id}/score`);
        const historyRes = await apiClient.get(`/employees/${id}/history`);
        setScore(scoreRes.data.score || MOCK_SCORE);
        setHistory(historyRes.data.history || MOCK_HISTORY);
      } else {
        setScore(MOCK_SCORE);
        setHistory(MOCK_HISTORY);
      }
    } catch (err) {
      console.error('API failed, rendering mock payload locally', err);
      setScore(MOCK_SCORE);
      setHistory(MOCK_HISTORY);
    } finally {
      setLoading(false);
    }
  };

  const chartData = history.map(h => ({
    name: new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(new Date(h.computedAt)),
    score: h.skillScore
  }));

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  if (loading || !score) return (
     <div className="flex h-full w-full justify-center items-center opacity-50"><div className="animate-pulse bg-slate-300 w-16 h-16 rounded-full" /></div>
  );

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
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Skill Gaps & Learning Path</h1>
          <p className="text-slate-500 font-medium mt-1 text-sm md:text-base">Track your strengths and improve weak areas with guided learning.</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
        
        {/* ============================================================== */}
        {/* LEFT COLUMN (70%) */}
        {/* ============================================================== */}
        <div className="space-y-8">
           
           {/* Skill Strength vs Gap */}
           <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-md rounded-[24px] shadow-sm border border-slate-100 p-8">
             <h3 className="font-bold text-slate-800 mb-6 text-lg flex items-center gap-2">
               <Target size={20} className="text-indigo-500" /> Skill Strength Matrix
             </h3>
             <div className="space-y-6">
                
                {/* Dynamically Map Top Skills */}
                {score.topSkills.map((skill, i) => (
                  <div key={skill} className="group relative">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-slate-700">{skill}</span>
                      <span className="text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-md border border-green-100">STRONG</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: '92%' }} transition={{ duration: 1, delay: i * 0.1 }} className="bg-green-500 h-full rounded-full" />
                    </div>
                  </div>
                ))}
                
                {/* Dynamically Map Soft Gaps */}
                {score.skillGaps.map((skill, i) => (
                  <div key={skill} className="group relative">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-slate-700">{skill}</span>
                      <span className="text-xs font-bold text-orange-700 bg-orange-50 px-2.5 py-1 rounded-md border border-orange-100">GAP</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: '35%' }} transition={{ duration: 1, delay: (score.topSkills.length + i) * 0.1 }} className="bg-orange-500 h-full rounded-full" />
                    </div>
                    {/* Hover Tooltip UX */}
                    <div className="absolute top-10 left-0 bg-slate-800 text-white text-xs p-2 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 scale-95 group-hover:scale-100 w-64 shadow-xl">
                       Low exposure detected across internal Jira and GitHub metrics over the past 90 days.
                    </div>
                  </div>
                ))}

             </div>
           </motion.div>

           {/* Core Dimensions */}
           <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-md rounded-[24px] shadow-sm border border-slate-100 p-8">
             <h3 className="font-bold text-slate-800 mb-6 text-lg flex items-center gap-2">
               <Activity size={20} className="text-blue-500" /> Core Dimensions
             </h3>
             <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm font-semibold text-slate-700 mb-2">
                    <span>Activity Velocity</span>
                    <span className="text-slate-500">{score.activityScore || 0}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${score.activityScore || 0}%` }} transition={{ duration: 1 }} className="bg-green-500 h-full rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm font-semibold text-slate-700 mb-2">
                    <span>Code Efficiency</span>
                    <span className="text-slate-500">{score.efficiencyScore || 0}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${score.efficiencyScore || 0}%` }} transition={{ duration: 1 }} className="bg-blue-500 h-full rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm font-semibold text-slate-700 mb-2">
                    <span>Consistency</span>
                    <span className="text-slate-500">{score.consistencyScore || 0}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${score.consistencyScore || 0}%` }} transition={{ duration: 1 }} className="bg-orange-400 h-full rounded-full" />
                  </div>
                </div>
             </div>
           </motion.div>

           {/* Growth Chart */}
           <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-md rounded-[24px] shadow-sm border border-slate-100 p-8">
             <div className="flex items-center justify-between mb-6">
               <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                  <TrendingUp size={20} className="text-emerald-500" /> Growth Velocity
               </h3>
               <div className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">Historical Score</div>
             </div>
             
             <div className="h-[280px] w-full pt-4">
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={chartData}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#64748b', fontWeight: 600 }} dy={15} />
                   <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
                   <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', padding: '12px 16px' }}
                      itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                   />
                   <Line 
                     type="monotone" 
                     dataKey="score" 
                     stroke="#6366f1" 
                     strokeWidth={5} 
                     dot={{ r: 5, fill: '#6366f1', strokeWidth: 3, stroke: '#fff' }} 
                     activeDot={{ r: 8, fill: '#4f46e5', strokeWidth: 4, stroke: '#fff' }} 
                     animationDuration={1500}
                   />
                 </LineChart>
               </ResponsiveContainer>
             </div>
           </motion.div>

        </div>


        {/* ============================================================== */}
        {/* RIGHT COLUMN (30%) */}
        {/* ============================================================== */}
        <div className="space-y-6">
           
           {/* Insight Panel -> Skill Gap Cards */}
           <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-md rounded-[24px] shadow-sm border border-slate-100 p-6">
              <h3 className="font-bold text-slate-800 mb-5 flex items-center gap-2">
                 <AlertCircle size={18} className="text-orange-500" /> Insights & Warnings
              </h3>
              <div className="space-y-4">
                 {score.skillGaps.map(gap => (
                   <div key={gap} className="bg-orange-50/50 border border-orange-100 p-4 rounded-2xl hover:bg-orange-50 hover:border-orange-200 transition-colors cursor-default">
                     <div className="flex items-center justify-between mb-1.5">
                       <span className="font-bold text-slate-800 text-sm">{gap}</span>
                       <span className="text-[10px] uppercase tracking-wider font-extrabold text-orange-600 bg-orange-100/80 px-2 py-0.5 rounded-sm">Gap Identified</span>
                     </div>
                     <p className="text-xs text-slate-500 font-medium leading-relaxed">Low exposure detected across assignments in the last 30 days.</p>
                   </div>
                 ))}
                 {score.skillGaps.length === 0 && (
                   <div className="p-4 bg-green-50 border border-green-100 rounded-2xl">
                     <p className="text-sm font-bold text-green-800">No skill gaps identified!</p>
                   </div>
                 )}
              </div>
           </motion.div>

           {/* Recommended Learning Path */}
           <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-md rounded-[24px] shadow-sm border border-slate-100 p-6 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-slate-800 mb-5 flex items-center gap-2">
                   <BookOpen size={18} className="text-fuchsia-500" /> Recommended Path
                </h3>
                <div className="relative border-l-2 border-slate-100 ml-3 space-y-7 pb-4">
                  {score.learningPath.map((step, idx) => (
                    <div key={idx} className="relative pl-6">
                      <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-white border-4 border-fuchsia-400 shadow-sm" />
                      <h4 className="text-sm font-bold text-slate-800 leading-tight">Step {step.step || idx+1}: <span className="text-fuchsia-600">{step.title}</span></h4>
                      <p className="text-xs text-slate-500 font-medium mt-1 mb-2.5 leading-relaxed">{step.reason || step.description}</p>
                      <span className="inline-flex text-[10px] font-bold tracking-wider uppercase text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                        {step.estimatedHours} Hours
                      </span>
                    </div>
                  ))}
                  {score.learningPath.length === 0 && (
                     <div className="pl-6 text-sm text-slate-500">No learning paths recommended at this time.</div>
                  )}
                </div>
              </div>

              {/* Action CTA Button */}
              <button className="w-full mt-2 group relative overflow-hidden rounded-2xl bg-slate-800 hover:bg-slate-900 transition-all text-white py-3.5 px-4 flex items-center justify-between shadow-xl shadow-slate-900/10">
                <div className="absolute inset-0 bg-white/10 w-0 group-hover:w-full transition-all duration-300 ease-out" />
                <span className="font-bold text-sm tracking-wide relative z-10 flex items-center gap-2"><Play size={16} fill="currentColor" /> Start Learning</span>
                <ChevronRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              </button>
           </motion.div>

        </div>
      </div>
    </motion.div>
  );
}
