import { useState } from 'react';

interface PermitCardProps {
  onCreate: (data: { name: string; startDate: string; travelers: number; budget: number }) => void;
  loading?: boolean;
}

export default function PermitCard({ onCreate, loading }: PermitCardProps) {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [travelers, setTravelers] = useState(2);
  const [budget, setBudget] = useState(1500);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate({ name, startDate, travelers, budget });
  };

  return (
    <div className="bg-[#FCFAF6] border-[1.5px] border-[#1C3A2E]/15 rounded-2xl shadow-md overflow-hidden mb-8 grid grid-cols-1 md:grid-cols-[1fr_240px] relative">
      
      {/* Flight Pass / Main Permit Details Section */}
      <form onSubmit={handleSubmit} className="p-6 md:p-8 flex flex-col justify-between gap-6">
        <div>
          <div className="flex justify-between items-center border-b border-[#1C3A2E]/10 pb-4 mb-6">
            <div>
              <p className="text-[10px] font-mono tracking-widest text-[#C4522A] uppercase font-bold">Document Title // Form-74A</p>
              <h2 className="font-serif text-[24px] text-[#1C3A2E] leading-none mt-1">East Africa Entry Permit</h2>
            </div>
            <div className="text-right font-mono text-[11px] text-[#666]">
              STATUS: <span className="text-[#C4522A] font-bold">DRAFT</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-mono tracking-wider text-[#666] uppercase font-bold">1. Expedition / Trail Name</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Serengeti Summer"
                className="border-b border-[#1C3A2E]/20 py-1 font-serif text-[18px] text-[#1a1a1a] bg-transparent focus:outline-none focus:border-[#C4522A] transition-colors"
              />
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-mono tracking-wider text-[#666] uppercase font-bold">2. Commencing Date</label>
              <input 
                type="date" 
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border-b border-[#1C3A2E]/20 py-1 text-[15px] text-[#1a1a1a] bg-transparent focus:outline-none focus:border-[#C4522A] transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-mono tracking-wider text-[#666] uppercase font-bold">3. Total Passengers</label>
              <input 
                type="number" 
                min="1"
                value={travelers}
                onChange={(e) => setTravelers(Number(e.target.value))}
                className="border-b border-[#1C3A2E]/20 py-1 text-[15px] text-[#1a1a1a] bg-transparent focus:outline-none focus:border-[#C4522A] transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-mono tracking-wider text-[#666] uppercase font-bold">4. Budget Allocation (Per Person)</label>
              <div className="flex items-center gap-3 mt-1">
                <input 
                  type="range" 
                  min="200" 
                  max="5000" 
                  step="100"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="flex-1 accent-[#C4522A] h-1 bg-[#1C3A2E]/10 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-[14px] font-mono font-bold text-[#1C3A2E] bg-[#1C3A2E]/5 px-2 py-0.5 rounded">
                  ${budget.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-[11px] text-[#888] font-mono mt-4">
          * AI models process route parameters dynamically based on regional variables.
        </div>
      </form>

      {/* Perforated Splitter Line (For Larger Viewports) */}
      <div className="hidden md:block absolute top-0 bottom-0 left-[calc(100%-240px)] w-0 border-r-2 border-dashed border-[#1C3A2E]/20">
        <div className="absolute -top-[12px] -left-[12px] w-6 h-6 rounded-full bg-[#FAF8F4] border-b border-[#1C3A2E]/10" />
        <div className="absolute -bottom-[12px] -left-[12px] w-6 h-6 rounded-full bg-[#FAF8F4] border-t border-[#1C3A2E]/10" />
      </div>

      {/* Right Ticket Stub Section */}
      <div className="bg-[#1C3A2E]/5 p-6 md:p-8 flex flex-col justify-between items-center text-center md:border-l border-[#1C3A2E]/10">
        <div className="w-full flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border border-dashed border-[#1C3A2E]/30 flex items-center justify-center text-lg mb-3">
            ✈
          </div>
          <span className="font-serif italic text-[14px] text-[#C4522A] border border-dashed border-[#C4522A]/40 bg-white rounded-md px-3 py-1 rotate-[-2deg] shadow-sm font-semibold tracking-wide">
            KARIBU TOURS
          </span>
          <p className="text-[11px] text-[#666] max-w-[160px] leading-relaxed mt-4 font-mono uppercase">
            Validation required at regional borders.
          </p>
        </div>

        <button 
          onClick={handleSubmit}
          disabled={loading || !name}
          className="w-full mt-6 bg-[#C4522A] text-white border-none rounded-xl py-3 text-[13px] font-bold tracking-wide shadow-sm hover:bg-[#a8441f] active:scale-[0.99] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : 'Generate Itinerary →'}
        </button>
      </div>
    </div>
  );
}