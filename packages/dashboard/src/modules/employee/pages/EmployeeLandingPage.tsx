import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function EmployeeLandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center pt-8">
      
      {/* Top Navbar */}
      <nav className="w-full max-w-[1200px] px-8 h-16 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
             <div className="w-4 h-4 bg-white rounded-full opacity-90" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-800">SkillPulse</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
          <span className="hover:text-slate-900 cursor-pointer transition-colors">Analysis</span>
          <span className="text-slate-900 cursor-pointer">Dashboard</span>
          <span className="hover:text-slate-900 cursor-pointer transition-colors">Pricing</span>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/employee/dashboard')}
            className="px-6 py-2.5 bg-green-600 text-white text-sm font-medium rounded-full hover:bg-green-700 transition-colors shadow-sm"
          >
            Dashboard
          </button>
          <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden cursor-pointer">
             <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('https://i.pravatar.cc/100?img=33')" }} />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 w-full max-w-[1000px] mt-24 px-4 flex flex-col items-center text-center z-20">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
        >
          <div className="text-green-600 text-sm font-medium uppercase tracking-widest mb-6">Master Your Craft</div>
          <h1 className="text-5xl md:text-[64px] leading-[1.1] font-bold text-slate-800 tracking-tight mb-8">
            Track Your Skills. <br/> Improve Faster.
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Get real insights from your work and grow with a personalized path. Connect your Jira and GitHub to automatically discover your skill gaps.
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <button 
              onClick={() => navigate('/employee/dashboard')}
              className="px-8 py-3.5 bg-green-600 text-white text-md font-medium rounded-full hover:-translate-y-0.5 hover:shadow-xl transition-all"
            >
              View My Skills
            </button>
          </div>
        </motion.div>
      </main>

      {/* Embedded Dashboard Preview Layer to match the overarching design context */}
      <motion.div 
        className="mt-20 w-full max-w-[1200px] h-[400px] bg-white/70 backdrop-blur-3xl shadow-soft-2xl border border-white rounded-t-[32px] overflow-hidden relative z-10 flex cursor-pointer hover:shadow-[0_60px_120px_-20px_rgba(0,0,0,0.1)] transition-shadow duration-700"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
        onClick={() => navigate('/employee/dashboard')}
      >
         <div className="w-64 border-r border-slate-100 p-6 flex flex-col gap-2 hidden md:flex">
            <div className="h-10 bg-slate-100/50 rounded-full w-full mb-8"></div>
            <div className="h-10 bg-green-500 rounded-full w-full opacity-90 shadow-sm"></div>
            <div className="h-10 bg-transparent rounded-full w-full"></div>
         </div>
         <div className="flex-1 p-10 bg-slate-50/30">
            <div className="flex gap-6 mb-8">
               <div className="h-40 bg-white flex-1 rounded-2xl shadow-sm border border-slate-50"></div>
               <div className="h-40 bg-white flex-[2] rounded-2xl shadow-sm border border-slate-50"></div>
            </div>
            <div className="flex gap-6">
               <div className="h-64 bg-white flex-[2] rounded-2xl shadow-sm border border-slate-50"></div>
               <div className="h-64 bg-white flex-1 rounded-2xl shadow-sm border border-slate-50"></div>
            </div>
         </div>
         <div className="absolute inset-0 bg-gradient-to-t from-[#F5F7FA] via-transparent to-transparent z-20 pointer-events-none" />
      </motion.div>
    </div>
  );
}
