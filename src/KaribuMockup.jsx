import { useState, useMemo } from 'react';
import { Plus, X, Trash2, Utensils, BedDouble, Bus, Sparkles, MapPin, ArrowLeft } from 'lucide-react';

// ---- style block: keyframes for entrance + micro-interactions ----
const styles = `
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes stampPop {
  0% { opacity: 0; transform: scale(0.85) rotate(-4deg); }
  60% { opacity: 1; transform: scale(1.04) rotate(1deg); }
  100% { opacity: 1; transform: scale(1) rotate(0deg); }
}
.karibu-fade-up { animation: fadeInUp 0.45s ease-out both; }
.karibu-stamp { animation: stampPop 0.4s cubic-bezier(0.2, 0.9, 0.3, 1.2) both; }
.karibu-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(28,58,46,0.10); }
.karibu-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
`;

// abstract geometric divider — diamonds/dots evoking beadwork rhythm,
// deliberately generic rather than a copy of any specific textile pattern
function BeadDivider() {
  return (
    <div
      className="h-[6px] w-full my-7 rounded-full"
      style={{
        backgroundImage:
          'repeating-linear-gradient(90deg, #C4522A 0px, #C4522A 6px, transparent 6px, transparent 11px, #D4A853 11px, #D4A853 17px, transparent 17px, transparent 22px, #2D5A3D 22px, #2D5A3D 28px, transparent 28px, transparent 33px)',
        opacity: 0.55,
      }}
    />
  );
}

const initialTrips = [
  {
    id: 't1',
    name: 'Serengeti to Zanzibar',
    coverSeed: 'serengeti-savanna-1',
    startDate: '2026-09-04',
    endDate: '2026-09-09',
    travelers: 2,
    budget: 900,
    days: [
      {
        id: 'd1',
        place: 'Arusha',
        date: '2026-09-04',
        region: 'mainland',
        weather: '24° · dry season',
        photoSeed: 'arusha-town',
        stops: [
          { id: 's1', name: 'Cultural Heritage Centre', timeLabel: '10am', category: 'Activity', cost: 20 },
          { id: 's2', name: 'Njiro Hotel', timeLabel: 'Overnight', category: 'Stays', cost: 110 },
        ],
      },
      {
        id: 'd2',
        place: 'Serengeti',
        date: '2026-09-05',
        region: 'mainland',
        weather: '27° · dry season',
        photoSeed: 'serengeti-plains',
        stops: [
          { id: 's3', name: 'Game drive, central corridor', timeLabel: '6am', category: 'Activity', cost: 180 },
          { id: 's4', name: 'Serengeti Tented Camp', timeLabel: 'Overnight', category: 'Stays', cost: 260 },
          { id: 's5', name: 'Bush breakfast', timeLabel: '8am', category: 'Food', cost: 25 },
        ],
      },
      {
        id: 'd3',
        place: 'Zanzibar',
        date: '2026-09-06',
        region: 'coast',
        weather: '30° · humid',
        photoSeed: 'zanzibar-beach',
        stops: [
          { id: 's6', name: 'Transfer, Arusha to Zanzibar', timeLabel: '9am', category: 'Transport', cost: 140 },
          { id: 's7', name: 'Stone Town walking tour', timeLabel: '3pm', category: 'Activity', cost: 15 },
        ],
      },
    ],
  },
  {
    id: 't2',
    name: 'Rwanda gorilla trek',
    coverSeed: 'rwanda-hills-2',
    startDate: '2026-11-12',
    endDate: '2026-11-15',
    travelers: 1,
    budget: 2200,
    days: [
      {
        id: 'd4',
        place: 'Kigali',
        date: '2026-11-12',
        region: 'mainland',
        weather: '22° · dry season',
        photoSeed: 'kigali-city',
        stops: [{ id: 's8', name: 'Genocide Memorial visit', timeLabel: '11am', category: 'Activity', cost: 10 }],
      },
      {
        id: 'd5',
        place: 'Volcanoes NP',
        date: '2026-11-13',
        region: 'mainland',
        weather: '18° · misty',
        photoSeed: 'volcanoes-park',
        stops: [{ id: 's9', name: 'Gorilla trekking permit', timeLabel: '7am', category: 'Activity', cost: 1500 }],
      },
    ],
  },
  {
    id: 't3',
    name: 'Lamu island escape',
    coverSeed: 'lamu-dhow-3',
    startDate: '2027-02-01',
    endDate: '2027-02-04',
    travelers: 2,
    budget: 600,
    days: [
      {
        id: 'd6',
        place: 'Lamu Old Town',
        date: '2027-02-01',
        region: 'coast',
        weather: '31° · humid',
        photoSeed: 'lamu-town',
        stops: [{ id: 's10', name: 'Dhow sunset sail', timeLabel: '5pm', category: 'Activity', cost: 40 }],
      },
    ],
  },
];

