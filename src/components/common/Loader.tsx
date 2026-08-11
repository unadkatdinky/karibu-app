import { useEffect, useState } from 'react';

interface LoaderProps {
  /** Small text under the compass, e.g. "Charting your route..." */
  label?: string;
  /** px size of the compass itself. Defaults to 72. */
  size?: number;
  /** Use for inline/small contexts (buttons, cards) — hides label, shrinks compass. */
  compact?: boolean;
  className?: string;
}

// A rotation of short, in-voice messages that cycle under the compass when
// no explicit label is passed — keeps longer waits (like AI generation)
// feeling alive instead of stuck.
const DEFAULT_MESSAGES = [
  'Charting your route...',
  'Reading the weather...',
  'Marking the trail...',
];

/**
 * Karibu's shared loading indicator — a hand-drawn compass needle that
 * settles briefly on each heading before swinging to the next.
 *
 * Usage:
 *   <Loader />                                  // default, cycling messages
 *   <Loader label="Saving your stop..." />       // fixed label
 *   <Loader compact />                           // small, no label — for buttons/inline
 */
export default function Loader({ label, size = 72, compact = false, className = '' }: LoaderProps) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (label) return; // fixed label, no cycling needed
    const interval = setInterval(() => {
      setMessageIndex((i) => (i + 1) % DEFAULT_MESSAGES.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [label]);

  const compassSize = compact ? Math.min(size, 32) : size;
  const displayLabel = label ?? DEFAULT_MESSAGES[messageIndex];

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${className}`}
      role="status"
      aria-live="polite"
      aria-label={displayLabel}
    >
      <svg
        width={compassSize}
        height={compassSize}
        viewBox="0 0 72 72"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="karibu-loader-compass"
      >
        {/* Outer ring — hand-inked look via double-stroke offset */}
        <circle cx="36" cy="36" r="31" stroke="#1C3A2E" strokeOpacity="0.12" strokeWidth="2.5" />
        <circle cx="36" cy="36" r="31" stroke="#D4A853" strokeWidth="1.5" strokeDasharray="1 5" />

        {/* Cardinal ticks */}
        {[0, 90, 180, 270].map((deg) => (
          <line
            key={deg}
            x1="36"
            y1="7"
            x2="36"
            y2="12.5"
            stroke="#1C3A2E"
            strokeOpacity="0.35"
            strokeWidth="2"
            strokeLinecap="round"
            transform={`rotate(${deg} 36 36)`}
          />
        ))}

        {/* N label */}
        <text x="36" y="19" textAnchor="middle" fontSize="7" fontWeight="700" fill="#C4522A" fontFamily="serif">
          N
        </text>

        {/* Spinning needle group */}
        <g className="karibu-loader-needle" style={{ transformOrigin: '36px 36px' }}>
          <polygon points="36,14 40,36 36,58 32,36" fill="#C4522A" opacity="0.15" />
          <polygon points="36,16 39.5,36 36,36 36,36" fill="#C4522A" />
          <polygon points="36,16 32.5,36 36,36 36,36" fill="#1C3A2E" opacity="0.5" />
          <polygon points="36,56 39.5,36 36,36 36,36" fill="#1C3A2E" opacity="0.5" />
          <polygon points="36,56 32.5,36 36,36 36,36" fill="#C4522A" opacity="0.3" />
        </g>

        <circle cx="36" cy="36" r="3.5" fill="#F5EDD8" stroke="#1C3A2E" strokeWidth="1.5" />
      </svg>

      {!compact && (
        <p className="text-[12px] text-[#666] italic font-medium tracking-[0.01em] transition-opacity duration-300">
          {displayLabel}
        </p>
      )}

      {/* Scoped animation + reduced-motion fallback */}
      <style>{`
        .karibu-loader-needle {
          animation: karibu-needle-swing 2.4s cubic-bezier(0.45, 0, 0.2, 1) infinite;
        }
        @keyframes karibu-needle-swing {
          0%   { transform: rotate(-18deg); }
          25%  { transform: rotate(12deg); }
          50%  { transform: rotate(-6deg); }
          75%  { transform: rotate(20deg); }
          100% { transform: rotate(-18deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .karibu-loader-needle {
            animation: karibu-needle-swing-reduced 3s ease-in-out infinite;
          }
          @keyframes karibu-needle-swing-reduced {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(8deg); }
          }
        }
      `}</style>
    </div>
  );
}