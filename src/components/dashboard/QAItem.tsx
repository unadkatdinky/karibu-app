import { IconCheck } from './icons';

interface QAItemProps {
  region: string;
  timestamp: string;
  question: string;
  answeredBy?: string;
  last?: boolean;
}

export default function QAItem({ region, timestamp, question, answeredBy, last }: QAItemProps) {
  return (
    <div className={`py-3.5 ${last ? '' : 'border-b border-[#1C3A2E]/[0.08]'}`}>
      <div className="flex items-center gap-2 text-[11px] text-[#666] mb-1.5">
        <span className="bg-[#EDE3D0] text-[#1C3A2E] px-2 py-0.5 rounded-full font-semibold text-[10.5px]">
          {region}
        </span>
        <span>{timestamp}</span>
      </div>
      <h4 className="text-[13.5px] font-semibold text-[#1C3A2E] leading-snug mb-1">{question}</h4>
      {answeredBy && (
        <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-[#2D5A3D]">
          <IconCheck />
          Answered by {answeredBy}
        </span>
      )}
    </div>
  );
}