import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { MessageSquare, AlertCircle, CheckCircle2, ChevronRight, Filter } from 'lucide-react';

const MOCK_INBOX = [
  {
    id: 1,
    employeeName: "Alex Chen",
    type: "Evaluation Dispute",
    message: "My consistency score dropped by 14% this week but I pushed code every day. Can we review the activity metrics algorithm together?",
    timestamp: "2 hours ago",
    status: "Pending"
  },
  {
    id: 2,
    employeeName: "Sarah Jenkins",
    type: "Training Issue",
    message: "The recommended path 'Docker Core' requires AWS permissions I don't currently have. Can you approve the IAM boundary request?",
    timestamp: "5 hours ago",
    status: "Pending"
  },
  {
    id: 3,
    employeeName: "Marcus Torres",
    type: "Incorrect Skill Score",
    message: "I completed the React frontend migration but it seems the repo connection wasn't tracking properly on my history curve?",
    timestamp: "Yesterday",
    status: "Resolved"
  }
];

export default function InboxPage() {
  const [filter, setFilter] = useState('All');

  const filteredMsgs = MOCK_INBOX.filter(msg => {
    if (filter === 'All') return true;
    return msg.status === filter;
  });

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
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Management Inbox</h1>
          <p className="text-slate-500 font-medium mt-1 text-sm md:text-base">Support your team exactly when they hit roadblocks.</p>
        </div>
        <div className="flex bg-white/70 backdrop-blur-md p-1 rounded-xl shadow-sm border border-slate-100">
           {['All', 'Pending', 'Resolved'].map(f => (
             <button 
               key={f}
               onClick={() => setFilter(f)}
               className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-colors ${filter === f ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
             >
               {f}
             </button>
           ))}
        </div>
      </motion.div>

      {/* Main Inbox Wrapper */}
      <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-md rounded-[24px] shadow-sm border border-slate-100 overflow-hidden min-h-[500px]">
         {filteredMsgs.length === 0 ? (
            <div className="flex flex-col h-full w-full justify-center items-center py-32 text-slate-400">
               <MessageSquare size={48} className="mb-4 text-slate-300" strokeWidth={1} />
               <span className="font-semibold text-slate-600">No active messages in this state.</span>
            </div>
         ) : (
            <div className="divide-y divide-slate-100">
               {filteredMsgs.map((msg, i) => (
                 <div key={msg.id} className="p-6 hover:bg-slate-50/50 transition-colors flex flex-col md:flex-row md:items-start gap-4 md:gap-6 group">
                   
                   {/* Avatar Placeholder */}
                   <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0 text-indigo-700 font-bold text-lg">
                      {msg.employeeName.charAt(0)}
                   </div>

                   {/* Content */}
                   <div className="flex-1 min-w-0">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                           <h3 className="font-bold text-slate-800 text-base">{msg.employeeName}</h3>
                           <span className="text-slate-300 hidden md:inline">•</span>
                           <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{msg.type}</span>
                        </div>
                        <div className="flex items-center gap-3">
                           <span className="text-xs font-semibold text-slate-400">{msg.timestamp}</span>
                           {msg.status === 'Pending' ? (
                             <span className="inline-flex items-center gap-1 bg-orange-50 text-orange-700 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md border border-orange-100"><AlertCircle size={12}/> Pending</span>
                           ) : (
                             <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md border border-green-100"><CheckCircle2 size={12}/> Resolved</span>
                           )}
                        </div>
                      </div>
                      
                      <p className="text-sm font-medium text-slate-600 leading-relaxed max-w-3xl">
                         "{msg.message}"
                      </p>

                      {/* Actions */}
                      <div className="flex items-center gap-2 mt-4">
                         <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 transition-colors px-3 py-1.5 rounded-lg flex items-center">
                            View Details <ChevronRight size={14} className="ml-0.5" />
                         </button>
                         {msg.status === 'Pending' && (
                           <>
                             <button className="text-xs font-bold text-slate-500 hover:text-green-700 hover:bg-green-50 transition-colors px-3 py-1.5 rounded-lg flex items-center">
                               <CheckCircle2 size={14} className="mr-1.5" /> Mark Resolved
                             </button>
                             <button className="text-xs font-bold text-slate-500 hover:text-red-700 hover:bg-red-50 transition-colors px-3 py-1.5 rounded-lg">
                               Escalate
                             </button>
                           </>
                         )}
                      </div>
                   </div>

                 </div>
               ))}
            </div>
         )}
      </motion.div>
    </motion.div>
  );
}
