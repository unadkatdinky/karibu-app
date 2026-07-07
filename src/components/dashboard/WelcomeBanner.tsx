// Hero card at the top of a dashboard page — dark gradient, a soft gold glow in
// the corner, an eyebrow label, a headline, supporting copy, and up to two actions.

import type { ReactNode } from 'react';

interface WelcomeBannerAction {
  label: string;
  onClick?: () => void;
  variant?: 'gold' | 'ghost';
}

interface WelcomeBannerProps {
  eyebrow: string;
  title: ReactNode;
  message?: ReactNode;
  actions?: WelcomeBannerAction[];
}

export default function WelcomeBanner({ eyebrow, title, message, actions }: WelcomeBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-[20px] px-8 py-8 mb-7 text-[#F5EDD8] bg-gradient-to-br from-[#1C3A2E] to-[#2D5A3D]">
      <div
        className="pointer-events-none absolute -right-16 -top-16 w-60 h-60 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(212,168,83,0.18), transparent 70%)' }}
      />
      <p className="relative text-[11px] uppercase tracking-[0.14em] font-semibold text-[#D4A853] mb-2.5">
        {eyebrow}
      </p>
      <h2 className="relative font-serif text-[28px] leading-tight max-w-xl mb-2.5">{title}</h2>
      {message && <p className="relative text-[14px] opacity-75 max-w-lg leading-relaxed">{message}</p>}
      {actions && actions.length > 0 && (
        <div className="relative flex gap-3 mt-5">
          {actions.map((a, i) => (
            <button
              key={i}
              onClick={a.onClick}
              className={
                a.variant === 'ghost'
                  ? 'bg-white/[0.08] text-[#F5EDD8] border border-white/20 px-5 py-2.5 rounded-[10px] text-[13px] font-semibold hover:bg-white/[0.14] transition-colors'
                  : 'bg-[#D4A853] text-[#1C3A2E] px-5 py-2.5 rounded-[10px] text-[13px] font-semibold hover:bg-[#c99b3f] transition-colors'
              }
            >
              {a.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}