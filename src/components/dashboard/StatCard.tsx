// A single metric tile. Grid of these is the standard dashboard header row.
// trend direction drives colour automatically — no prop needed for that.

import { IconTrend, IconTrendDown } from './icons';

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: string;          // e.g. "+12% this week"
  trendDir?: 'up' | 'down' | 'neutral';
  accent?: string;         // optional left border colour e.g. '#D4A853'
}

export default function StatCard({ label, value, trend, trendDir = 'neutral', accent }: StatCardProps) {
  const trendColor =
    trendDir === 'up'   ? 'text-[#2D5A3D]' :
    trendDir === 'down' ? 'text-[#C4522A]' :
                          'text-[#888]';

  return (
    <div
      className="bg-white rounded-2xl p-6 border border-black/5 shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
      style={accent ? { borderLeft: `3px solid ${accent}` } : undefined}
    >
      <p className="text-[11px] uppercase tracking-widest font-semibold text-[#888] mb-3">{label}</p>
      <p className="font-serif text-[36px] leading-none text-[#1C3A2E] mb-3">{value}</p>
      {trend && (
        <div className={`flex items-center gap-1.5 text-[12px] font-medium ${trendColor}`}>
          {trendDir === 'up'   && <IconTrend />}
          {trendDir === 'down' && <IconTrendDown />}
          <span>{trend}</span>
        </div>
      )}
    </div>
  );
}