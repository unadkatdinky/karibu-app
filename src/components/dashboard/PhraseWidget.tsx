import { IconPlay } from './icons';

interface PhraseWidgetProps {
  phrase: string;
  translation: string;
  onPlay?: () => void;
}

export default function PhraseWidget({ phrase, translation, onPlay }: PhraseWidgetProps) {
  return (
    <div className="bg-[#1C3A2E] rounded-2xl p-[22px] text-[#F5EDD8] mb-5">
      <p className="text-[10.5px] uppercase tracking-[0.12em] font-semibold text-[#D4A853] mb-3">
        Phrase of the Day
      </p>
      <p className="font-serif text-[24px] mb-1.5">{phrase}</p>
      <p className="text-[13px] opacity-70 mb-4">"{translation}"</p>
      <button
        onClick={onPlay}
        className="inline-flex items-center gap-2 bg-[#D4A853]/15 border border-[#D4A853]/30 text-[#D4A853] px-4 py-2.5 rounded-full text-[12.5px] font-semibold hover:bg-[#D4A853]/25 transition-colors"
      >
        <IconPlay />
        Hear it spoken
      </button>
    </div>
  );
}