const CATEGORY_ICON = { Food: Utensils, Stays: BedDouble, Transport: Bus, Activity: Sparkles };
const REGION_STYLE = {
  mainland: { text: '#2D5A3D', chipBg: '#F5EDD8', label: 'Mainland' },
  coast: { text: '#1E4B65', chipBg: '#E8F2F6', label: 'Coast' },
};

function money(n) {
  return `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}
function photoUrl(seed, w, h) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;
}
function tripSpent(trip) {
  return trip.days.reduce((sum, d) => sum + d.stops.reduce((s, x) => s + x.cost, 0), 0);
}
function dateRange(start, end) {
  const opts = { month: 'short', day: 'numeric' };
  return `${new Date(start).toLocaleDateString(undefined, opts)} – ${new Date(end).toLocaleDateString(undefined, opts)}`;
}

// ---- trips list (landing page) ----
function TripsList({ trips, onOpenTrip, onNewTrip }) {
  return (
    <div className="max-w-[900px] mx-auto">
      <div className="flex items-end justify-between mb-1">
        <div>
          <p className="text-[10px] font-mono tracking-widest text-[#C4522A] uppercase font-bold mb-1">
            Karibu Tours
          </p>
          <h1 className="font-serif text-[28px] text-[#1C3A2E] font-semibold">Your trips</h1>
        </div>
        <button
          onClick={onNewTrip}
          className="flex items-center gap-1.5 bg-[#1C3A2E] text-white rounded-xl px-4 py-2.5 text-[13px] font-bold hover:bg-[#152e24] transition-colors"
        >
          <Plus size={15} /> New trip
        </button>
      </div>

      <BeadDivider />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {trips.map((trip, i) => {
          const spent = tripSpent(trip);
          const pct = Math.min((spent / trip.budget) * 100, 100);
          const over = spent > trip.budget;
          return (
            <button
              key={trip.id}
              onClick={() => onOpenTrip(trip.id)}
              className="karibu-card karibu-fade-up text-left bg-white rounded-2xl border-[1.5px] border-[#1C3A2E]/12 overflow-hidden"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <div className="relative h-[140px]">
                <img
                  src={photoUrl(trip.coverSeed, 500, 300)}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(180deg, rgba(28,58,46,0) 40%, rgba(28,58,46,0.65) 100%)' }}
                />
                <span className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 border-2 border-dashed border-[#C4522A] flex items-center justify-center -rotate-6 text-[11px] font-bold text-[#C4522A] font-serif">
                  {trip.travelers}p
                </span>
                <h3 className="absolute bottom-3 left-4 right-4 font-serif text-[17px] text-white font-semibold leading-tight">
                  {trip.name}
                </h3>
              </div>

              <div className="p-4">
                <p className="text-[11.5px] text-[#666] font-mono mb-3">
                  {dateRange(trip.startDate, trip.endDate)}
                </p>
                <div className="flex items-center justify-between text-[11.5px] font-mono mb-1.5">
                  <span className="text-[#666]">{money(spent)} spent</span>
                  <span className={over ? 'text-[#C4522A] font-bold' : 'text-[#888]'}>
                    {over ? 'Over budget' : `of ${money(trip.budget)}`}
                  </span>
                </div>
                <div className="h-[5px] rounded-full bg-[#1C3A2E]/8 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, background: over ? '#C4522A' : '#2D5A3D' }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ExchangeMeter({ spent, budget }) {
  const pct = Math.min((spent / budget) * 100, 100);
  const over = spent > budget;
  const remaining = budget - spent;
  let zoneColor = '#2D5A3D';
  let zoneLabel = 'On budget';
  if (spent / budget > 0.75 && spent / budget <= 1) {
    zoneColor = '#D4A853';
    zoneLabel = 'Getting tight';
  }
  if (over) {
    zoneColor = '#C4522A';
    zoneLabel = 'Over budget';
  }
  return (
    <div className="bg-white border-[1.5px] border-[#1C3A2E]/15 rounded-2xl px-6 py-5 mb-2">
      <div className="flex items-baseline justify-between mb-3">
        <div>
          <p className="text-[10px] font-mono tracking-widest text-[#666] uppercase font-bold mb-0.5">
            Ground cost, whole party
          </p>
          <p className="font-serif text-[22px] text-[#1C3A2E] leading-none">
            {money(spent)} <span className="text-[14px] font-sans text-[#888] font-normal">of {money(budget)}</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-[11px] font-mono font-bold uppercase tracking-wide" style={{ color: zoneColor }}>
            {zoneLabel}
          </p>
          <p className="text-[11px] text-[#888] font-mono mt-0.5">
            {over ? `${money(Math.abs(remaining))} over` : `${money(remaining)} left`}
          </p>
        </div>
      </div>
      <div className="relative h-3 rounded-full bg-[#1C3A2E]/8 overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%`, background: zoneColor }}
        />
        {[25, 50, 75].map((t) => (
          <div key={t} className="absolute top-0 bottom-0 w-[1px] bg-white/60" style={{ left: `${t}%` }} />
        ))}
      </div>
    </div>
  );
}

