import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { IconBookmark, IconArrowRight } from '../../components/dashboard/icons';
import {
  fetchDestinationBySlug,
  saveDestination,
  unsaveDestination,
  type DestinationWithSaved,
} from '../../api/destinations';

type Status = 'loading' | 'ready' | 'error';

export default function DestinationDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [destination, setDestination] = useState<DestinationWithSaved | null>(null);
  const [status, setStatus] = useState<Status>('loading');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    fetchDestinationBySlug(slug)
      .then((data) => {
        if (cancelled) return;
        setDestination(data);
        setStatus('ready');
      })
      .catch(() => {
        if (cancelled) return;
        setStatus('error');
      });

    return () => { cancelled = true; };
  }, [slug]);

  async function toggleSave() {
    if (!destination || saving) return;
    setSaving(true);
    const wasSaved = destination.isSaved;
    setDestination({ ...destination, isSaved: !wasSaved });
    try {
      if (wasSaved) {
        await unsaveDestination(destination.id);
      } else {
        await saveDestination(destination.id);
      }
    } catch {
      setDestination({ ...destination, isSaved: wasSaved });
    } finally {
      setSaving(false);
    }
  }

  if (status === 'loading') {
    return <p className="text-[13px] text-[#888]">Loading...</p>;
  }

  if (status === 'error' || !destination) {
    return (
      <div>
        <p className="text-[15px] text-[#1C3A2E] mb-3">Couldn't find that destination.</p>
        <Link to="/traveler/explore" className="text-[13px] font-semibold text-[#C4522A]">
          ← Back to Explore
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-12">
      <button
        onClick={() => navigate('/traveler/explore')}
        className="text-[13px] font-semibold text-[#666] hover:text-[#1C3A2E] mb-5 transition-colors"
      >
        ← Back to Explore
      </button>

      {/* Hero */}
      <div
        className="relative h-[280px] rounded-2xl overflow-hidden bg-cover bg-center mb-6"
        style={{ backgroundColor: destination.color, backgroundImage: `url(${destination.coverImageUrl})` }}
      >
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(28,58,46,0.9), transparent 55%)' }}
        />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <p className="text-[11px] uppercase tracking-[0.14em] font-semibold text-[#D4A853] mb-1.5">
            {destination.region}
          </p>
          <h1 className="font-serif text-[32px] text-white leading-tight">{destination.name}</h1>
        </div>
        <button
          onClick={toggleSave}
          disabled={saving}
          className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-colors disabled:opacity-60 ${
            destination.isSaved ? 'bg-[#D4A853] text-[#1C3A2E]' : 'bg-black/40 text-white hover:bg-black/55'
          }`}
          aria-label={destination.isSaved ? 'Remove from saved places' : 'Save this destination'}
        >
          <IconBookmark filled={destination.isSaved} />
        </button>
      </div>

      {/* Description */}
      <p className="text-[15px] text-[#333] leading-relaxed max-w-2xl mb-8">
        {destination.longDescription}
      </p>

      {/* Gallery */}
      {destination.galleryImageUrls.length > 0 && (
        <>
          <h3 className="font-serif text-[19px] text-[#1C3A2E] mb-3">Gallery</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
            {destination.galleryImageUrls.map((url, i) => (
              <div
                key={i}
                className="h-[160px] rounded-xl bg-cover bg-center"
                style={{ backgroundImage: `url(${url})` }}
              />
            ))}
          </div>
        </>
      )}

      <button
        onClick={toggleSave}
        disabled={saving}
        className="inline-flex items-center gap-2 bg-[#1C3A2E] text-[#F5EDD8] px-5 py-2.5 rounded-[10px] text-[13px] font-semibold disabled:opacity-60"
      >
        {destination.isSaved ? 'Saved to your places' : 'Save this destination'}
        {!destination.isSaved && <IconArrowRight />}
      </button>
    </div>
  );
}
