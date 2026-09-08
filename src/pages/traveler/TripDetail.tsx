import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  fetchItineraries,
  fetchItineraryById,
  addItineraryDay,
  addItineraryStop,
  deleteItineraryDay,
  deleteItineraryStop,
  updateItineraryDay,
  updateItineraryStop,
  type Itinerary,
} from '../../api/itineraries';
import DayTimeline from '../../components/planner/DayTimeline';
import SavedStrip from '../../components/planner/SavedStrip';
import BeadDivider from '../../components/planner/BeadDivider';
import Loader from '../../components/common/Loader';
import { ArrowLeft, ChevronDown, Compass, DollarSign, CheckSquare } from 'lucide-react';

export default function TripDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [trips, setTrips] = useState<Itinerary[]>([]);
  const [activeTrip, setActiveTrip] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    // Fetch all trips for switcher dropdown
    fetchItineraries()
      .then((data) => setTrips(data || []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchItineraryById(id)
      .then((trip) => {
        setActiveTrip(trip);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const refreshTrip = async () => {
    if (!id) return;
    try {
      const fullTrip = await fetchItineraryById(id);
      setActiveTrip(fullTrip);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddDay = async (place: string, date: string, region: string) => {
    if (!activeTrip) return;
    await addItineraryDay(activeTrip.id, {
      place,
      date,
      region,
      sortOrder: activeTrip.days?.length ?? 0,
    });
    await refreshTrip();
  };

  const handleAddStop = async (dayId: string, name: string, timeLabel: string, category?: string, cost?: number) => {
    if (!activeTrip) return;
    await addItineraryStop(dayId, { name, timeLabel, category, cost });
    await refreshTrip();
  };

  const handleDeleteDay = async (dayId: string) => {
    if (!activeTrip) return;
    try {
      await deleteItineraryDay(dayId);
      await refreshTrip();
    } catch (err) {
      console.error('Failed to delete day:', err);
    }
  };

  const handleDeleteStop = async (stopId: string) => {
    if (!activeTrip) return;
    try {
      await deleteItineraryStop(stopId);
      await refreshTrip();
    } catch (err) {
      console.error('Failed to delete stop:', err);
    }
  };

    const handleUpdateDay = async (dayId: string, place: string, date: string, region: string) => {
    if (!activeTrip) return;
    try {
      await updateItineraryDay(dayId, { place, date, region });
      await refreshTrip();
    } catch (err) {
      console.error('Failed to update day:', err);
    }
  };

  const handleUpdateStop = async (
    stopId: string,
    name: string,
    timeLabel: string,
    category?: string,
    cost?: number
  ) => {
    if (!activeTrip) return;
    try {
      await updateItineraryStop(stopId, { name, timeLabel, category, cost });
      await refreshTrip();
    } catch (err) {
      console.error('Failed to update stop:', err);
    }
  };

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

  const getBudgetStatus = () => {
    if (!activeTrip) return { label: 'DRAFT', color: '#1E4B65' };
    const totalPartyBudget = activeTrip.budget * (activeTrip.travelers || 1);
    const spent = budgetBreakdown.spent;
    if (spent > totalPartyBudget && totalPartyBudget > 0) {
      return { label: 'OVER BUDGET', color: '#C4522A' };
    }
    if (spent / totalPartyBudget > 0.75 && totalPartyBudget > 0) {
      return { label: 'GETTING TIGHT', color: '#D4A853' };
    }
    return { label: 'ON BUDGET', color: '#2D5A3D' };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  }

  if (!activeTrip) {
    return (
      <div className="max-w-[800px] mx-auto px-4 py-12 text-center">
        <p className="text-[15px] text-[#1C3A2E] mb-4">Could not find that itinerary.</p>
        <button
          onClick={() => navigate('/trips')}
          className="bg-[#C4522A] text-white px-5 py-2.5 rounded-xl text-[13px] font-bold"
        >
          ← Back to My Itineraries
        </button>
      </div>
    );
  }

  const budgetStatus = getBudgetStatus();
  const totalPartyBudget = activeTrip.budget * (activeTrip.travelers || 1);

  return (
    <div className="pb-12 max-w-[1100px] mx-auto px-4 md:px-6">
      {/* Top Nav: Breadcrumb + Compact Trip Switcher Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <button
          onClick={() => navigate('/trips')}
          className="flex items-center gap-1.5 text-[12.5px] font-bold text-[#2D5A3D] hover:text-[#1C3A2E] transition-colors w-fit"
        >
          <ArrowLeft size={14} /> My itineraries
        </button>

        {/* Live Budget Status Block using PermitCard's STATUS pattern */}
        <div className="text-right font-mono text-[11px] text-[#666]">
          STATUS: <span className="font-bold" style={{ color: budgetStatus.color }}>{budgetStatus.label}</span>
        </div>
      </div>

      {/* Trip Title Header + Dropdown */}
      <div className="relative inline-block mb-2">
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="flex items-center gap-2 font-serif text-[26px] md:text-[32px] text-[#1C3A2E] font-semibold leading-tight hover:opacity-85 transition-opacity"
        >
          <span>{activeTrip.name}</span>
          <ChevronDown size={20} className="text-[#C4522A] shrink-0" />
        </button>

        {dropdownOpen && (
          <div className="absolute top-full left-0 mt-2 w-[280px] bg-white border-[1.5px] border-[#1C3A2E]/15 rounded-2xl shadow-lg z-30 py-2">
            <p className="px-4 py-1.5 text-[10px] font-mono text-[#888] uppercase tracking-wider font-bold border-b border-[#1C3A2E]/8">
              Switch Expedition
            </p>
            {trips.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setDropdownOpen(false);
                  navigate(`/trips/${t.id}`);
                }}
                className={`w-full text-left px-4 py-2.5 text-[13px] font-medium transition-colors flex items-center justify-between ${
                  t.id === activeTrip.id
                    ? 'bg-[#F5EDD8] text-[#2D5A3D] font-bold'
                    : 'text-[#1a1a1a] hover:bg-[#FAF8F4]'
                }`}
              >
                <span className="truncate pr-2">{t.name}</span>
                <span className="text-[10.5px] font-mono text-[#888] shrink-0">
                  {t.days?.length || 0}d
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <BeadDivider />

      {/* Active Trail Summary Hero */}
      <div
        className="rounded-2xl p-6 md:p-7 mb-6 border border-[#1C3A2E]/10 relative overflow-hidden shadow-sm karibu-fade-up"
        style={{
          background: 'linear-gradient(120deg, #F5EDD8 0%, #FAF8F4 70%)',
        }}
      >
        <div className="flex flex-wrap items-start justify-between gap-5 relative z-10">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest font-bold text-[#C4522A] mb-1">
              Active Trail Summary // {activeTrip.days?.length || 0} Days
            </p>
            <p className="text-[13px] text-[#666] m-0">
              {activeTrip.startDate ? `Commencing ${new Date(activeTrip.startDate).toLocaleDateString()}` : 'Date TBD'}
              {activeTrip.endDate ? ` · Concluding ${new Date(activeTrip.endDate).toLocaleDateString()}` : ''}
            </p>
          </div>
          <div className="flex gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 bg-white text-[#C4522A] text-[12px] font-bold px-3.5 py-1.5 rounded-full border border-[#1C3A2E]/8 shadow-2xs">
              ☀ {activeTrip.season || 'Season TBD'}
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white text-[#1C3A2E] text-[12px] font-bold px-3.5 py-1.5 rounded-full border border-[#1C3A2E]/8 shadow-2xs">
              {activeTrip.travelers} traveler{activeTrip.travelers === 1 ? '' : 's'}
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white text-[#1C3A2E] text-[12px] font-bold px-3.5 py-1.5 rounded-full border border-[#1C3A2E]/8 shadow-2xs">
              ${totalPartyBudget.toLocaleString()} Total Party Budget
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

      {/* Main Layout: Timeline & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
        {/* Timeline & Saved Strip */}
        <div className="overflow-hidden">
          <div className="flex items-center gap-2.5 text-[11px] uppercase tracking-[0.18em] text-[#1C3A2E] font-bold mb-5">
            Trail Itinerary <div className="flex-1 h-px bg-[#1C3A2E]/15"></div>
          </div>

          {activeTrip.days && activeTrip.days.length > 0 ? (
                      <DayTimeline
              days={activeTrip.days}
              onAddDay={handleAddDay}
              onAddStop={handleAddStop}
              onDeleteDay={handleDeleteDay}
              onDeleteStop={handleDeleteStop}
              onUpdateDay={handleUpdateDay}
              onUpdateStop={handleUpdateStop}
            />
          ) : (
            <div className="border-2 border-dashed border-[#1C3A2E]/10 rounded-2xl p-10 text-center bg-white/60">
              <p className="text-[14px] font-medium text-[#666] mb-4">Your trail is currently empty.</p>
              <button
                onClick={() => handleAddDay('Arusha', new Date().toISOString().split('T')[0], 'mainland')}
                className="bg-[#1C3A2E] text-white px-5 py-2.5 rounded-[10px] text-[13px] font-semibold"
              >
                + Add your first day
              </button>
            </div>
          )}

          <SavedStrip days={activeTrip.days || []} onStopAdded={refreshTrip} />
        </div>

        {/* Sidebar: Field Notes with Gradient Swatch Icons */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2.5 text-[11px] uppercase tracking-[0.18em] text-[#1C3A2E] font-bold mb-1">
            Field Notes <div className="flex-1 h-px bg-[#1C3A2E]/15"></div>
          </div>

          {/* Card 1: Best time to go */}
          <div className="bg-white rounded-2xl p-5 relative shadow-sm border border-[#1C3A2E]/8">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: 'linear-gradient(135deg, #D4A85322, #D4A8530a)' }}
              >
                <Compass size={16} className="text-[#D4A853]" />
              </div>
              <p className="font-serif text-[17px] text-[#1C3A2E] font-semibold m-0">Best time to go</p>
            </div>
            <p className="text-[13px] text-[#666] mb-3 leading-relaxed">
              {activeTrip.seasonNote || 'Generating season insights based on your route...'}
            </p>
            <span className="inline-flex items-center gap-1.5 bg-[#F5EDD8] text-[#C4522A] text-[12px] font-bold px-3 py-1.5 rounded-full">
              ☀ {activeTrip.season || 'TBD'}
            </span>
          </div>

          {/* Card 2: Budget breakdown by category */}
          <div className="bg-white rounded-2xl p-5 relative shadow-sm border border-[#1C3A2E]/8">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: 'linear-gradient(135deg, #2D5A3D22, #2D5A3D0a)' }}
              >
                <DollarSign size={16} className="text-[#2D5A3D]" />
              </div>
              <p className="font-serif text-[17px] text-[#1C3A2E] font-semibold m-0">Budget breakdown</p>
            </div>
            <p className="text-[13px] text-[#666] mb-3 leading-relaxed">
              ${budgetBreakdown.spent.toLocaleString()} spent of ${totalPartyBudget.toLocaleString()} party budget.
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
                <span>No costs added yet</span>
              )}
            </div>
          </div>

          {/* Card 3: Don't forget checklist */}
          <div className="bg-white rounded-2xl p-5 relative shadow-sm border border-[#1C3A2E]/8">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: 'linear-gradient(135deg, #C4522A22, #C4522A0a)' }}
              >
                <CheckSquare size={16} className="text-[#C4522A]" />
              </div>
              <p className="font-serif text-[17px] text-[#1C3A2E] font-semibold m-0">Don't forget</p>
            </div>
            <p className="text-[13px] text-[#666] mb-3 leading-relaxed">
              A few general essentials for East Africa.
            </p>
            <ChecklistCard />
          </div>
        </div>
      </div>
    </div>
  );
}

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
