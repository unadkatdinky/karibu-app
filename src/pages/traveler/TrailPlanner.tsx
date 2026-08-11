import { useEffect, useState } from 'react';
import {
  fetchItineraries,
  fetchItineraryById,
  createItinerary,
  addItineraryDay,
  addItineraryStop,
  deleteItineraryDay,
  deleteItineraryStop,
  type Itinerary,
  generateItinerarySuggestions,
} from '../../api/itineraries';
import DayTimeline from '../../components/planner/DayTimeline';
import PermitCard from '../../components/planner/PermitCard';
import SavedStrip from '../../components/planner/SavedStrip';
import ExchangeMeter from '../../components/planner/ExchangeMeter';
import BeadDivider from '../../components/planner/BeadDivider';
import Loader from '../../components/common/Loader';
import { Plus } from 'lucide-react';

export default function TrailPlanner() {
  const [trips, setTrips] = useState<Itinerary[]>([]);
  const [activeTrip, setActiveTrip] = useState<Itinerary | null>(null);

  // UI States
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  // 1. Load top-level trips on mount
  useEffect(() => {
    fetchItineraries()
      .then((data) => {
        const tripsList = data || [];
        setTrips(tripsList);
        if (tripsList.length > 0) {
          loadTripDetails(tripsList[0].id);
        } else {
          setIsCreating(true);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        setTrips([]);
        setLoading(false);
      });
  }, []);

  // 2. Fetch full details (days & stops)
  const loadTripDetails = async (id: string) => {
    setLoading(true);
    setIsCreating(false);
    try {
      const fullTrip = await fetchItineraryById(id);
      setActiveTrip(fullTrip);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 3. Handle Permit Submission
  const handleCreateTrip = async (data: { name: string; startDate: string; travelers: number; budget: number }) => {
    setCreateLoading(true);
    try {
      const newTrip = await createItinerary(data);
      await generateItinerarySuggestions(newTrip.id);
      const freshTrips = await fetchItineraries();
      setTrips(freshTrips || []);
      await loadTripDetails(newTrip.id);
    } catch (err) {
      console.error('Failed to create trip:', err);
    } finally {
      setCreateLoading(false);
    }
  };

  // 4. Add a day to the active trail, then refresh
  const handleAddDay = async (place: string, date: string, region: string) => {
    if (!activeTrip) return;
    await addItineraryDay(activeTrip.id, {
      place,
      date,
      region,
      sortOrder: activeTrip.days?.length ?? 0,
    });
    await loadTripDetails(activeTrip.id);
  };

  // 5. Add a stop to a specific day, then refresh
  const handleAddStop = async (dayId: string, name: string, timeLabel: string, category?: string, cost?: number) => {
    if (!activeTrip) return;
    await addItineraryStop(dayId, { name, timeLabel, category, cost });
    await loadTripDetails(activeTrip.id);
  };

  // 6. Delete day
  const handleDeleteDay = async (dayId: string) => {
    if (!activeTrip) return;
    try {
      await deleteItineraryDay(dayId);
      await loadTripDetails(activeTrip.id);
    } catch (err) {
      console.error('Failed to delete day:', err);
    }
  };

  // 7. Delete stop
  const handleDeleteStop = async (stopId: string) => {
    if (!activeTrip) return;
    try {
      await deleteItineraryStop(stopId);
      await loadTripDetails(activeTrip.id);
    } catch (err) {
      console.error('Failed to delete stop:', err);
    }
  };

  // 8. Budget breakdown computed from actual stop costs
  const budgetBreakdown = (() => {
    const totals: Record<string, number> = {};
    activeTrip?.days?.forEach((day) => {
      day.stops?.forEach((stop) => {
        totals[stop.category || 'Other'] = (totals[stop.category || 'Other'] || 0) + (stop.cost || 0);
      });
    });
    const spent = Object.values(totals).reduce((sum, n) => sum + n, 0);
    return { spent, entries: Object.entries(totals) };
  })();

  if (loading && !activeTrip && !isCreating) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  }

  return (
    <div className="pb-12 max-w-[1100px] mx-auto px-4 md:px-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <p className="text-[10px] font-mono tracking-widest text-[#C4522A] uppercase font-bold mb-1">
            Karibu Tours · Expeditions
          </p>
          <h1 className="font-serif text-[30px] md:text-[36px] text-[#1C3A2E] font-semibold leading-tight m-0">
            Build your East Africa trail
          </h1>
          <p className="text-[14px] text-[#666] leading-relaxed max-w-[540px] mt-1.5 m-0">
            Pull in saved places, borrow local guide routes, or stamp in custom stops.
            Season, weather, and packing notes adapt as you plan.
          </p>
        </div>
        <button
          onClick={() => { setActiveTrip(null); setIsCreating(true); }}
          disabled={createLoading}
          className="flex items-center gap-1.5 bg-[#1C3A2E] text-white rounded-xl px-4 py-2.5 text-[13px] font-bold hover:bg-[#152e24] transition-colors shrink-0 self-start md:self-auto"
        >
          <Plus size={15} /> New trip
        </button>
      </div>

      <BeadDivider />

      {/* Trip Switcher Cards */}
      {trips.length > 0 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-3 mb-6">
          {trips.map((trip, i) => (
            <button
              key={trip.id}
              onClick={() => loadTripDetails(trip.id)}
              className={`karibu-card flex-none flex flex-col justify-between bg-white border-[1.5px] rounded-2xl p-3.5 text-left w-[180px] h-[100px] relative overflow-hidden ${
                activeTrip?.id === trip.id && !isCreating
                  ? 'border-[#C4522A] ring-2 ring-[#C4522A]/15 shadow-sm'
                  : 'border-[#1C3A2E]/12 hover:border-[#1C3A2E]/30'
              }`}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div>
                <span className="text-[12.5px] font-bold text-[#1C3A2E] truncate block w-full leading-snug">
                  {trip.name}
                </span>
                <span className="text-[10.5px] text-[#666] font-mono block mt-0.5">
                  {trip.days?.length || 0} day{(trip.days?.length || 0) === 1 ? '' : 's'}
                </span>
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#1C3A2E]/8">
                <span className="text-[10px] font-mono text-[#C4522A] font-bold uppercase">
                  {trip.travelers} traveler{trip.travelers === 1 ? '' : 's'}
                </span>
                <span className="w-5 h-5 rounded-full bg-[#1C3A2E]/5 border border-dashed border-[#C4522A] text-[9px] font-serif font-bold text-[#C4522A] flex items-center justify-center">
                  {trip.travelers}p
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* View: Creating a New Trip */}
      {isCreating && (
        createLoading ? (
          <div className="bg-white border border-[#1C3A2E]/10 rounded-[18px] shadow-sm py-16 flex items-center justify-center mb-8">
            <Loader />
          </div>
        ) : (
          <PermitCard onCreate={handleCreateTrip} loading={createLoading} />
        )
      )}

      {/* View: Active Trip Loaded */}
      {activeTrip && !isCreating && (
        <>
          {/* Active Trip Hero Banner */}
          <div
            className="rounded-2xl p-6 md:p-7 mb-6 border border-[#1C3A2E]/10 relative overflow-hidden shadow-sm karibu-fade-up"
            style={{
              background: 'linear-gradient(120deg, #F5EDD8 0%, #FAF8F4 70%)',
            }}
          >
            <div className="flex flex-wrap items-start justify-between gap-5 relative z-10">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest font-bold text-[#C4522A] mb-1">
                  Active Trail // {activeTrip.days?.length || 0} Day{(activeTrip.days?.length || 0) === 1 ? '' : 's'}
                </p>
                <h2 className="font-serif text-[24px] md:text-[28px] text-[#1C3A2E] font-semibold m-0">
                  {activeTrip.name}
                </h2>
              </div>
              <div className="flex gap-2.5 flex-wrap">
                <span className="inline-flex items-center gap-1.5 bg-white text-[#C4522A] text-[12px] font-bold px-3 py-1.5 rounded-full border border-[#1C3A2E]/8 shadow-2xs">
                  ☀ {activeTrip.season || 'Season TBD'}
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white text-[#1C3A2E] text-[12px] font-bold px-3 py-1.5 rounded-full border border-[#1C3A2E]/8 shadow-2xs">
                  {activeTrip.travelers} traveler{activeTrip.travelers === 1 ? '' : 's'}
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white text-[#1C3A2E] text-[12px] font-bold px-3 py-1.5 rounded-full border border-[#1C3A2E]/8 shadow-2xs">
                  ${activeTrip.budget.toLocaleString()} / person
                </span>
              </div>
            </div>
            {activeTrip.days && activeTrip.days.length > 0 && (
              <div className="flex gap-1.5 mt-4 relative z-10">
                {activeTrip.days.map((day) => (
                  <span
                    key={day.id}
                    className="flex-1 h-1.5 rounded-full"
                    style={{ background: day.region === 'coast' ? '#1E4B65' : '#2D5A3D' }}
                    title={day.place}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Interactive Exchange Meter Widget */}
          <ExchangeMeter
            spent={budgetBreakdown.spent}
            budget={activeTrip.budget}
            travelers={activeTrip.travelers}
          />

          <BeadDivider />

          {/* Main Layout: Timeline & Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_310px] gap-8 items-start">
            {/* Timeline & Saved Strip */}
            <div className="overflow-hidden">
              <div className="flex items-center gap-2.5 text-[11px] uppercase tracking-[0.18em] text-[#1C3A2E] font-bold mb-5">
                Your Trail Itinerary <div className="flex-1 h-px bg-[#1C3A2E]/15"></div>
              </div>

              {activeTrip.days && activeTrip.days.length > 0 ? (
                <DayTimeline
                  days={activeTrip.days}
                  onAddDay={handleAddDay}
                  onAddStop={handleAddStop}
                  onDeleteDay={handleDeleteDay}
                  onDeleteStop={handleDeleteStop}
                />
              ) : (
                <div className="border-2 border-dashed border-[#1C3A2E]/10 rounded-2xl p-12 text-center bg-white/60">
                  <p className="text-[14px] font-medium text-[#666] mb-4">Your trail is currently empty.</p>
                  <button
                    onClick={() => handleAddDay('Arusha', new Date().toISOString().split('T')[0], 'mainland')}
                    className="bg-[#1C3A2E] text-white px-5 py-2.5 rounded-[10px] text-[13px] font-semibold"
                  >
                    + Add your first day
                  </button>
                </div>
              )}

              <SavedStrip days={activeTrip.days || []} onStopAdded={() => loadTripDetails(activeTrip.id)} />
            </div>

            {/* Sidebar: Field Notes & Checklist */}
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2.5 text-[11px] uppercase tracking-[0.18em] text-[#1C3A2E] font-bold mb-1">
                Field Notes <div className="flex-1 h-px bg-[#1C3A2E]/15"></div>
              </div>

              <div className="bg-white rounded-2xl rounded-tl-sm p-5 relative shadow-sm border border-[#1C3A2E]/8">
                <div className="absolute -top-2.5 left-5 w-[58px] h-5 bg-[#F5EDD8] opacity-90 -rotate-3 shadow-xs border border-[#1C3A2E]/10"></div>
                <p className="font-serif text-[17px] text-[#1C3A2E] mt-1 mb-1 font-semibold">Best time to go</p>
                <p className="text-[13px] text-[#666] mb-3 leading-relaxed">
                  {activeTrip.seasonNote || 'Generating season insights based on your route...'}
                </p>
                <span className="inline-flex items-center gap-1.5 bg-[#F5EDD8] text-[#C4522A] text-[12px] font-bold px-3 py-1.5 rounded-full">
                  ☀ {activeTrip.season || 'TBD'}
                </span>
              </div>

              <div className="bg-white rounded-2xl rounded-tl-sm p-5 relative shadow-sm border border-[#1C3A2E]/8">
                <div className="absolute -top-2.5 left-5 w-[58px] h-5 bg-[#F5EDD8] opacity-90 -rotate-3 shadow-xs border border-[#1C3A2E]/10"></div>
                <p className="font-serif text-[17px] text-[#1C3A2E] mt-1 mb-1 font-semibold">Budget breakdown</p>
                <p className="text-[13px] text-[#666] mb-3 leading-relaxed">
                  ${budgetBreakdown.spent.toLocaleString()} spent across {budgetBreakdown.entries.length} category entries.
                </p>
                <div className="flex flex-col gap-1.5 text-[12px] text-[#666] font-mono border-t border-[#1C3A2E]/8 pt-2.5">
                  {budgetBreakdown.entries.length > 0 ? (
                    budgetBreakdown.entries.map(([category, amount]) => (
                      <div key={category} className="flex justify-between items-center">
                        <span className="text-[#1a1a1a] font-sans">{category}</span>
                        <span className="font-bold text-[#1C3A2E]">${amount.toLocaleString()}</span>
                      </div>
                    ))
                  ) : (
                    <span>No cost items recorded yet</span>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl rounded-tl-sm p-5 relative shadow-sm border border-[#1C3A2E]/8">
                <div className="absolute -top-2.5 left-5 w-[58px] h-5 bg-[#F5EDD8] opacity-90 -rotate-3 shadow-xs border border-[#1C3A2E]/10"></div>
                <p className="font-serif text-[17px] text-[#1C3A2E] mt-1 mb-1 font-semibold">Don't forget</p>
                <p className="text-[13px] text-[#666] mb-3 leading-relaxed">
                  Key essential preparations for your trail.
                </p>
                <ChecklistCard />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Static packing checklist component
function ChecklistCard() {
  const [checked, setChecked] = useState<Record<string, boolean>>({ 'Yellow fever certificate': true });
  const items = [
    'Yellow fever certificate',
    'Reef-safe sunscreen',
    'Modest cover-up for coastal towns',
    'Cash for market bargaining',
  ];

  return (
    <ul className="list-none m-0 p-0">
      {items.map((item) => (
        <li
          key={item}
          onClick={() => setChecked((prev) => ({ ...prev, [item]: !prev[item] }))}
          className="flex items-center gap-2.5 text-[13px] py-1.5 border-b border-[#1C3A2E]/5 last:border-0 cursor-pointer"
        >
          <input
            type="checkbox"
            checked={!!checked[item]}
            readOnly
            className="accent-[#D4A853] w-[15px] h-[15px]"
          />
          <span className={checked[item] ? 'line-through text-[#666]' : 'text-[#1a1a1a]'}>{item}</span>
        </li>
      ))}
    </ul>
  );
}