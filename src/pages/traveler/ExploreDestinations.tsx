import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/dashboard/PageHeader';
import EmptyState from '../../components/dashboard/EmptyState';
import DestinationTile from '../../components/dashboard/DestinationTile';
import { IconBookmark } from '../../components/dashboard/icons';
import {
  fetchDestinations,
  saveDestination,
  unsaveDestination,
  type DestinationWithSaved,
} from '../../api/destinations';

type Status = 'loading' | 'ready' | 'error';

export default function ExploreDestinations() {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState<DestinationWithSaved[]>([]);
  const [status, setStatus] = useState<Status>('loading');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let cancelled = false;

    fetchDestinations()
      .then((data) => {
        if (cancelled) return;
        setDestinations(data);
        setStatus('ready');
      })
      .catch(() => {
        if (cancelled) return;
        setErrorMsg('Could not load destinations.');
        setStatus('error');
      });

    return () => { cancelled = true; };
  }, []);

  async function toggleSave(d: DestinationWithSaved) {
    // Optimistic update — flip the icon immediately, roll back on failure.
    setDestinations((prev) =>
      prev.map((item) => (item.id === d.id ? { ...item, isSaved: !item.isSaved } : item))
    );
    try {
      if (d.isSaved) {
        await unsaveDestination(d.id);
      } else {
        await saveDestination(d.id);
      }
    } catch {
      setDestinations((prev) =>
        prev.map((item) => (item.id === d.id ? { ...item, isSaved: d.isSaved } : item))
      );
      setErrorMsg('Could not update that bookmark — try again.');
    }
  }

  return (
    <div>
      <PageHeader title="Explore" subtitle="Browse East Africa's most-loved destinations." />

      {errorMsg && (
        <p className="text-[13px] text-[#C4522A] bg-[#C4522A]/10 rounded-lg px-4 py-2.5 mb-4">{errorMsg}</p>
      )}

      {status === 'loading' && (
        <p className="text-[13px] text-[#888]">Loading destinations...</p>
      )}

      {status === 'ready' && destinations.length === 0 && (
        <EmptyState icon="🧭" title="No destinations yet" description="Check back soon." />
      )}

      {status === 'ready' && destinations.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {destinations.map((d) => (
            <div key={d.id} className="group relative">
              <DestinationTile
                name={d.name}
                color={d.color}
                image={d.coverImageUrl}
                onClick={() => navigate(`/traveler/explore/${d.slug}`)}
              />
              <button
                onClick={(e) => { e.stopPropagation(); toggleSave(d); }}
                aria-label={d.isSaved ? `Remove ${d.name} from saved places` : `Save ${d.name}`}
                className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                  d.isSaved ? 'bg-[#D4A853] text-[#1C3A2E]' : 'bg-black/40 text-white opacity-0 group-hover:opacity-100'
                }`}
              >
                <IconBookmark filled={d.isSaved} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
