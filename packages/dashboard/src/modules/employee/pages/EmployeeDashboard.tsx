import { motion, Variants } from 'framer-motion';
import { Target, Activity, Cpu, Star, CheckCircle2, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const growthData = [
  { name: 'Mon', score: 82 },
  { name: 'Tue', score: 83 },
  { name: 'Wed', score: 85 },
  { name: 'Thu', score: 84 },
  { name: 'Fri', score: 88 },
  { name: 'Sat', score: 89 },
  { name: 'Sun', score: 91 },
];

export default function EmployeeDashboard() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Left Column (Main Content) */}
      <div className="space-y-8">
        
        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Hero Skill Score Card */}
          <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-md rounded-[20px] shadow-sm border border-slate-100 p-8 flex flex-col justify-center relative overflow-hidden group">
            <div className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Your Skill Score</div>
            <div className="flex items-end gap-4">
              <span className="text-[64px] leading-none font-black text-slate-800">91</span>
              <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full mb-2">
                <TrendingUp size={16} className="mr-1" />
                <span className="text-sm font-bold">+5 this week</span>
              </div>
            </div>
            {/* Subtle background decoration */}
            <div className="absolute -right-6 -bottom-6 opacity-5 group-hover:scale-110 transition-transform duration-700">
               <Star size={140} />
            </div>
          </motion.div>

          {/* Skill Breakdown Horizontal Bars */}
          <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-md rounded-[20px] shadow-sm border border-slate-100 p-6 flex flex-col justify-between">
             <div className="text-sm font-semibold text-slate-800 mb-4">Core Dimensions</div>
             <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
                    <span>Activity Velocity</span>
                    <span>88%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-green-500 h-2.5 rounded-full w-[88%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
                    <span>Code Efficiency</span>
                    <span>94%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-blue-500 h-2.5 rounded-full w-[94%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
                    <span>Consistency</span>
                    <span>76%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-amber-500 h-2.5 rounded-full w-[76%]" />
                  </div>
                </div>
             </div>
          </motion.div>
        </div>

        {/* Growth Chart Section */}
        <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-md rounded-[20px] shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-slate-800">Growth Velocity</h3>
            <select className="bg-slate-50 border border-slate-100 text-xs font-medium text-slate-600 rounded-full px-3 py-1.5 outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
                <Tooltip 
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}
                   itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                />
                <Line type="monotone" dataKey="score" stroke="#22c55e" strokeWidth={4} dot={{ r: 4, fill: '#22c55e', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Submissions Table Section */}
        <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-md rounded-[20px] shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800">Recent Submissions (GitHub & Jira)</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50/50 text-slate-500 uppercase font-medium text-xs">
                <tr>
                  <th className="px-6 py-4">Repository / Issue</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-center">AI Confidence</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium flex items-center gap-3">
                    <FolderGit2 size={16} className="text-blue-500" />
                    <span>api-gateway-refactor</span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">Today, 2:45 PM</td>
                  <td className="px-6 py-4 text-center"><span className="font-bold text-slate-800">94%</span></td>
                  <td className="px-6 py-4"><span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-50 text-green-700 text-xs font-semibold"><CheckCircle2 size={14}/> Scored</span></td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium flex items-center gap-3">
                    <Activity size={16} className="text-blue-500" />
                    <span>JIRA PROJ-102: Migrate Cache</span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">Yesterday</td>
                  <td className="px-6 py-4 text-center"><span className="font-bold text-slate-800">89%</span></td>
                  <td className="px-6 py-4"><span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-50 text-green-700 text-xs font-semibold"><CheckCircle2 size={14}/> Scored</span></td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium flex items-center gap-3">
                    <FolderGit2 size={16} className="text-blue-500" />
                    <span>frontend-dashboard-ui</span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">Apr 2, 2026</td>
                  <td className="px-6 py-4 text-center"><span className="font-bold text-slate-800">98%</span></td>
                  <td className="px-6 py-4"><span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-50 text-green-700 text-xs font-semibold"><CheckCircle2 size={14}/> Scored</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Right Column (Learning Path & Target Panel) */}
      <div className="space-y-6">
        
        {/* Identified Gaps Section */}
        <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-md rounded-[20px] shadow-sm border border-slate-100 p-6">
           <h3 className="font-semibold text-slate-800 mb-5">Skill Gaps & Focus Areas</h3>
           <div className="space-y-5">
              <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-xl">
                 <div className="flex items-center justify-between font-semibold text-slate-800 mb-2">
                   <span className="flex items-center gap-2"><Target size={16} className="text-amber-500" /> System Design</span>
                   <span className="text-xs text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">Gap Identified</span>
                 </div>
                 <div className="w-full bg-amber-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-amber-500 h-1.5 rounded-full w-[45%]" />
                 </div>
                 <p className="text-xs text-slate-500 mt-2 font-medium">45% mastery threshold</p>
              </div>
              
              <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl">
                 <div className="flex items-center justify-between font-semibold text-slate-800 mb-2">
                   <span className="flex items-center gap-2"><Cpu size={16} className="text-blue-500" /> AWS Infrastructure</span>
                   <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">Improving</span>
                 </div>
                 <div className="w-full bg-blue-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-blue-500 h-1.5 rounded-full w-[70%]" />
                 </div>
                 <p className="text-xs text-slate-500 mt-2 font-medium">70% mastery threshold</p>
              </div>
           </div>
        </motion.div>

        {/* Personalized Learning Path */}
        <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-md rounded-[20px] shadow-sm border border-slate-100 p-6">
           <h3 className="font-semibold text-slate-800 mb-5">Personalized Path</h3>
           <div className="relative border-l-2 border-slate-100 ml-3 space-y-6">
             <div className="relative pl-6">
               <div className="absolute -left-[9px] top-0.5 h-4 w-4 rounded-full bg-green-500 border-4 border-white shadow-sm" />
               <h4 className="text-sm font-bold text-slate-800">Advanced DB Caching</h4>
               <p className="text-xs text-slate-500 mt-1 mb-2">Recommended based on PR #1042 inefficiencies.</p>
               <span className="inline-block text-[10px] font-bold tracking-wider uppercase text-slate-400 bg-slate-100 px-2 py-1 rounded-md">2 Hours</span>
             </div>
             
             <div className="relative pl-6">
               <div className="absolute -left-[9px] top-0.5 h-4 w-4 rounded-full bg-white border-4 border-slate-200 shadow-sm" />
               <h4 className="text-sm font-bold text-slate-800">Rate Limiting Strategies</h4>
               <p className="text-xs text-slate-500 mt-1 mb-2">Next up in System Design track.</p>
               <span className="inline-block text-[10px] font-bold tracking-wider uppercase text-slate-400 bg-slate-100 px-2 py-1 rounded-md">1.5 Hours</span>
             </div>

             <div className="relative pl-6">
               <div className="absolute -left-[9px] top-0.5 h-4 w-4 rounded-full bg-white border-4 border-slate-200 shadow-sm" />
               <h4 className="text-sm font-bold text-slate-800">Kubernetes 101</h4>
               <p className="text-xs text-slate-500 mt-1">Foundational AWS gap filler.</p>
             </div>
           </div>
           
           <button className="w-full mt-6 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 transition-colors">
              View Full Path
           </button>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Ensure FolderGit2 icon is available for table
import { FolderGit2 } from 'lucide-react';
