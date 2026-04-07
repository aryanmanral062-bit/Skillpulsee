import React from 'react';

export default function SubScoreBar({ label, score }: { label: string; score: number }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
        <span>{label}</span>
        <span>{score}%</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
        <div className="bg-[#2C5AFF] h-2.5 rounded-full" style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}
