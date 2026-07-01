// A vertical list of timestamped activity items.
// Used by Admin (system log), Guide (booking events), Traveler (trip notes).

import { IconDot } from './icons';

export interface ActivityItem {
  id: string | number;
  title: string;
  subtitle?: string;
  timestamp: string;
  // Maps to StatusBadge's status key for the dot colour
  dotColor?: string; // any tailwind text colour class e.g. 'text-[#D4A853]'
}

interface ActivityFeedProps {
  items: ActivityItem[];
  emptyMessage?: string;
}

export default function ActivityFeed({ items, emptyMessage = 'No recent activity.' }: ActivityFeedProps) {
  if (items.length === 0) {
    return <p className="text-[13px] text-[#888] py-6 text-center">{emptyMessage}</p>;
  }

  return (
    <div className="divide-y divide-black/[0.04]">
      {items.map((item, i) => (
        <div key={item.id ?? i} className="flex items-start gap-4 py-4 px-1">
          <div className={`mt-1.5 shrink-0 ${item.dotColor ?? 'text-[#9FD4B8]'}`}>
            <IconDot />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-[#1C3A2E] leading-snug">{item.title}</p>
            {item.subtitle && (
              <p className="text-[12px] text-[#888] mt-0.5 leading-snug">{item.subtitle}</p>
            )}
          </div>
          <p className="text-[11px] text-[#aaa] shrink-0 mt-0.5">{item.timestamp}</p>
        </div>
      ))}
    </div>
  );
}