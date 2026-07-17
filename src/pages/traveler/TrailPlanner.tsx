import { useEffect, useState } from 'react';
import {
  fetchItineraries,
  fetchItineraryById,
  createItinerary,
  addItineraryDay,
  addItineraryStop,
  type Itinerary,
  generateItinerarySuggestions,
} from '../../api/itineraries';
import TrailMap from '../../components/planner/TrailMap';
import PermitCard from '../../components/planner/PermitCard';
import SavedStrip from '../../components/planner/SavedStrip';
import LoadingState from '../../components/ui/LoadingState';

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
        const trips = data || [];
        setTrips(trips);
        if (trips.length > 0) {
          loadTripDetails(trips[0].id);
        } else {
          setIsCreating(true); // If they have no trips, default to the creation screen
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
    setIsCreating(false); // Hide the permit card
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
    setLoading(true); // Put the entire screen into global loading mode immediately
    setCreateLoading(true);
    setIsCreating(false);
    try {
      // 1. Create the base entry record
      const newTrip = await createItinerary(data);

      // 2. Await the complete generation engine execution
      await generateItinerarySuggestions(newTrip.id);

      // 3. Update top-level trips index silently
      const refreshedTrips = await fetchItineraries();
      setTrips(refreshedTrips || []);

      // 4. Load the fully populated trip artifact directly
      await loadTripDetails(newTrip.id);
    } catch (err) {
      console.error("Failed to map pipeline trip generation:", err);
      setIsCreating(true); // Return fallback layout context
      setLoading(false);
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
  const handleAddStop = async (dayId: string, name: string, timeLabel: string) => {
    if (!activeTrip) return;
    await addItineraryStop(dayId, { name, timeLabel });
    await loadTripDetails(activeTrip.id);
  };

  // 6. Budget breakdown, computed from actual stop costs (not a placeholder bar)
  const days = activeTrip?.days ?? [];
  const budgetBreakdown = (() => {
    const totals: Record<string, number> = {};
    days.forEach((day) => {
      day.stops?.forEach((stop) => {
        totals[stop.category || 'Other'] = (totals[stop.category || 'Other'] || 0) + (stop.cost || 0);
      });
    });
    const spent = Object.values(totals).reduce((sum, n) => sum + n, 0);
    return { spent, entries: Object.entries(totals) };
  })();

  if (loading && !activeTrip && !isCreating) {
    return (
      <div className="flex justify-center items-center min-h-[420px] px-4 py-10">
        <LoadingState
          message="Crafting your itinerary..."
          submessage="The AI is mapping routes, seasons, and stops for your journey."
        />
      </div>
    );
  }

  return (
    <div className="pb-12 max-w-[1200px] mx-auto">
      {/* Header */}
      <p className="text-[11px] uppercase tracking-[0.22em] font-bold text-[#D4A853] mb-3">
        Plan your journey
      </p>
      <h1 className="font-serif text-[42px] md:text-[56px] text-[#1C3A2E] leading-tight mb-4">
        Build your East Africa trail
      </h1>
      <p className="text-[15px] text-[#666] leading-relaxed max-w-[520px] mb-8">
        Pull in the places you've saved, borrow a route from a local guide, or start blank.
        We'll stamp in the season, the weather, and what to pack as you go.
      </p>

      {/* Trip Switcher Strip */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 mb-6">
        {trips.map((trip) => (
          <button
            key={trip.id}
            onClick={() => loadTripDetails(trip.id)}
            className={`flex-none flex flex-col gap-1.5 bg-white border-[1.5px] rounded-xl px-4 py-2.5 text-left min-w-[150px] transition-all ${
              activeTrip?.id === trip.id && !isCreating
                ? 'border-[#C4522A] ring-2 ring-[#C4522A]/10 shadow-sm'
                : 'border-[#1C3A2E]/10 hover:border-[#1C3A2E]/30'
            }`}
          >
            <span className="text-[12.5px] font-bold text-[#1C3A2E] truncate w-full">
              {trip.name}
            </span>
            <span className="text-[10.5px] text-[#666] flex justify-between gap-2">
              <span>{trip.days?.length || 0} days</span>
              <span className="flex gap-[3px]">
                {Array.from(new Set(trip.days?.map((d) => d.region))).map((region) => (
                  <i
                    key={region}
                    className="w-[14px] h-[4px] rounded-sm inline-block"
                    style={{ background: region === 'coast' ? '#1E4B65' : '#2D5A3D' }}
                  />
                ))}
              </span>
            </span>
          </button>
        ))}
        <button
          onClick={() => { setActiveTrip(null); setIsCreating(true); }}
          className={`flex-none flex items-center justify-center min-w-[96px] h-[58px] border-[1.5px] border-dashed rounded-xl text-[12.5px] font-bold transition-all ${
            isCreating
              ? 'border-[#2D5A3D] bg-white text-[#2D5A3D]'
              : 'border-[#1C3A2E]/25 text-[#2D5A3D] hover:bg-white hover:border-[#2D5A3D]'
          }`}
        >
          + New
        </button>
      </div>

      {/* Legend */}
      <div className="flex gap-5 mb-5">
        <span className="inline-flex items-center gap-1.5 text-[12px] text-[#666] font-medium">
          <i className="w-[9px] h-[9px] rounded-full inline-block bg-[#2D5A3D]" /> Mainland
        </span>
        <span className="inline-flex items-center gap-1.5 text-[12px] text-[#666] font-medium">
          <i className="w-[9px] h-[9px] rounded-full inline-block bg-[#1E4B65]" /> Coast
        </span>
      </div>

      {/* View: Creating a New Trip */}
      {isCreating && (
        <PermitCard onCreate={handleCreateTrip} loading={createLoading} />
      )}

      {/* Overview strip */}
      {activeTrip && !isCreating && activeTrip.days && activeTrip.days.length > 0 && (
        <div className="flex items-center gap-2.5 mt-8 mb-1.5">
          {days.map((day, i) => (
            <div key={day.id} className="flex items-center gap-2.5 flex-1 last:flex-none">
              <div
                className="w-[26px] h-[26px] rounded-full text-white text-[11px] font-bold flex items-center justify-center shrink-0"
                style={{ background: day.region === 'coast' ? '#1E4B65' : '#2D5A3D' }}
              >
                {i + 1}
              </div>
              {i < days.length - 1 && (
                <div
                  className="flex-1 h-[2px]"
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(90deg, rgba(28,58,46,.25) 0 6px, transparent 6px 11px)',
                  }}
                />
              )}
            </div>
          ))}
          <span className="text-[12px] text-[#666] ml-2 whitespace-nowrap">
            {days.length} days planned
          </span>
        </div>
      )}

      {/* View: Active Trip Loaded */}
      {activeTrip && !isCreating && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10 items-start mt-8">

          {/* Main Content Area: Map & Saved Places */}
          <div className="overflow-hidden">
            <div className="flex items-center gap-2.5 text-[11px] uppercase tracking-[0.18em] text-[#1C3A2E] font-bold mb-4">
              Your trail <div className="flex-1 h-px bg-[#1C3A2E]/15"></div>
            </div>

            {days.length > 0 ? (
              <TrailMap days={days} onAddDay={handleAddDay} onAddStop={handleAddStop} />
            ) : (
              <div className="border-2 border-dashed border-[#1C3A2E]/10 rounded-2xl p-12 text-center">
                <p className="text-[14px] font-medium text-[#666] mb-4">Your trail is completely empty.</p>
                <button className="bg-[#1C3A2E] text-[#F5EDD8] px-5 py-2.5 rounded-[10px] text-[13px] font-semibold">
                  + Add your first day
                </button>
              </div>
            )}

            <SavedStrip days={days} onStopAdded={() => loadTripDetails(activeTrip.id)} />
          </div>

          {/* Sidebar: Dynamic Field Notes */}
          <div className="flex flex-col gap-5">
             <div className="flex items-center gap-2.5 text-[11px] uppercase tracking-[0.18em] text-[#1C3A2E] font-bold mb-1">
              Field notes <div className="flex-1 h-px bg-[#1C3A2E]/15"></div>
            </div>

            <div className="bg-white rounded-2xl rounded-tl-sm p-5 relative shadow-sm border border-[#1C3A2E]/5">
              <div className="absolute -top-2.5 left-5 w-[58px] h-5 bg-[#F5EDD8] opacity-90 -rotate-3 shadow-sm border border-[#1C3A2E]/10"></div>

              <p className="font-serif text-[18px] text-[#1C3A2E] mt-1 mb-1">Best time to go</p>
              <p className="text-[12.5px] text-[#666] italic mb-3 leading-relaxed">
                {activeTrip.seasonNote || 'Generating season insights based on your route...'}
              </p>

              <span className="inline-flex items-center gap-1.5 bg-[#F5EDD8] text-[#C4522A] text-[12px] font-bold px-3 py-1.5 rounded-full">
                ☀ {activeTrip.season || 'TBD'}
              </span>
            </div>

            <div className="bg-white rounded-2xl rounded-tl-sm p-5 relative shadow-sm border border-[#1C3A2E]/5">
              <div className="absolute -top-2.5 left-5 w-[58px] h-5 bg-[#F5EDD8] opacity-90 -rotate-3 shadow-sm border border-[#1C3A2E]/10"></div>

              <p className="font-serif text-[18px] text-[#1C3A2E] mt-1 mb-1">Budget tracker</p>
              <p className="text-[12.5px] text-[#666] italic mb-3 leading-relaxed">
                ${budgetBreakdown.spent.toLocaleString()} of your ${activeTrip.budget.toLocaleString()} per-person budget spent so far, based on what you've added.
              </p>

              <div className="h-[9px] rounded-full bg-[#EDE3D0] overflow-hidden mb-2.5">
                <div
                  className="h-full bg-gradient-to-r from-[#D4A853] to-[#C4522A] rounded-full"
                  style={{
                    width: `${activeTrip.budget > 0 ? Math.min(100, Math.round((budgetBreakdown.spent / activeTrip.budget) * 100)) : 0}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-[#666]">
                {budgetBreakdown.entries.length > 0 ? (
                  budgetBreakdown.entries.map(([category, amount]) => (
                    <span key={category}>{category} ${amount.toLocaleString()}</span>
                  ))
                ) : (
                  <span>No costs added yet</span>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl rounded-tl-sm p-5 relative shadow-sm border border-[#1C3A2E]/5">
              <div className="absolute -top-2.5 left-5 w-[58px] h-5 bg-[#F5EDD8] opacity-90 -rotate-3 shadow-sm border border-[#1C3A2E]/10"></div>

              <p className="font-serif text-[18px] text-[#1C3A2E] mt-1 mb-1">Don't forget</p>
              <p className="text-[12.5px] text-[#666] italic mb-3 leading-relaxed">
                A few general essentials for East Africa — swap these for a packing list once you add one.
              </p>
              <ChecklistCard />
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

// Static packing checklist — presentational only, no backend model yet.
// Swap this out once there's a real packing-list endpoint to persist checked state.
function ChecklistCard() {
  const [checked, setChecked] = useState<Record<string, boolean>>({ 'Yellow fever certificate': true });
  const items = ['Yellow fever certificate', 'Reef-safe sunscreen', 'Modest cover-up for coastal towns', 'Cash for market bargaining'];

  return (
    <ul className="list-none m-0 p-0">
      {items.map((item) => (
        <li
          key={item}
          onClick={() => setChecked((prev) => ({ ...prev, [item]: !prev[item] }))}
          className="flex items-center gap-2.5 text-[13px] py-1.5 border-b border-[#1C3A2E]/5 last:border-0 cursor-pointer"
        >
          <input type="checkbox" checked={!!checked[item]} readOnly className="accent-[#D4A853] w-[15px] h-[15px]" />
          <span className={checked[item] ? 'line-through text-[#666]' : ''}>{item}</span>
        </li>
      ))}
    </ul>
  );
}