import React, { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { UserCheck, ShieldAlert, Cpu, CheckCircle2, XCircle, TrendingUp, Sparkles, BrainCircuit } from 'lucide-react';

const MOCK_VALIDATIONS = [
  {
    id: 1,
    employeeName: "Alex Chen",
    role: "Senior Frontend Engineer",
    aiStrengths: ["React Performance", "Design Systems", "Component Architecture"],
    aiGaps: ["End-to-End Testing", "CI/CD Pipeline Configurations"],
    roiCategory: "High Output - Requires Infrastructure Upskill",
    confidence: 94,
    status: "Pending" // Pending, Approved, Rejected
  },
  {
    id: 2,
    employeeName: "Elena Rostova",
    role: "Backend Services",
    aiStrengths: ["Node.js Clustering", "PostgreSQL Optimization"],
    aiGaps: ["Docker Containerization", "Rate Limiting Math"],
    roiCategory: "Stable Core - Monitor Velocity",
    confidence: 88,
    status: "Pending"
  },
  {
    id: 3,
    employeeName: "Marcus Torres",
    role: "Full Stack Engineer",
    aiStrengths: ["API Construction", "UI Routing"],
    aiGaps: ["State Management Drifts"],
    roiCategory: "Rapid Growth Target",
    confidence: 91,
    status: "Pending"
  }
];

export default function AnalyticsPage() {
  const [validations, setValidations] = useState(MOCK_VALIDATIONS);

  const handleAction = (id: number, action: 'Approved' | 'Rejected') => {
    setValidations(prev => 
      prev.map(v => v.id === id ? { ...v, status: action } : v)
    );
  };

  const pendingCount = validations.filter(v => v.status === 'Pending').length;
  const approvedCount = validations.filter(v => v.status === 'Approved').length;

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
  };

  return (
    <motion.div 
      className="max-w-6xl mx-auto space-y-8 pb-12"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Header Area */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
             <BrainCircuit className="text-indigo-600" size={32} /> AI Validation Layer
          </h1>
          <p className="text-slate-500 font-medium mt-1 text-sm md:text-base">Human-in-the-loop approval system. Review AI-generated logic before committing to the employee record.</p>
        </div>
      </motion.div>

      {/* Overview Metrics */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/70 backdrop-blur-md rounded-[20px] shadow-sm border border-slate-100 p-6 flex items-center justify-between">
           <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Queue Pending</div>
              <div className="text-3xl font-black text-slate-800">{pendingCount}</div>
           </div>
           <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500">
             <ShieldAlert size={24} />
           </div>
        </div>
        <div className="bg-white/70 backdrop-blur-md rounded-[20px] shadow-sm border border-slate-100 p-6 flex items-center justify-between">
           <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Human Approved Today</div>
              <div className="text-3xl font-black text-slate-800">{approvedCount}</div>
           </div>
           <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-500">
             <UserCheck size={24} />
           </div>
        </div>
        <div className="bg-gradient-to-br from-indigo-700 to-indigo-900 rounded-[20px] shadow-xl border border-indigo-600 p-6 flex items-center justify-between text-white">
           <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-1">AI Confidence Baseline</div>
              <div className="text-3xl font-black text-white">91%</div>
           </div>
           <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-indigo-200">
             <Cpu size={24} />
           </div>
        </div>
      </motion.div>

      {/* Main Approval Feed */}
      <div className="space-y-6">
         <AnimatePresence>
            {validations.map(assessment => {
              if (assessment.status !== 'Pending') return null;

              return (
                <motion.div 
                  key={assessment.id}
                  variants={itemVariants}
                  exit="exit"
                  className="bg-white/70 backdrop-blur-md rounded-[24px] shadow-sm border border-slate-100 p-6 lg:p-8 flex flex-col md:flex-row gap-8 relative overflow-hidden"
                >
                   {/* Left Side: Avatar & Core Identity */}
                   <div className="w-full md:w-64 flex-shrink-0 flex flex-col items-center justify-center p-6 bg-slate-50/50 rounded-2xl border border-slate-100/50">
                      <div className="w-20 h-20 rounded-full bg-indigo-100 text-indigo-700 font-bold text-2xl flex items-center justify-center mb-4">
                         {assessment.employeeName.charAt(0)}
                      </div>
                      <h3 className="text-lg font-black text-slate-800 text-center">{assessment.employeeName}</h3>
                      <p className="text-xs font-bold text-slate-400 text-center uppercase tracking-wider mb-4">{assessment.role}</p>
                      
                      <div className="w-full flex items-center justify-between bg-white px-4 py-2 rounded-xl border border-slate-200">
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">AI Conf</span>
                         <span className="text-sm font-black text-indigo-600">{assessment.confidence}%</span>
                      </div>
                   </div>

                   {/* Right Side: AI Analytics Payload */}
                   <div className="flex-1 flex flex-col justify-between pt-2">
                       <div className="space-y-6">
                          
                          {/* Strengths & Gaps Row */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                             <div>
                               <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5"><Sparkles size={14} className="text-green-500" /> AI Strengths Identified</h4>
                               <div className="flex flex-wrap gap-2">
                                 {assessment.aiStrengths.map(s => (
                                   <span key={s} className="bg-green-50 text-green-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-green-100">{s}</span>
                                 ))}
                               </div>
                             </div>
                             <div>
                               <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5"><ShieldAlert size={14} className="text-amber-500" /> AI Growth Gaps Detected</h4>
                               <div className="flex flex-wrap gap-2">
                                 {assessment.aiGaps.map(g => (
                                   <span key={g} className="bg-amber-50 text-amber-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-amber-100">{g}</span>
                                 ))}
                               </div>
                             </div>
                          </div>

                          {/* ROI Category Wrapper */}
                          <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4">
                             <div className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1 flex items-center gap-1.5"><TrendingUp size={12}/> AI Proposed ROI Classification</div>
                             <div className="font-bold text-indigo-900 text-sm">{assessment.roiCategory}</div>
                          </div>
                          
                       </div>

                       {/* Action Pipeline */}
                       <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-slate-100">
                          <button 
                            onClick={() => handleAction(assessment.id, 'Rejected')}
                            className="text-sm font-bold text-slate-500 hover:text-red-700 hover:bg-red-50 transition-colors px-6 py-3 rounded-xl flex items-center gap-2 border border-transparent hover:border-red-100"
                          >
                             <XCircle size={18} /> Modify / Reject
                          </button>
                          <button 
                            onClick={() => handleAction(assessment.id, 'Approved')}
                            className="text-sm font-bold text-white bg-slate-800 hover:bg-slate-900 transition-colors px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-slate-900/10"
                          >
                             <CheckCircle2 size={18} /> Approve AI Profile
                          </button>
                       </div>
                   </div>

                </motion.div>
              );
            })}
         </AnimatePresence>

         {pendingCount === 0 && (
           <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-md rounded-[24px] shadow-sm border border-slate-100 p-12 flex flex-col items-center justify-center">
             <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 size={40} />
             </div>
             <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-2">You're All Caught Up!</h3>
             <p className="text-slate-500 font-medium text-center max-w-md">All AI-generated employee performance assessments have been human-validated successfully.</p>
           </motion.div>
         )}
      </div>

    </motion.div>
  );
}
