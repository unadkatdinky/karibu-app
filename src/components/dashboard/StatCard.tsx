// A single metric tile. Grid of these is the standard dashboard header row.
// Icon badge on top (colour-tinted per stat), Fraunces-style serif value, muted label below.

import type { ReactNode } from 'react';
import { IconTrend, IconTrendDown } from './icons';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;        // small icon element, e.g. <IconCompass />
  iconBg?: string;         // tailwind bg class for the icon tile, e.g. 'bg-[#D4A853]/15'
  iconColor?: string;      // tailwind text class for the icon itself, e.g. 'text-[#D4A853]'
  trend?: string;          // e.g. "+12% this week"
  trendDir?: 'up' | 'down' | 'neutral';
  accent?: string;         // legacy: left border colour, used when no icon is passed
}

export default function StatCard({
  label, value, icon, iconBg = 'bg-[#1C3A2E]/[0.07]', iconColor = 'text-[#1C3A2E]',
  trend, trendDir = 'neutral', accent,
}: StatCardProps) {
  const trendColor =
    trendDir === 'up'   ? 'text-[#2D5A3D]' :
    trendDir === 'down' ? 'text-[#C4522A]' :
                          'text-[#888]';

  return (
    <div
      className="bg-white rounded-2xl p-5 border border-[#1C3A2E]/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
      style={!icon && accent ? { borderLeft: `3px solid ${accent}` } : undefined}
    >
      {icon && (
        <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center mb-3.5 ${iconBg} ${iconColor}`}>
          {icon}
        </div>
      )}
      <p className="font-serif text-[26px] leading-none text-[#1C3A2E] mb-1">{value}</p>
      <p className="text-[12px] text-[#666]">{label}</p>
      {trend && (
        <div className={`flex items-center gap-1.5 text-[12px] font-medium mt-2.5 ${trendColor}`}>
          {trendDir === 'up'   && <IconTrend />}
          {trendDir === 'down' && <IconTrendDown />}
          <span>{trend}</span>
        </div>
      )}
    </div>
  );
}