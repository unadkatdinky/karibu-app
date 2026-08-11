interface ExchangeMeterProps {
  spent: number;
  budget: number;
  travelers?: number;
}

export default function ExchangeMeter({ spent, budget, travelers = 1 }: ExchangeMeterProps) {
  const pct = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
  const over = spent > budget;
  const remaining = budget - spent;

  let zoneColor = '#2D5A3D';
  let zoneLabel = 'On budget';

  if (budget > 0 && spent / budget > 0.75 && spent / budget <= 1) {
    zoneColor = '#D4A853';
    zoneLabel = 'Getting tight';
  }
  if (over) {
    zoneColor = '#C4522A';
    zoneLabel = 'Over budget';
  }

  const formatMoney = (n: number) => `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

  return (
    <div className="bg-white border-[1.5px] border-[#1C3A2E]/15 rounded-2xl px-6 py-5 mb-5 shadow-sm karibu-fade-up">
      <div className="flex items-baseline justify-between mb-3">
        <div>
          <p className="text-[10px] font-mono tracking-widest text-[#666] uppercase font-bold mb-0.5">
            Ground Cost {travelers > 1 ? `(${travelers} travelers)` : ''}
          </p>
          <p className="font-serif text-[22px] text-[#1C3A2E] leading-none">
            {formatMoney(spent)} <span className="text-[14px] font-sans text-[#888] font-normal">of {formatMoney(budget)}</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-[11px] font-mono font-bold uppercase tracking-wide" style={{ color: zoneColor }}>
            {zoneLabel}
          </p>
          <p className="text-[11px] text-[#888] font-mono mt-0.5">
            {over ? `${formatMoney(Math.abs(remaining))} over` : `${formatMoney(remaining)} left`}
          </p>
        </div>
      </div>
      <div className="relative h-3 rounded-full bg-[#1C3A2E]/8 overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%`, background: zoneColor }}
        />
        {[25, 50, 75].map((t) => (
          <div key={t} className="absolute top-0 bottom-0 w-[1px] bg-white/60" style={{ left: `${t}%` }} />
        ))}
      </div>
    </div>
  );
}
