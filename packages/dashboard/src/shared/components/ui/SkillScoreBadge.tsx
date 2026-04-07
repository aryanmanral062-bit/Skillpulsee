export default function SkillScoreBadge({ score, size = 'md' }: { score: number, size?: 'sm'|'md'|'lg' }) {
  let color = 'bg-red-100 text-red-700 border-red-200';
  if (score >= 80) color = 'bg-green-100 text-green-700 border-green-200';
  else if (score >= 60) color = 'bg-amber-100 text-amber-700 border-amber-200';

  const sizeClasses = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-16 h-16 text-xl',
    lg: 'w-24 h-24 text-3xl'
  };

  return (
    <div className={`inline-flex items-center justify-center rounded-full font-bold border ${color} ${sizeClasses[size]}`}>
      {Math.round(score)}
    </div>
  );
}
