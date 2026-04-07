import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient } from '../../../api/client';
import { ChevronLeft } from 'lucide-react';
import SkillScoreBadge from '../../../shared/components/ui/SkillScoreBadge';
import SubScoreBar from '../../../shared/components/ui/SubScoreBar';
import GapBadge from '../../../shared/components/ui/GapBadge';
import SkillBadge from '../../../shared/components/ui/SkillBadge';
import ScoreHistoryChart from '../../../shared/components/ui/ScoreHistoryChart';
import LearningPathCard from '../../../shared/components/ui/LearningPathCard';

export default function EmployeeDetail() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiClient.get(`/employees/${id}/score`),
      apiClient.get(`/employees/${id}/history`)
    ]).then(([sRes, hRes]) => {
      setData(sRes.data);
      setHistory(hRes.data.history);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="p-12 text-center text-slate-500 animate-pulse">Loading employee data...</div>;

  const { employee, score } = data || {};
  const hasData = score && score.reason !== 'insufficient_data';

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Link to="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
        <ChevronLeft size={16} className="mr-1" /> Back to Team
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-6 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{employee?.name || employee?.email}</h1>
            <div className="text-slate-500 mt-2 flex gap-4 text-sm font-medium">
              <span>{employee?.email}</span>
              {employee?.githubLogin && <span>GitHub: {employee.githubLogin}</span>}
              {employee?.jiraAccountId && <span>Jira: {employee.jiraAccountId}</span>}
            </div>
          </div>
          {hasData && (
             <div className="mt-4 sm:mt-0 text-center">
               <div className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-2">Overall Skill Score</div>
               <SkillScoreBadge score={score.skillScore} size="lg" />
             </div>
          )}
        </div>

        {!hasData ? (
          <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-lg">
            No sufficient activity data found in the last {score?.windowDays || 90} days.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-8">
              <div className="bg-white rounded-xl">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 pb-2 border-b border-slate-50">Competency Breakdown</h3>
                <SubScoreBar label="Activity Volume" score={score.activityScore} />
                <SubScoreBar label="Consistency" score={score.consistencyScore} />
                <SubScoreBar label="Efficiency" score={score.efficiencyScore} />
                <SubScoreBar label="PR Quality" score={score.prQualityScore} />
              </div>
              
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Top Detected Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {score.topSkills?.map((s: string) => <SkillBadge key={s} skill={s} />)}
                  {(!score.topSkills || score.topSkills.length === 0) && <span className="text-sm text-slate-400">None detected</span>}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Targeted Focus Areas</h3>
                <div className="flex flex-wrap gap-2">
                  {score.skillGaps?.map((g: string) => <GapBadge key={g} gap={g} />)}
                  {(!score.skillGaps || score.skillGaps.length === 0) && <span className="text-sm text-slate-400">Target on par with team</span>}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-8">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Performance Trend</h3>
                <div className="rounded-xl border border-slate-100 p-4">
                  {history.length > 0 ? <ScoreHistoryChart data={history} /> : <div className="text-sm text-slate-400 h-32 flex items-center justify-center">Not enough history tracked yet.</div>}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Recommended Learning Path</h3>
                <LearningPathCard steps={score.learningPath || []} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
