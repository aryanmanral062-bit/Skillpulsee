import React from 'react';

export default function LearningPathCard({ steps }: { steps: string[] }) {
  if (!steps || steps.length === 0) return <div className="text-sm text-slate-400">Path not determined yet.</div>;
  
  return (
    <div className="relative border-l-2 border-slate-100 ml-3 space-y-6">
      {steps.map((step, index) => (
         <div key={index} className="relative pl-6">
           <div className={`absolute -left-[9px] top-0.5 h-4 w-4 rounded-full border-4 shadow-sm ${index === 0 ? 'bg-[#2C5AFF] border-white' : 'bg-white border-slate-200'}`} />
           <h4 className="text-sm font-bold text-slate-800">{step}</h4>
         </div>
      ))}
    </div>
  );
}
