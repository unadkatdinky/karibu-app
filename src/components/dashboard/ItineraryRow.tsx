import { IconArrowRight } from './icons';

interface ItineraryRowProps {
  title: string;
  subtitle: string;
  guideName: string;
  thumbColor: string;
  onClick?: () => void;
}

export default function ItineraryRow({ title, subtitle, guideName, thumbColor, onClick }: ItineraryRowProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3.5 p-3.5 rounded-xl border border-[#1C3A2E]/[0.08] mb-2.5 last:mb-0 hover:border-[#D4A853] transition-colors text-left"
    >
      <div className="w-14 h-14 rounded-[10px] shrink-0" style={{ backgroundColor: thumbColor }} />
      <div className="flex-1 min-w-0">
        <h4 className="text-[13.5px] font-semibold text-[#1C3A2E] mb-0.5 truncate">{title}</h4>
        <p className="text-[12px] text-[#666] truncate">{subtitle}</p>
        <div className="flex items-center gap-1.5 mt-1 text-[11.5px] font-medium text-[#2D5A3D]">
          <span className="w-4 h-4 rounded-full bg-[#9FD4B8] inline-block" />
          {guideName} · Local Guide
        </div>
      </div>
      <div className="w-[30px] h-[30px] rounded-full bg-[#faf8f4] flex items-center justify-center shrink-0 text-[#1C3A2E]">
        <IconArrowRight />
      </div>
    </button>
  );
}