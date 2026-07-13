import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PageHeader from '../../components/dashboard/PageHeader';
import EmptyState from '../../components/dashboard/EmptyState';
import DestinationTile from '../../components/dashboard/DestinationTile';
import { IconBookmark } from '../../components/dashboard/icons';
import { fetchSavedPlaces } from '../../api/places';
import { unsaveDestination } from '../../api/destinations';
import type { Destination } from '../../api/destinations';

type Status = 'loading' | 'ready' | 'error';

export default function SavedPlaces() {
  const navigate = useNavigate();
  const [places, setPlaces] = useState<Destination[]>([]);
  const [status, setStatus] = useState<Status>('loading');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let cancelled = false;

    fetchSavedPlaces()
      .then((data) => {
        if (cancelled) return;
        setPlaces(data);
        setStatus('ready');
      })
      .catch(() => {
        if (cancelled) return;
        setErrorMsg('Could not load your saved places.');
        setStatus('error');
      });

    return () => { cancelled = true; };
  }, []);

  async function handleRemove(id: string) {
    const snapshot = places;
    setPlaces((prev) => prev.filter((p) => p.id !== id));
    try {
      await unsaveDestination(id);
    } catch {
      setPlaces(snapshot);
      setErrorMsg('Could not remove that place — try again.');
    }
  }

  return (
    <div>
      <PageHeader
        title="Saved places"
        subtitle="All the destinations you've bookmarked."
        action={
          <Link
            to="/traveler/explore"
            className="text-[13px] font-semibold text-[#C4522A] hover:text-[#a53f1f] transition-colors"
          >
            Explore more →
          </Link>
        }
      />

      {errorMsg && (
        <p className="text-[13px] text-[#C4522A] bg-[#C4522A]/10 rounded-lg px-4 py-2.5 mb-4">{errorMsg}</p>
      )}

      {status === 'loading' && (
        <p className="text-[13px] text-[#888]">Loading your saved places...</p>
      )}

      {status === 'ready' && places.length === 0 && (
        <EmptyState
          icon="🗺️"
          title="No saved places yet"
          description="Head to Explore and bookmark the destinations you want to visit."
          action={
            <Link
              to="/traveler/explore"
              className="bg-[#1C3A2E] text-[#F5EDD8] px-5 py-2.5 rounded-[10px] text-[13px] font-semibold inline-block"
            >
              Explore destinations
            </Link>
          }
        />
      )}

      {status === 'ready' && places.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {places.map((place) => (
            <div key={place.id} className="group relative">
              <DestinationTile
                name={place.name}
                color={place.color}
                image={place.coverImageUrl}
                onClick={() => navigate(`/traveler/explore/${place.slug}`)}
              />
              <button
                onClick={(e) => { e.stopPropagation(); handleRemove(place.id); }}
                aria-label={`Remove ${place.name}`}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[#D4A853] text-[#1C3A2E] flex items-center justify-center transition-opacity"
              >
                <IconBookmark filled />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
