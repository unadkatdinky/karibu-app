import { useEffect, useState } from 'react';
import { fetchSavedPlaces } from '../../api/places';
import { addItineraryStop, type ItineraryDay } from '../../api/itineraries';
import type { Destination } from '../../api/destinations';

interface SavedStripProps {
  days: ItineraryDay[];
  onStopAdded: () => void;
}

export default function SavedStrip({ days, onStopAdded }: SavedStripProps) {
  const [places, setPlaces] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchSavedPlaces()
      .then(setPlaces)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const targetDay = days.length > 0 ? days[days.length - 1] : null;

  async function handleAddToDay(place: Destination) {
    if (!targetDay) return;
    setAddingId(place.id);
    setErrorMsg('');
    try {
      await addItineraryStop(targetDay.id, {
        name: place.name,
        category: 'Activity',
        sortOrder: targetDay.stops?.length ?? 0,
      });
      onStopAdded();
    } catch {
      setErrorMsg(`Could not add ${place.name} — try again.`);
    } finally {
      setAddingId(null);
    }
  }

  if (loading || places.length === 0) return null;

  return (
    <div className="mt-9 mb-6">
      <div className="flex items-center gap-2.5 text-[11px] uppercase tracking-[0.18em] text-[#1C3A2E] font-bold mb-4">
        Your saved places <div className="flex-1 h-px bg-[#1C3A2E]/15"></div>
      </div>

      {errorMsg && <p className="text-[12px] text-[#C4522A] mb-3">{errorMsg}</p>}
      {!targetDay && (
        <p className="text-[12px] text-[#888] mb-3">Add a day to your trail before adding places to it.</p>
      )}

      <div className="flex flex-wrap gap-2.5">
        {places.map((place) => (
          <div key={place.id} className="flex items-center gap-2 bg-white border border-[#1C3A2E]/10 rounded-full p-1.5 pr-2">
            <div
              className="w-[26px] h-[26px] rounded-full bg-cover bg-center"
              style={{ backgroundImage: `url(${place.coverImageUrl})`, backgroundColor: place.color }}
            />
            <span className="text-[13px] font-medium pr-1">{place.name}</span>
            <button
              onClick={() => handleAddToDay(place)}
              disabled={!targetDay || addingId === place.id}
              className="border-none bg-[#EDE3D0] text-[#1C3A2E] rounded-full text-[11px] font-bold px-3 py-1.5 cursor-pointer hover:bg-[#D4A853] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {addingId === place.id ? 'Adding...' : 'Add to day'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}