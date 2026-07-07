interface IntelRowProps {
  dotColor: string;
  place: string;
  note: string;
  postedBy: string;
  timestamp: string;
  last?: boolean;
}

export default function IntelRow({ dotColor, place, note, postedBy, timestamp, last }: IntelRowProps) {
  return (
    <div className={`flex items-start gap-2.5 py-[11px] ${last ? '' : 'border-b border-[#1C3A2E]/[0.08]'}`}>
      <span className="w-[7px] h-[7px] rounded-full mt-1.5 shrink-0" style={{ backgroundColor: dotColor }} />
      <div>
        <p className="text-[12.5px] leading-relaxed text-[#333]">
          <span className="font-bold text-[#1C3A2E]">{place}</span> — {note}
        </p>
        <p className="text-[11px] text-[#666] mt-0.5">Posted {timestamp} by {postedBy}</p>
      </div>
    </div>
  );
}