import { useEffect, useState } from 'react';

interface LoadingStateProps {
  message?: string;
  submessage?: string;
}

export default function LoadingState({ 
  message = "Stamping your permit...", 
  submessage = "Consulting local expert routes and mapping microclimates..." 
}: LoadingStateProps) {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[350px] p-8 text-center bg-[#FAF8F4]/40 rounded-3xl border border-[#1C3A2E]/5 backdrop-blur-sm animate-fade-in">
      <div className="relative mb-6">
        {/* Outer concentric pulsing ring */}
        <div className="w-16 h-16 border-[1.5px] border-[#D4A853]/30 rounded-full animate-ping absolute inset-0 opacity-40" />
        {/* Main rotating vintage compass-style compass loader */}
        <div className="w-16 h-16 border-2 border-[#1C3A2E]/10 border-t-[#C4522A] border-b-[#D4A853] rounded-full animate-spin duration-1000" />
        <div className="absolute inset-0 flex items-center justify-center text-xs">🌍</div>
      </div>
      <h3 className="font-serif text-[20px] text-[#1C3A2E] mb-1 font-medium">
        {message}{dots}
      </h3>
      <p className="text-[13px] text-[#666] max-w-[290px] leading-relaxed italic animate-pulse">
        {submessage}
      </p>
    </div>
  );
}