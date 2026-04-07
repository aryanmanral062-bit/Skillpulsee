export default function GapBadge({ gap }: { gap: string }) {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 shadow-sm">
      {gap}
    </span>
  );
}
