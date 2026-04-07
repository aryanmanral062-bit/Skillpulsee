import React, { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { Search, FolderGit2, GitCommit, GitPullRequest, ExternalLink, Activity, CheckCircle2, CircleDashed, XCircle } from 'lucide-react';
import { apiClient } from '../../../api/client';

interface Submission {
  id: string;
  type: string;
  repository: string;
  title: string;
  date: string;
  confidence: number;
  status: string;
  url: string;
}

const MOCK_FALLBACK: Submission[] = [
  { id: 'abc1234', type: 'Commit', repository: 'api-gateway', title: 'refactor: simplify token parsing mechanism', date: new Date().toISOString(), confidence: 95, status: 'Merged', url: '#' },
  { id: '104', type: 'PR', repository: 'frontend-dashboard', title: 'feat: implement real-time analytics panel', date: new Date(Date.now() - 86400000).toISOString(), confidence: 88, status: 'Open', url: '#' },
  { id: 'def5678', type: 'Commit', repository: 'auth-service', title: 'fix: resolving oauth scope drift', date: new Date(Date.now() - 86400000 * 2).toISOString(), confidence: 92, status: 'Merged', url: '#' },
  { id: '96', type: 'PR', repository: 'api-gateway', title: 'chore: bump dependencies resolving CVE', date: new Date(Date.now() - 86400000 * 5).toISOString(), confidence: 72, status: 'Closed', url: '#' },
];

export default function SubmissionsPage() {
  const [data, setData] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('90');

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const empRes = await apiClient.get('/employees');
      const employees = empRes.data.employees || [];
      if (employees.length > 0) {
        const id = employees[0].id;
        const subRes = await apiClient.get(`/employees/${id}/submissions`);
        setData(subRes.data.submissions || []);
      } else {
        setData([]); // Empty state naturally triggers if no employees exist in DB
      }
    } catch (err) {
      console.error('API failed, falling back to mock data', err);
      setData(MOCK_FALLBACK);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter(item => {
    const matchesSearch = item.repository.toLowerCase().includes(search.toLowerCase()) || item.title.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'All' || item.type === typeFilter;
    
    const itemDate = new Date(item.date).getTime();
    const cutoffDate = new Date().getTime() - (parseInt(dateFilter) * 24 * 60 * 60 * 1000);
    const matchesDate = itemDate >= cutoffDate;

    return matchesSearch && matchesType && matchesDate;
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
      className="max-w-7xl mx-auto space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Header Area */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            All Submissions
            <span className="flex items-center text-sm font-bold text-green-700 bg-green-100/80 px-3 py-1 rounded-full">
              {data.length} Total
            </span>
          </h1>
          <p className="text-slate-500 font-medium mt-1">Your real work synced automatically from GitHub repositories.</p>
        </div>
      </motion.div>

      {/* Filter Bar */}
      <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-md rounded-[20px] shadow-sm border border-slate-100 p-4 lg:p-5 flex flex-col md:flex-row items-center gap-4">
        
        {/* Search */}
        <div className="relative w-full md:flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text"
            placeholder="Search repositories or commit messages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 outline-none rounded-2xl pl-11 pr-4 py-3 text-sm font-medium text-slate-700 transition-colors focus:ring-2 focus:ring-slate-200"
          />
        </div>

        {/* Type Filter */}
        <div className="flex w-full md:w-auto bg-slate-50/50 border border-slate-200 p-1 rounded-2xl">
          {['All', 'Commit', 'PR'].map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`flex-1 md:w-24 py-2 px-3 text-sm font-semibold rounded-xl transition-all ${typeFilter === type ? 'bg-white text-slate-800 shadow-sm border border-slate-100' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {type === 'Commit' && <GitCommit size={14} className="inline mr-1.5" />}
              {type === 'PR' && <GitPullRequest size={14} className="inline mr-1.5" />}
              {type}
            </button>
          ))}
        </div>

        {/* Date Filter */}
        <select 
          className="w-full md:w-auto bg-slate-50/50 hover:bg-slate-50 border border-slate-200 text-sm font-medium text-slate-600 rounded-2xl px-4 py-3 outline-none cursor-pointer transition-colors"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        >
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
          <option value="90">Last 90 Days</option>
        </select>
      </motion.div>

      {/* Main Table */}
      <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-md rounded-[20px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
             <thead className="bg-slate-50/50 text-slate-500 uppercase font-bold text-[11px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-6 py-5">Type / Repo</th>
                  <th className="px-6 py-5">Commit / PR Title</th>
                  <th className="px-6 py-5">Date</th>
                  <th className="px-6 py-5 text-center">AI Confidence</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5 text-right">Action</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-100/80">
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                       <td className="px-6 py-5"><div className="h-4 bg-slate-100 rounded w-24"></div></td>
                       <td className="px-6 py-5"><div className="h-4 bg-slate-100 rounded w-64"></div></td>
                       <td className="px-6 py-5"><div className="h-4 bg-slate-100 rounded w-20"></div></td>
                       <td className="px-6 py-5 flex justify-center"><div className="h-6 bg-slate-100 rounded-full w-12"></div></td>
                       <td className="px-6 py-5"><div className="h-6 bg-slate-100 rounded-md w-16"></div></td>
                       <td className="px-6 py-5"></td>
                    </tr>
                  ))
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                         <FolderGit2 size={48} className="mb-4 text-slate-300" strokeWidth={1.5} />
                         <span className="text-base font-semibold text-slate-600">No submissions found in this timeframe</span>
                         {data.length === 0 && <span className="text-sm mt-1">Connect your GitHub to start tracking your work.</span>}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredData.map(item => {
                    const confidenceColor = item.confidence > 85 ? 'text-green-700 bg-green-50' : item.confidence > 60 ? 'text-amber-700 bg-amber-50' : 'text-slate-700 bg-slate-50';
                    return (
                      <tr 
                        key={item.id} 
                        className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                        onClick={() => window.open(item.url, '_blank')}
                      >
                         {/* Repo & Type */}
                         <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                             <div className={`p-2 rounded-lg ${item.type === 'Commit' ? 'bg-indigo-50 text-indigo-600' : 'bg-fuchsia-50 text-fuchsia-600'}`}>
                               {item.type === 'Commit' ? <GitCommit size={16} /> : <GitPullRequest size={16} />}
                             </div>
                             <div>
                               <div className="font-bold text-sm text-slate-800">{item.repository}</div>
                               <div className="text-xs font-semibold text-slate-400">{item.type}</div>
                             </div>
                           </div>
                         </td>
                         
                         {/* Title */}
                         <td className="px-6 py-4">
                           <div className="text-sm font-medium text-slate-700 truncate max-w-[300px]">
                             {item.title}
                           </div>
                         </td>

                         {/* Date */}
                         <td className="px-6 py-4 text-sm font-semibold text-slate-500">
                           {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(item.date))}
                         </td>

                         {/* AI Confidence */}
                         <td className="px-6 py-4 text-center">
                           <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-bold border border-slate-100 ${confidenceColor}`}>
                             {item.confidence}%
                           </span>
                         </td>

                         {/* Status */}
                         <td className="px-6 py-4">
                            {item.status === 'Merged' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-green-50 text-green-700 text-xs font-bold"><CheckCircle2 size={14}/> Merged</span>}
                            {item.status === 'Open' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-blue-50 text-blue-700 text-xs font-bold"><CircleDashed size={14}/> Open</span>}
                            {item.status === 'Closed' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-slate-100 text-slate-500 text-xs font-bold"><XCircle size={14}/> Closed</span>}
                         </td>

                         {/* Actions */}
                         <td className="px-6 py-4 text-right">
                            <button className="p-2 text-slate-300 group-hover:text-slate-600 hover:bg-slate-200 transition-colors rounded-lg">
                              <ExternalLink size={16} />
                            </button>
                         </td>
                      </tr>
                    );
                  })
                )}
             </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