function DayRow({ day, index, onDeleteDay, onDeleteStop, onAddStop }) {
  const [addingStop, setAddingStop] = useState(false);
  const [stopName, setStopName] = useState('');
  const [stopTime, setStopTime] = useState('');
  const [stopCategory, setStopCategory] = useState('Activity');
  const region = REGION_STYLE[day.region];
  const dayTotal = day.stops.reduce((sum, s) => sum + s.cost, 0);

  const submitStop = () => {
    if (!stopName) return;
    onAddStop(day.id, { name: stopName, timeLabel: stopTime, category: stopCategory });
    setStopName('');
    setStopTime('');
    setAddingStop(false);
  };

  return (
    <div className="mb-3 karibu-fade-up" style={{ animationDelay: `${index * 60}ms` }}>
      <div className="flex items-center gap-3 mb-3 group">
        <img
          src={photoUrl(day.photoSeed || day.place, 80, 80)}
          alt=""
          className="w-11 h-11 rounded-full object-cover border-2 border-dashed shrink-0"
          style={{ borderColor: region.text }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-[10px] font-bold text-white rounded-full w-5 h-5 flex items-center justify-center shrink-0 font-serif"
              style={{ background: region.text }}
            >
              {index + 1}
            </span>
            <h2 className="font-serif text-[17px] text-[#1C3A2E] font-semibold m-0">{day.place}</h2>
            <span
              className="text-[10px] font-bold uppercase tracking-[0.08em] px-2 py-0.5 rounded-full shrink-0"
              style={{ background: region.chipBg, color: region.text }}
            >
              {region.label}
            </span>
          </div>
          <p className="text-[12px] text-[#666] mt-0.5">
            {new Date(day.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
            {day.weather ? ` · ${day.weather}` : ''}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[13px] font-mono font-bold text-[#1C3A2E]">{money(dayTotal)}</p>
          <button
            onClick={() => onDeleteDay(day.id)}
            aria-label={`Delete day ${index + 1}`}
            className="text-[#888] hover:text-[#C4522A] opacity-0 group-hover:opacity-100 transition-opacity mt-1"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="ml-[22px] border-l-2 border-dashed border-[#1C3A2E]/10 pl-4">
        {day.stops.map((stop) => {
          const Icon = CATEGORY_ICON[stop.category] ?? MapPin;
          return (
            <div key={stop.id} className="flex items-center gap-3 py-2.5 border-b border-[#1C3A2E]/6 last:border-none group/stop">
              <Icon size={15} className="text-[#B98953] shrink-0" />
              <span className="text-[13px] font-medium text-[#1a1a1a] flex-1 min-w-0 truncate">{stop.name}</span>
              {stop.timeLabel && <span className="text-[11px] font-mono text-[#888] shrink-0">{stop.timeLabel}</span>}
              <span className="text-[12px] font-mono text-[#1C3A2E] shrink-0 w-12 text-right">{money(stop.cost)}</span>
              <button
                onClick={() => onDeleteStop(day.id, stop.id)}
                aria-label={`Delete ${stop.name}`}
                className="text-[#888] hover:text-[#C4522A] opacity-0 group-hover/stop:opacity-100 transition-opacity shrink-0"
              >
                <X size={13} />
              </button>
            </div>
          );
        })}

        {addingStop ? (
          <div className="py-3 flex flex-col gap-2">
            <input
              autoFocus
              type="text"
              placeholder="Stop name"
              value={stopName}
              onChange={(e) => setStopName(e.target.value)}
              className="w-full border-b border-[#1C3A2E]/20 text-[13px] bg-transparent focus:outline-none pb-1"
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Time (e.g. 9am)"
                value={stopTime}
                onChange={(e) => setStopTime(e.target.value)}
                className="flex-1 border-b border-[#1C3A2E]/20 text-[12px] bg-transparent focus:outline-none pb-1"
              />
              <select
                value={stopCategory}
                onChange={(e) => setStopCategory(e.target.value)}
                className="border-b border-[#1C3A2E]/20 text-[12px] bg-transparent focus:outline-none pb-1"
              >
                <option>Activity</option>
                <option>Food</option>
                <option>Stays</option>
                <option>Transport</option>
              </select>
            </div>
            <div className="flex gap-2 mt-1">
              <button onClick={submitStop} className="bg-[#1C3A2E] text-white rounded-lg px-3 py-1.5 text-[11.5px] font-bold">
                Add stop
              </button>
              <button onClick={() => setAddingStop(false)} className="px-2 text-[11.5px] font-bold text-[#666]">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setAddingStop(true)}
            className="flex items-center gap-1.5 text-[12px] text-[#2D5A3D] font-bold py-2.5 hover:text-[#1C3A2E] transition-colors"
          >
            <Plus size={14} /> Add a stop
          </button>
        )}
      </div>
    </div>
  );
}

function TripDetail({ trip, onBack, onUpdateTrip }) {
  const [days, setDays] = useState(trip.days);
  const [addingDay, setAddingDay] = useState(false);
  const [dayPlace, setDayPlace] = useState('');
  const [dayDate, setDayDate] = useState('');
  const [dayRegion, setDayRegion] = useState('mainland');
  const [justAdded, setJustAdded] = useState(false);

  const totalSpent = useMemo(() => days.reduce((sum, d) => sum + d.stops.reduce((s, x) => s + x.cost, 0), 0), [days]);

  const addStop = (dayId, stop) => {
    const next = days.map((d) => (d.id === dayId ? { ...d, stops: [...d.stops, { ...stop, id: `s${Date.now()}`, cost: 0 }] } : d));
    setDays(next);
    onUpdateTrip(next);
  };
  const deleteStop = (dayId, stopId) => {
    const next = days.map((d) => (d.id === dayId ? { ...d, stops: d.stops.filter((s) => s.id !== stopId) } : d));
    setDays(next);
    onUpdateTrip(next);
  };
  const deleteDay = (dayId) => {
    const next = days.filter((d) => d.id !== dayId);
    setDays(next);
    onUpdateTrip(next);
  };
  const submitDay = () => {
    if (!dayPlace || !dayDate) return;
    const next = [...days, { id: `d${Date.now()}`, place: dayPlace, date: dayDate, region: dayRegion, weather: '', photoSeed: dayPlace, stops: [] }];
    setDays(next);
    onUpdateTrip(next);
    setDayPlace('');
    setDayDate('');
    setAddingDay(false);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 500);
  };

  return (
    <div className="max-w-[640px] mx-auto">
      <button onClick={onBack} className="flex items-center gap-1.5 text-[12.5px] font-bold text-[#2D5A3D] mb-4 hover:text-[#1C3A2E]">
        <ArrowLeft size={14} /> Your trips
      </button>

      <div className="relative rounded-2xl overflow-hidden h-[160px] mb-5">
        <img src={photoUrl(trip.coverSeed, 700, 320)} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(28,58,46,0) 35%, rgba(28,58,46,0.7) 100%)' }} />
        <p className="absolute top-4 left-5 text-[10px] font-mono tracking-widest text-white/80 uppercase font-bold">Karibu Tours · Trail</p>
        <h1 className="absolute bottom-4 left-5 right-5 font-serif text-[24px] text-white font-semibold">{trip.name}</h1>
      </div>

      <ExchangeMeter spent={totalSpent} budget={trip.budget} />
      <BeadDivider />

      {days.map((day, i) => (
        <DayRow key={day.id} day={day} index={i} onDeleteDay={deleteDay} onDeleteStop={deleteStop} onAddStop={addStop} />
      ))}

      <div className={`mt-6 ${justAdded ? 'karibu-stamp' : ''}`}>
        {addingDay ? (
          <div className="bg-white p-5 rounded-xl border-[1.5px] border-[#1C3A2E]/15 flex flex-col gap-3">
            <input type="text" placeholder="Where to?" value={dayPlace} onChange={(e) => setDayPlace(e.target.value)} className="w-full border-b border-[#1C3A2E]/20 text-[13px] bg-transparent focus:outline-none pb-1" autoFocus />
            <input type="date" value={dayDate} onChange={(e) => setDayDate(e.target.value)} className="w-full border-b border-[#1C3A2E]/20 text-[13px] bg-transparent focus:outline-none pb-1" />
            <div className="flex gap-1.5">
              <button type="button" onClick={() => setDayRegion('mainland')} className={`flex-1 rounded-md py-1.5 text-[11px] font-bold border ${dayRegion === 'mainland' ? 'bg-[#2D5A3D] text-white border-[#2D5A3D]' : 'border-[#1C3A2E]/20 text-[#2D5A3D]'}`}>Mainland</button>
              <button type="button" onClick={() => setDayRegion('coast')} className={`flex-1 rounded-md py-1.5 text-[11px] font-bold border ${dayRegion === 'coast' ? 'bg-[#1E4B65] text-white border-[#1E4B65]' : 'border-[#1C3A2E]/20 text-[#1E4B65]'}`}>Coast</button>
            </div>
            <div className="flex gap-2">
              <button onClick={submitDay} className="flex-1 bg-[#1C3A2E] text-white rounded-lg py-2 text-[12.5px] font-bold">Add day {days.length + 1}</button>
              <button onClick={() => setAddingDay(false)} className="px-3 rounded-lg py-2 text-[12.5px] font-bold text-[#666] hover:bg-[#FAF8F4]">Cancel</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setAddingDay(true)} className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-[#1C3A2E]/20 rounded-xl text-[#2D5A3D] text-[13px] font-bold px-6 py-4 hover:bg-white hover:border-[#2D5A3D] transition-colors">
            <Plus size={16} /> Add day {days.length + 1}
          </button>
        )}
      </div>
    </div>
  );
}

export default function KaribuMockup() {
  const [trips, setTrips] = useState(initialTrips);
  const [view, setView] = useState('list');
  const [activeTripId, setActiveTripId] = useState(null);

  const activeTrip = trips.find((t) => t.id === activeTripId);

  const updateTripDays = (tripId, newDays) => {
    setTrips((prev) => prev.map((t) => (t.id === tripId ? { ...t, days: newDays } : t)));
  };

  return (
    <div className="bg-[#FAF8F4] min-h-screen px-6 py-10">
      <style>{styles}</style>
      {view === 'list' && (
        <TripsList
          trips={trips}
          onOpenTrip={(id) => {
            setActiveTripId(id);
            setView('detail');
          }}
          onNewTrip={() => {}}
        />
      )}
      {view === 'detail' && activeTrip && (
        <TripDetail trip={activeTrip} onBack={() => setView('list')} onUpdateTrip={(days) => updateTripDays(activeTrip.id, days)} />
      )}
    </div>
  );
}
