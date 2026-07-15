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
    <div className="bg-white border border-[#1C3A2E]/10 rounded-[18px] relative shadow-sm overflow-hidden mb-8">
      <form onSubmit={handleSubmit}>
        {/* Top Section */}
        <div className="p-6 md:p-7 flex flex-wrap gap-6 items-end">
          <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
            <label className="text-[10px] uppercase tracking-[0.1em] text-[#666] font-bold">Trip name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Serengeti Summer"
              className="border-b-[1.5px] border-[#1C3A2E]/20 pb-1.5 font-serif text-[20px] text-[#1a1a1a] bg-transparent focus:outline-none focus:border-[#C4522A]"
            />
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-[0.1em] text-[#666] font-bold">Starting</label>
            <input 
              type="date" 
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border-b-[1.5px] border-[#1C3A2E]/20 pb-1.5 text-[15px] text-[#1a1a1a] bg-transparent focus:outline-none focus:border-[#C4522A]"
            />
          </div>

          <div className="flex flex-col gap-1.5 w-20">
            <label className="text-[10px] uppercase tracking-[0.1em] text-[#666] font-bold">Travelers</label>
            <input 
              type="number" 
              min="1"
              value={travelers}
              onChange={(e) => setTravelers(Number(e.target.value))}
              className="border-b-[1.5px] border-[#1C3A2E]/20 pb-1.5 text-[15px] text-[#1a1a1a] text-center bg-transparent focus:outline-none focus:border-[#C4522A]"
            />
          </div>

          <div className="flex flex-col gap-1.5 min-w-[190px]">
            <label className="text-[10px] uppercase tracking-[0.1em] text-[#666] font-bold">Budget per person</label>
            <div className="flex items-center gap-3">
              <input 
                type="range" 
                min="200" 
                max="5000" 
                step="100"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="flex-1 accent-[#D4A853]"
              />
              <span className="text-[13px] font-bold text-[#1C3A2E] min-w-[60px] text-right">
                ${budget.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Perforated Tear Line */}
        <div className="h-0 border-t-2 border-dashed border-[#1C3A2E]/20 relative mx-6">
          <div className="absolute -top-[11px] -left-[35px] w-[22px] h-[22px] rounded-full bg-[#FAF8F4]"></div>
          <div className="absolute -top-[11px] -right-[35px] w-[22px] h-[22px] rounded-full bg-[#FAF8F4]"></div>
        </div>

        {/* Bottom Section */}
        <div className="p-5 md:px-7 flex justify-between items-center flex-wrap gap-4">
          <span className="font-serif italic text-[13px] text-[#C4522A] border-[1.5px] border-dashed border-[#C4522A] rounded-lg px-3.5 py-1.5 -rotate-2">
            Trip permit · draft
          </span>
          
          <button 
            type="submit"
            disabled={loading}
            className="bg-[#C4522A] text-white border-none rounded-xl px-6 py-3 text-[13px] font-bold tracking-[0.02em] cursor-pointer hover:bg-[#a8441f] transition-colors disabled:opacity-70"
          >
            {loading ? 'Generating...' : 'Generate suggestions →'}
          </button>
        </div>
      </form>
    </div>
  );
}