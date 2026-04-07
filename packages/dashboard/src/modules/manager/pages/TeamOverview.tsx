import { useEffect, useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import { apiClient } from '../../../api/client';
import { Users, TrendingUp, AlertCircle } from 'lucide-react';
import SkillScoreBadge from '../../../shared/components/ui/SkillScoreBadge';
import GapBadge from '../../../shared/components/ui/GapBadge';
import SkillBadge from '../../../shared/components/ui/SkillBadge';

export default function TeamOverview() {
  const [summary, setSummary] = useState<any>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiClient.get('/team/summary'),
      apiClient.get('/employees')
    ]).then(([res1, res2]) => {
      setSummary(res1.data);
      setEmployees(res2.data.employees);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-12 text-center text-slate-500 animate-pulse">Loading dashboard...</div>;

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
      className="space-y-6 pt-2"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Quick Action Alert Banner */}
      <motion.div variants={itemVariants} className="w-full bg-white/60 backdrop-blur-md rounded-2xl shadow-sm border border-slate-100 p-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center text-white shrink-0">
             <AlertCircle size={20} />
          </div>
          <div>
            <h3 className="text-slate-900 font-semibold text-sm">Dear Manager</h3>
            <p className="text-slate-500 text-sm">We have observed top performance signals across your engineering division.</p>
          </div>
        </div>
        <button className="px-5 py-2 bg-[#2C5AFF] text-white text-sm font-medium rounded-full hover:bg-blue-700 transition-colors shadow-sm">
          View Detail
        </button>
      </motion.div>

      {/* Metrics Row mapping perfectly to reference boxes */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-sm border border-slate-100 p-5">
          <div className="flex justify-between items-center mb-4">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active Employees</div>
            <Users size={16} className="text-slate-400" />
          </div>
          <div className="flex items-center gap-3">
             <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center"><Users size={14} className="text-slate-600"/></div>
             <div className="text-2xl font-bold text-slate-800">{summary?.teamSize || 0}</div>
          </div>
        </div>
        {/* Metric 2 */}
        <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-sm border border-slate-100 p-5">
          <div className="flex justify-between items-center mb-4">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Avg Skill Score</div>
            <TrendingUp size={16} className="text-slate-400" />
          </div>
          <div className="flex items-center gap-3">
             <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center"><TrendingUp size={14} className="text-slate-600"/></div>
             <div className="text-2xl font-bold text-slate-800">{summary?.avgSkillScore || 0}%</div>
          </div>
        </div>
        {/* Metric 3 */}
        <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-sm border border-slate-100 p-5">
          <div className="flex justify-between items-center mb-4">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Gaps Tracked</div>
            <AlertCircle size={16} className="text-slate-400" />
          </div>
          <div className="flex items-center gap-3">
             <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                <span className="font-bold text-slate-600 text-xs">{(summary?.commonGaps || []).length}</span>
             </div>
             <div className="text-sm font-semibold text-slate-800 truncate">
               {(summary?.commonGaps || []).slice(0, 2).join(', ') || 'None'}
             </div>
          </div>
        </div>
        {/* Metric 4 */}
        <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-sm border border-slate-100 p-5">
          <div className="flex justify-between items-center mb-4">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Target Sync</div>
            <span className="text-slate-400 text-xs">%</span>
          </div>
          <div className="flex items-center gap-3">
             <div className="text-2xl font-bold text-slate-800">100.00%</div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-white/60 backdrop-blur-md rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-lg font-semibold text-slate-800">Team Roster</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 uppercase font-medium text-xs">
              <tr>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4 text-center">Score</th>
                <th className="px-6 py-4">Top Skills</th>
                <th className="px-6 py-4">Required Focus</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.map(emp => (
                <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">{emp.name || emp.email}</div>
                    <div className="text-slate-500 text-xs mt-0.5">{emp.email} • {emp.githubLogin || 'No GitHub'}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {emp.latestScore ? (
                      <SkillScoreBadge score={emp.latestScore.skillScore} size="sm" />
                    ) : (
                      <span className="text-slate-400 italic">No Data</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                       {emp.latestScore?.topSkills?.slice(0, 2).map((s: string) => <SkillBadge key={s} skill={s} />)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex flex-wrap gap-2">
                       {emp.latestScore?.skillGaps?.slice(0, 2).map((g: string) => <GapBadge key={g} gap={g} />)}
                     </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link to={`/employees/${emp.id}`} className="text-blue-600 font-medium hover:text-blue-700 hover:underline">
                      View details
                    </Link>
                  </td>
                </tr>
              ))}
              {employees.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No employees found. Seed the database to continue.
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
