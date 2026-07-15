import { useCallback, useEffect, useState } from 'react';
import { 
  fetchItineraries, 
  fetchItineraryById, 
  createItinerary, 
  generateItinerarySuggestions,
  addItineraryDay,
  addItineraryStop,
  type Itinerary 
} from '../../api/itineraries';
import TrailMap from '../../components/planner/TrailMap';
import PermitCard from '../../components/planner/PermitCard';
import SavedStrip from '../../components/planner/SavedStrip';

export default function TrailPlanner() {
  const [trips, setTrips] = useState<Itinerary[]>([]);
  const [activeTrip, setActiveTrip] = useState<Itinerary | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const loadTripDetails = useCallback(async (id: string) => {
    setLoading(true);
    setIsCreating(false);
    setErrorMsg('');
    try {
      const fullTrip = await fetchItineraryById(id);
      setActiveTrip(fullTrip);
    } catch (err) {
      console.error(err);
      setErrorMsg('Could not load that trip. Try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItineraries()
      .then((data) => {
        setTrips(data);
        if (data.length > 0) {
          void loadTripDetails(data[0].id);
        } else {
          setIsCreating(true);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        setErrorMsg('Could not load your trips. Try refreshing.');
        setLoading(false);
      });
  }, [loadTripDetails]);

 const handleCreateTrip = async (data: { name: string; startDate: string; travelers: number; budget: number }) => {
  setCreateLoading(true);
  setErrorMsg('');
  try {
    const newTrip = await createItinerary(data);
    setTrips((prev) => [...prev, newTrip]);
    await generateItinerarySuggestions(newTrip.id);
    await loadTripDetails(newTrip.id);
  } catch (err) {
    console.error("Failed to create trip:", err);
    setErrorMsg('Could not create that trip. Try again.');
  } finally {
    setCreateLoading(false);
  }
};

  const handleAddDay = async (place: string, date: string, region: string) => {
    if (!activeTrip) return;
    try {
      await addItineraryDay(activeTrip.id, {
        date,
        region,
        place,
        sortOrder: activeTrip.days?.length || 0
      });
      await loadTripDetails(activeTrip.id);
    } catch (err) {
      console.error("Failed to add day:", err);
    }
  };

  const handleAddStop = async (dayId: string, name: string, timeLabel: string) => {
    if (!activeTrip) return;
    const targetDay = activeTrip.days?.find(d => d.id === dayId);
    const nextSortOrder = targetDay?.stops?.length || 0;

    try {
      await addItineraryStop(dayId, {
        name,
        timeLabel,
        cost: 0,
        category: 'Activity', 
        sortOrder: nextSortOrder
      });
      await loadTripDetails(activeTrip.id);
    } catch (err) {
      console.error("Failed to add stop:", err);
    }
  };

  if (loading && !activeTrip && !isCreating) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-6 h-6 border-2 border-[#D4A853] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="pb-12 max-w-[1200px] mx-auto">
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

      {errorMsg && (
        <p className="text-[13px] text-[#C4522A] bg-[#C4522A]/10 rounded-lg px-4 py-2.5 mb-6">
          {errorMsg}
        </p>
      )}

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

      {isCreating && (
        <PermitCard onCreate={handleCreateTrip} loading={createLoading} />
      )}

      {activeTrip && !isCreating && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10 items-start mt-8">
          
          <div className="overflow-hidden">
            <div className="flex items-center gap-2.5 text-[11px] uppercase tracking-[0.18em] text-[#1C3A2E] font-bold mb-4">
              Your trail <div className="flex-1 h-px bg-[#1C3A2E]/15"></div>
            </div>
            
            {activeTrip.days && activeTrip.days.length > 0 ? (
              <TrailMap 
                days={activeTrip.days} 
                onAddDay={handleAddDay} 
                onAddStop={handleAddStop} 
              />
            ) : (
              <div className="border-2 border-dashed border-[#1C3A2E]/10 rounded-2xl p-12 text-center">
                <p className="text-[14px] font-medium text-[#666] mb-4">Your trail is completely empty.</p>
                <button 
                  onClick={() => handleAddDay('New Place', new Date().toISOString().split('T')[0], 'mainland')}
                  className="bg-[#1C3A2E] text-[#F5EDD8] px-5 py-2.5 rounded-[10px] text-[13px] font-semibold"
                >
                  + Add your first day
                </button>
              </div>
            )}

            <SavedStrip 
              days={activeTrip.days ?? []} 
              onStopAdded={() => loadTripDetails(activeTrip.id)}
            />
          </div>

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
                Tracking against your ${(activeTrip.budget ?? 0).toLocaleString()} per-person budget.
              </p>
              
              <div className="h-[9px] rounded-full bg-[#EDE3D0] overflow-hidden mb-2.5">
                <div className="h-full bg-gradient-to-r from-[#D4A853] to-[#C4522A] rounded-full w-[10%]" />
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}