import { useEffect, useRef, useState } from 'react';
import rough from 'roughjs';
import type { ItineraryDay } from '../../api/itineraries';

interface TrailMapProps {
  days: ItineraryDay[];
  onAddDay: (place: string, date: string, region: string) => Promise<void>;
  onAddStop: (dayId: string, name: string, timeLabel: string) => Promise<void>;
}

export default function TrailMap({ days, onAddDay, onAddStop }: TrailMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const stubRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Inline Form States
  const [addingDay, setAddingDay] = useState(false);
  const [newDayPlace, setNewDayPlace] = useState('');
  const [newDayDate, setNewDayDate] = useState('');
  
  const [addingStopFor, setAddingStopFor] = useState<string | null>(null);
  const [newStopName, setNewStopName] = useState('');
  const [newStopTime, setNewStopTime] = useState('');

  const handleDaySubmit = async () => {
    if (!newDayPlace || !newDayDate) return;
    await onAddDay(newDayPlace, newDayDate, 'mainland'); 
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

  // rough.js drawing logic
  useEffect(() => {
    if (!svgRef.current || !containerRef.current || days.length === 0) return;

    const svg = svgRef.current;
    const container = containerRef.current;
    
    // Clear previous drawing
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    const wrapRect = container.getBoundingClientRect();
    svg.setAttribute('width', wrapRect.width.toString());
    svg.setAttribute('height', wrapRect.height.toString());

    const rc = rough.svg(svg);
    const roadY = 40;
    const points: number[] = [];

    // Calculate center X for each stamp
    stubRefs.current.forEach((stub) => {
      if (stub) {
        const stamp = stub.querySelector('.stamp');
        if (stamp) {
          const r = stamp.getBoundingClientRect();
          const x = r.left - wrapRect.left + r.width / 2;
          points.push(x);
        }
      }
    });

    if (points.length > 0) {
      // Draw main trail line
      const roadPath = `M${points[0]},${roadY} ` + points.slice(1).map(x => `L${x},${roadY}`).join(' ');
      
      svg.appendChild(rc.path(roadPath, { stroke: '#B98953', strokeWidth: 9, roughness: 1.8, bowing: 2 }));
      svg.appendChild(rc.path(roadPath, { stroke: '#D4A853', strokeWidth: 1.5, strokeLineDash: [6, 7], roughness: 1.2 }));

      // Draw connection lines and dots
      stubRefs.current.forEach((stub, index) => {
        if (stub) {
          const stamp = stub.querySelector('.stamp');
          if (stamp) {
            const r = stamp.getBoundingClientRect();
            const x = points[index];
            const stampY = r.top - wrapRect.top + r.height / 2;
            
            svg.appendChild(rc.line(x, roadY, x, stampY, { stroke: '#C4522A', strokeWidth: 1.5, roughness: 1.4 }));
            svg.appendChild(rc.circle(x, roadY, 8, { fill: '#C4522A', fillStyle: 'solid', stroke: '#C4522A', roughness: 1.6 }));
          }
        }
      });
    }
  }, [days, addingDay, addingStopFor]);

  return (
    <div className="relative overflow-x-auto pb-8" ref={containerRef}>
      <svg className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none" ref={svgRef}></svg>
      
      <div className="flex gap-[26px] relative z-10 min-w-[760px] pt-[74px]">
        {days.map((day, index) => {
          const isCoast = day.region === 'coast';
          const yOffset = index % 2 === 0 ? 'translate-y-2.5' : '-translate-y-2.5';
          
          return (
            <div 
              key={day.id} 
              ref={(el) => { stubRefs.current[index] = el; }}
              className={`flex-none w-[208px] bg-white rounded-2xl shadow-sm ${yOffset}`}
            >
              <div className={`p-4 relative rounded-t-2xl ${isCoast ? 'bg-[#1E4B65]' : 'bg-[#1C3A2E]'}`}>
                <div className="stamp w-[46px] h-[46px] rounded-full border-2 border-dashed border-white/70 flex flex-col items-center justify-center mx-auto mb-2.5 -rotate-6">
                  <span className="font-serif text-[19px] text-white leading-none">{index + 1}</span>
                  <span className="text-[8px] tracking-widest text-white/75 uppercase">day</span>
                </div>
                <p className="font-serif text-[18px] text-white text-center mb-0.5">{day.place}</p>
                <p className="text-[10.5px] text-white/70 text-center m-0">{new Date(day.date).toLocaleDateString()}</p>
              </div>
              
              <div className="relative h-px mx-3.5 border-t-[1.5px] border-dashed border-[#1C3A2E]/30"></div>
              
              <div className="p-4">
                <span className="inline-flex items-center gap-1.5 text-[11px] text-[#2D5A3D] bg-[#EDE3D0] rounded-full px-2.5 py-1 mb-3 font-semibold">
                  {day.weather || '☀ Weather TBD'}
                </span>
                
                {day.stops?.map((stop) => (
                  <div key={stop.id} className="flex items-center gap-2 py-1.5 text-[13px] border-b border-[#1C3A2E]/5 last:border-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4A853] shrink-0"></span>
                    <span className="flex-1 font-medium">{stop.name}</span>
                    <span className="text-[10.5px] text-[#666]">{stop.timeLabel}</span>
                  </div>
                ))}
                
                {addingStopFor === day.id ? (
                  <div className="mt-3 flex flex-col gap-2">
                    <input 
                      type="text" 
                      placeholder="Stop name" 
                      value={newStopName}
                      onChange={(e) => setNewStopName(e.target.value)}
                      className="w-full border-b border-[#1C3A2E]/20 text-[12px] bg-transparent focus:outline-none"
                    />
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Time (e.g. 9am)" 
                        value={newStopTime}
                        onChange={(e) => setNewStopTime(e.target.value)}
                        className="w-full border-b border-[#1C3A2E]/20 text-[12px] bg-transparent focus:outline-none"
                      />
                      <button onClick={() => handleStopSubmit(day.id)} className="text-[11px] font-bold text-[#C4522A]">Save</button>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => setAddingStopFor(day.id)}
                    className="w-full mt-2.5 border border-dashed border-[#1C3A2E]/25 bg-transparent rounded-[9px] p-2 text-[11.5px] text-[#2D5A3D] font-bold hover:bg-white hover:border-[#2D5A3D] transition-colors"
                  >
                    + Add a stop
                  </button>
                )}
              </div>
            </div>
          );
        })}
        
        <div className="flex-none w-[180px]">
          {addingDay ? (
             <div className="bg-white p-4 rounded-2xl shadow-sm border-[1.5px] border-[#1C3A2E]/20 flex flex-col gap-3">
               <input 
                 type="text" 
                 placeholder="Where to?" 
                 value={newDayPlace}
                 onChange={(e) => setNewDayPlace(e.target.value)}
                 className="w-full border-b border-[#1C3A2E]/20 text-[13px] bg-transparent focus:outline-none"
               />
               <input 
                 type="date" 
                 value={newDayDate}
                 onChange={(e) => setNewDayDate(e.target.value)}
                 className="w-full border-b border-[#1C3A2E]/20 text-[13px] bg-transparent focus:outline-none"
               />
               <button onClick={handleDaySubmit} className="bg-[#1C3A2E] text-white rounded-lg py-1.5 text-[12px] font-bold">Add</button>
             </div>
          ) : (
            <div 
              onClick={() => setAddingDay(true)}
              className="w-full h-full flex items-center justify-center border-2 border-dashed border-[#1C3A2E]/20 rounded-2xl text-[#2D5A3D] text-[13px] font-bold cursor-pointer min-h-[200px] hover:bg-white transition-colors"
            >
              + Add day {days.length + 1}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}