import { useEffect, useState } from 'react';
import { fetchSavedPlaces } from '../../api/places';
import type { Destination } from '../../api/destinations';

export default function SavedStrip() {
  const [places, setPlaces] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedPlaces()
      .then(setPlaces)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || places.length === 0) return null;

  return (
    <div className="mt-9 mb-6">
      <div className="flex items-center gap-2.5 text-[11px] uppercase tracking-[0.18em] text-[#1C3A2E] font-bold mb-4">
        Your saved places <div className="flex-1 h-px bg-[#1C3A2E]/15"></div>
      </div>
      
      <div className="flex flex-wrap gap-2.5">
        {places.map((place) => (
          <div key={place.id} className="flex items-center gap-2 bg-white border border-[#1C3A2E]/10 rounded-full p-1.5 pr-2">
            <div 
              className="w-[26px] h-[26px] rounded-full bg-cover bg-center"
              style={{ backgroundImage: `url(${place.coverImageUrl})`, backgroundColor: place.color }}
            />
            <span className="text-[13px] font-medium pr-1">{place.name}</span>
            <button className="border-none bg-[#EDE3D0] text-[#1C3A2E] rounded-full text-[11px] font-bold px-3 py-1.5 cursor-pointer hover:bg-[#D4A853] hover:text-white transition-colors">
              Add to day
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}