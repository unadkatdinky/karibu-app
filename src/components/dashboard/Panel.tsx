// Generic white card used for every dashboard section: header (title + optional
// right-side link/action) followed by whatever content is passed as children.

import type { ReactNode } from 'react';

interface PanelProps {
  title?: string;
  action?: { label: string; onClick?: () => void };
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}

export default function Panel({ title, action, children, className = '', bodyClassName = '' }: PanelProps) {
  return (
    <div className={`bg-white rounded-2xl border border-[#1C3A2E]/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-6 mb-5 ${className}`}>
      {title && (
        <div className="flex items-center justify-between mb-[18px]">
          <h3 className="font-serif text-[17px] text-[#1C3A2E]">{title}</h3>
          {action && (
            <button
              onClick={action.onClick}
              className="text-[12px] font-semibold text-[#C4522A] hover:text-[#a53f1f] transition-colors"
            >
              {action.label}
            </button>
          )}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </div>
  );
}