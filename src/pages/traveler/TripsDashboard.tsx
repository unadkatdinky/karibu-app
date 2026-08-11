import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchItineraries, type Itinerary } from '../../api/itineraries';
import BeadDivider from '../../components/planner/BeadDivider';
import Loader from '../../components/common/Loader';
import { Plus } from 'lucide-react';

export default function TripsDashboard() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchItineraries()
      .then((data) => {
        setTrips(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setErrorMsg('Could not load itineraries.');
        setLoading(false);
      });
  }, []);

  // Compute summary stats
  const totalTrips = trips.length;
  const upcomingTrips = trips.filter((t) => {
    if (!t.startDate) return false;
    return new Date(t.startDate) >= new Date();
  }).length;
  const combinedBudget = trips.reduce((sum, t) => sum + (t.budget || 0), 0);

  const getTripSpent = (trip: Itinerary) => {
    let spent = 0;
    trip.days?.forEach((d) => {
      d.stops?.forEach((s) => {
        spent += s.cost || 0;
      });
    });
    return spent;
  };

  const getStatusChip = (trip: Itinerary) => {
    const dayCount = trip.days?.length || 0;
    if (dayCount === 0) {
      return { label: 'Draft', bg: '#E8F2F6', text: '#1E4B65' };
    }
    const spent = getTripSpent(trip);
    const budget = trip.budget || 1;
    const ratio = spent / budget;

    if (spent > budget) {
      return { label: 'Over budget', bg: '#FEEAEA', text: '#C4522A' };
    }
    if (ratio > 0.75) {
      return { label: 'Getting tight', bg: '#FEF3C7', text: '#D4A853' };
    }
    return { label: 'On budget', bg: '#F5EDD8', text: '#2D5A3D' };
  };

  const formatDateRange = (startDate?: string, endDate?: string) => {
    if (!startDate) return 'Dates TBD';
    const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    const startStr = new Date(startDate).toLocaleDateString(undefined, opts);
    if (!endDate) return startStr;
    const endStr = new Date(endDate).toLocaleDateString(undefined, opts);
    return `${startStr} – ${endStr}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  }

  return (
    <div className="pb-12 max-w-[1100px] mx-auto px-4 md:px-6">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2">
        <div>
          <p className="text-[10px] font-mono tracking-widest text-[#C4522A] uppercase font-bold mb-1">
            Karibu Tours · Expeditions
          </p>
          <h1 className="font-serif text-[30px] md:text-[36px] text-[#1C3A2E] font-semibold leading-tight m-0">
            My Itineraries
          </h1>
        </div>
        <button
          onClick={() => navigate('/trips/new')}
          className="flex items-center gap-1.5 bg-[#C4522A] text-white rounded-xl px-4 py-2.5 text-[13px] font-bold hover:bg-[#a8441f] transition-colors shrink-0 shadow-xs"
        >
          <Plus size={15} /> New trip
        </button>
      </div>

      {/* Summary Metrics Row */}
      <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-[#666] uppercase tracking-wider py-2">
        <span>TOTAL TRIPS: <strong className="text-[#1C3A2E] font-bold">{totalTrips}</strong></span>
        <span>·</span>
        <span>UPCOMING: <strong className="text-[#2D5A3D] font-bold">{upcomingTrips}</strong></span>
        <span>·</span>
        <span>COMBINED BUDGET: <strong className="text-[#1C3A2E] font-bold">${combinedBudget.toLocaleString()}</strong></span>
      </div>

      <BeadDivider />

      {errorMsg && (
        <p className="text-[13px] text-[#C4522A] bg-[#C4522A]/10 rounded-lg px-4 py-2.5 mb-6">{errorMsg}</p>
      )}

      {/* Zero Trips Empty State */}
      {trips.length === 0 ? (
        <div className="border-2 border-dashed border-[#1C3A2E]/15 rounded-2xl p-12 text-center bg-[#FCFAF6] my-6">
          <p className="text-[10px] font-mono tracking-widest text-[#C4522A] uppercase font-bold mb-2">No Active Permits</p>
          <h2 className="font-serif text-[22px] text-[#1C3A2E] font-semibold mb-2">You have no trips planned yet</h2>
          <p className="text-[14px] text-[#666] max-w-[420px] mx-auto mb-6 leading-relaxed">
            Issue your first East Africa entry permit to generate AI-assisted routes, weather insights, and daily trail stops.
          </p>
          <button
            onClick={() => navigate('/trips/new')}
            className="bg-[#C4522A] text-white px-6 py-3 rounded-xl text-[13px] font-bold hover:bg-[#a8441f] transition-colors shadow-sm"
          >
            + Create your first trip
          </button>
        </div>
      ) : (
        /* Trips Cards Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {trips.map((trip, i) => {
            const status = getStatusChip(trip);
            const isDraft = (trip.days?.length || 0) === 0;
            const regionColor = trip.days?.[0]?.region === 'coast' ? '#1E4B65' : '#2D5A3D';

            return (
              <div
                key={trip.id}
                onClick={() => navigate(`/trips/${trip.id}`)}
                className="karibu-card cursor-pointer bg-white rounded-2xl border-[1.5px] border-[#1C3A2E]/12 overflow-hidden shadow-xs text-left flex flex-col justify-between"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {/* Header Band: Cover photo or Gradient-Icon Swatch Fallback */}
                {trip.coverImageUrl ? (
                  <div className="relative h-[130px] w-full overflow-hidden bg-[#1C3A2E]/5">
                    <img
                      src={trip.coverImageUrl}
                      alt={trip.name}
                      className="w-full h-full object-cover"
                    />
                    <div
                      className="absolute inset-0"
                      style={{ background: 'linear-gradient(180deg, rgba(28,58,46,0) 35%, rgba(28,58,46,0.65) 100%)' }}
                    />
                    <span className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 border border-dashed border-[#C4522A] flex items-center justify-center font-serif text-[11px] font-bold text-[#C4522A]">
                      {trip.travelers}p
                    </span>
                  </div>
                ) : (
                  <div
                    className="h-[130px] w-full flex items-center justify-center relative"
                    style={{
                      background: `linear-gradient(135deg, ${regionColor}22, ${regionColor}0a)`,
                    }}
                  >
                    <span className="text-[36px]">🧭</span>
                    <span className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 border border-dashed border-[#C4522A] flex items-center justify-center font-serif text-[11px] font-bold text-[#C4522A]">
                      {trip.travelers}p
                    </span>
                  </div>
                )}

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-serif text-[18px] text-[#1C3A2E] font-semibold leading-tight m-0">
                        {trip.name}
                      </h3>
                      <span
                        className="text-[10px] font-bold uppercase tracking-[0.08em] px-2 py-0.5 rounded-full shrink-0 font-mono"
                        style={{ background: status.bg, color: status.text }}
                      >
                        {status.label}
                      </span>
                    </div>

                    <p className="text-[11.5px] text-[#666] font-mono m-0">
                      {formatDateRange(trip.startDate, trip.endDate)}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#1C3A2E]/8 flex items-center justify-between text-[11.5px] font-mono text-[#666]">
                    <span>{trip.travelers} traveler{trip.travelers === 1 ? '' : 's'}</span>
                    <span className="font-bold text-[#1C3A2E]">
                      {isDraft ? '0 Days Stamped' : `${trip.days?.length || 0} Days`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
