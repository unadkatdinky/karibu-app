import { useState } from 'react';
import type { ItineraryDay } from '../../api/itineraries';

interface TrailMapProps {
  days: ItineraryDay[];
  onAddDay: (place: string, date: string, region: string) => Promise<void>;
  onAddStop: (dayId: string, name: string, timeLabel: string) => Promise<void>;
}

export default function TrailMap({ days, onAddDay, onAddStop }: TrailMapProps) {
  // Inline Form States
  const [addingDay, setAddingDay] = useState(false);
  const [newDayPlace, setNewDayPlace] = useState('');
  const [newDayDate, setNewDayDate] = useState('');
  const [newDayRegion, setNewDayRegion] = useState<'mainland' | 'coast'>('mainland');

  const [addingStopFor, setAddingStopFor] = useState<string | null>(null);
  const [newStopName, setNewStopName] = useState('');
  const [newStopTime, setNewStopTime] = useState('');

  const handleDaySubmit = async () => {
    if (!newDayPlace || !newDayDate) return;
    await onAddDay(newDayPlace, newDayDate, newDayRegion);
    setAddingDay(false);
    setNewDayPlace('');
    setNewDayDate('');
  };

  const handleStopSubmit = async (dayId: string) => {
    if (!newStopName) return;
    await onAddStop(dayId, newStopName, newStopTime);
    setAddingStopFor(null);
    setNewStopName('');
    setNewStopTime('');
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 overflow-x-auto bg-[#FAF8F4]">
      
      {/* Horizontal Route Track Wrapper */}
      <div className="flex gap-6 items-start min-w-max pt-16 pb-8 px-4 relative">
        
        {/* Simple Simulated Road Line (Dotted Hand-Drawn Travel Aesthetic) */}
        <div className="absolute top-[48px] left-28 right-28 h-[2px] border-t-2 border-dashed border-[#B98953]/60 pointer-events-none z-0" />

        {/* Days Horizontal Stack */}
        {days.map((day, index) => {
          const isCoast = day.region === 'coast';
          
          return (
            <div 
              key={day.id} 
              className={`w-[220px] bg-white rounded-2xl shadow-md border border-[#1C3A2E]/10 flex-shrink-0 relative transition-transform duration-200 hover:-translate-y-1 z-10
                ${index % 2 === 0 ? 'translate-y-2' : '-translate-y-2'}`}
            >
              
              {/* Ticket Header Stub Section */}
              <div 
                className={`p-4 text-center rounded-t-2xl relative text-white`}
                style={{ backgroundColor: isCoast ? '#1E4B65' : '#1C3A2E' }}
              >
                {/* Vertical Connector Pin Line to the Road */}
                <div className={`absolute left-1/2 -translate-x-1/2 w-[1.5px] h-12 border-l border-dashed border-[#C4522A] ${index % 2 === 0 ? '-top-12' : '-top-[60px]'}`}>
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#C4522A]" />
                </div>

                {/* Travel Passport Stamp Badge */}
                <div className="w-[48px] h-[48px] rounded-full border-2 border-dashed border-white/70 flex flex-col items-center justify-center mx-auto mb-2 -rotate-6 select-none">
                  <span className="font-serif text-[18px] font-bold text-white leading-none">{index + 1}</span>
                  <span className="text-[7px] tracking-wider text-white/80 uppercase font-mono">Day</span>
                </div>

                <h3 className="font-serif text-[18px] font-medium tracking-wide text-white truncate px-1">{day.place}</h3>
                <p className="text-[10.5px] text-white/70 font-mono mt-0.5">
                  {new Date(day.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                </p>
              </div>

              {/* Ticket Perforation Tear Simulation Effect */}
              <div className="relative h-[2px] mx-3.5 border-t-[1.5px] dashed border-[#1C3A2E]/20 my-0">
                <div className="absolute -left-[23px] -top-[10px] w-[18px] h-[18px] rounded-full bg-[#FAF8F4]" />
                <div className="absolute -right-[23px] -top-[10px] w-[18px] h-[18px] rounded-full bg-[#FAF8F4]" />
              </div>

              {/* Ticket Body Content Section */}
              <div className="p-4 bg-white rounded-b-2xl">
                
                {/* Weather Stamp Badge */}
                <div className="inline-block bg-[#EDE3D0] text-[#2D5A3D] text-[11px] font-semibold px-2.5 py-0.5 rounded-full mb-3">
                  {day.weather || '☀ Weather TBD'}
                </div>

                {/* Day Stops Content Layout List */}
                <div className="flex flex-col gap-1.5 border-b border-[#1C3A2E]/5 pb-3 mb-3">
                  {day.stops && day.stops.length > 0 ? (
                    day.stops.map((stop) => (
                      <div key={stop.id} className="flex items-start justify-between text-[12.5px] py-1 border-b border-dashed border-[#1C3A2E]/5 last:border-none">
                        <div className="flex items-center gap-1.5 flex-1 min-w-0 pr-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D4A853] shrink-0" />
                          <span className="font-medium text-[#1a1a1a] truncate">{stop.name}</span>
                        </div>
                        <span className="text-[10.5px] font-mono text-[#666] shrink-0 whitespace-nowrap bg-[#FAF8F4] px-1 rounded">
                          {stop.timeLabel || 'Flexible'}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-[11px] text-[#888] italic py-1">No stops stamped yet.</p>
                  )}
                </div>

                {/* Dynamic Inline Route Stop Action Blocks */}
                {addingStopFor === day.id ? (
                  <div className="p-2.5 bg-[#FAF8F4] border border-[#1C3A2E]/10 rounded-xl flex flex-col gap-2">
                    <input
                      type="text"
                      placeholder="Stop name..."
                      value={newStopName}
                      onChange={(e) => setNewStopName(e.target.value)}
                      className="w-full bg-white border border-[#1C3A2E]/15 rounded-md px-2 py-1 text-[12px] focus:outline-none focus:border-[#C4522A]"
                    />
                    <div className="flex gap-1.5 items-center">
                      <input
                        type="text"
                        placeholder="Time..."
                        value={newStopTime}
                        onChange={(e) => setNewStopTime(e.target.value)}
                        className="flex-1 bg-white border border-[#1C3A2E]/15 rounded-md px-2 py-1 text-[12px] focus:outline-none focus:border-[#C4522A]"
                      />
                      <button onClick={() => setAddingStopFor(null)} className="text-[10.5px] text-[#666]">X</button>
                      <button onClick={() => handleStopSubmit(day.id)} className="bg-[#C4522A] text-white text-[10.5px] font-bold px-2 py-1 rounded-md">Add</button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setAddingStopFor(day.id)}
                    className="w-full border border-dashed border-[#2D5A3D]/30 bg-transparent rounded-lg py-1.5 text-[11.5px] text-[#2D5A3D] font-bold hover:bg-[#FAF8F4] transition-colors"
                  >
                    + Add a stop
                  </button>
                )}
              </div>

            </div>
          );
        })}

        {/* Append New Day Ticket Button/Form */}
        <div className="w-[200px] flex-shrink-0 self-stretch flex items-center">
          {addingDay ? (
             <div className="w-full bg-white p-4 rounded-2xl shadow-md border border-[#1C3A2E]/15 flex flex-col gap-2.5">
               <input
                 type="text"
                 placeholder="Destination Region?"
                 value={newDayPlace}
                 onChange={(e) => setNewDayPlace(e.target.value)}
                 className="w-full border border-[#1C3A2E]/15 rounded-lg px-2.5 py-1.5 text-[12px] focus:outline-none focus:border-[#C4522A]"
               />
               <input
                 type="date"
                 value={newDayDate}
                 onChange={(e) => setNewDayDate(e.target.value)}
                 className="w-full border border-[#1C3A2E]/15 rounded-lg px-2.5 py-1.5 text-[12px] focus:outline-none focus:border-[#C4522A]"
               />
               <div className="flex gap-1">
                 <button
                   type="button"
                   onClick={() => setNewDayRegion('mainland')}
                   className={`flex-1 rounded-md py-1 text-[10px] font-bold border transition-colors ${newDayRegion === 'mainland' ? 'bg-[#2D5A3D] text-white border-[#2D5A3D]' : 'bg-transparent border-[#1C3A2E]/10 text-[#2D5A3D]'}`}
                 >
                   Mainland
                 </button>
                 <button
                   type="button"
                   onClick={() => setNewDayRegion('coast')}
                   className={`flex-1 rounded-md py-1 text-[10px] font-bold border transition-colors ${newDayRegion === 'coast' ? 'bg-[#1E4B65] text-white border-[#1E4B65]' : 'bg-transparent border-[#1C3A2E]/10 text-[#1E4B65]'}`}
                 >
                   Coast
                 </button>
               </div>
               <div className="flex justify-end gap-1.5 mt-1">
                 <button onClick={() => setAddingDay(false)} className="text-[11px] text-[#666] px-1 py-0.5">Cancel</button>
                 <button onClick={handleDaySubmit} className="bg-[#C4522A] text-white rounded-md px-2.5 py-1 text-[11px] font-bold">Stamp</button>
               </div>
             </div>
          ) : (
            <button
              onClick={() => setAddingDay(true)}
              className="w-full min-h-[220px] border-2 border-dashed border-[#2D5A3D]/20 rounded-2xl bg-white/40 text-[#2D5A3D] text-[13px] font-bold hover:bg-white hover:border-[#C4522A]/40 hover:text-[#C4522A] transition-all flex flex-col items-center justify-center p-4 text-center gap-1"
            >
              <span className="text-xl">+</span>
              <span>Add Day {days.length + 1}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}