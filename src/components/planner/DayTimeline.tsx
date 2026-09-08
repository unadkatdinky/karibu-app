import { useState } from 'react';
import { Utensils, BedDouble, Bus, Sparkles, MapPin, Trash2, X, Plus, Pencil, Check } from 'lucide-react';
import type { ItineraryDay } from '../../api/itineraries';

interface DayTimelineProps {
  days: ItineraryDay[];
  onAddDay: (place: string, date: string, region: string) => Promise<void>;
  onAddStop: (dayId: string, name: string, timeLabel: string, category?: string, cost?: number) => Promise<void>;
  onDeleteDay?: (dayId: string) => Promise<void>;
  onDeleteStop?: (stopId: string) => Promise<void>;
  onUpdateDay?: (dayId: string, place: string, date: string, region: string) => Promise<void>;
  onUpdateStop?: (
    stopId: string,
    name: string,
    timeLabel: string,
    category?: string,
    cost?: number
  ) => Promise<void>;
}

const CATEGORY_ICON: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Food: Utensils,
  Stays: BedDouble,
  Transport: Bus,
  Activity: Sparkles,
};

const REGION_STYLE: Record<string, { text: string; chipBg: string; label: string }> = {
  mainland: { text: '#2D5A3D', chipBg: '#F5EDD8', label: 'Mainland' },
  coast: { text: '#1E4B65', chipBg: '#E8F2F6', label: 'Coast' },
};

function money(n: number) {
  return `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

function photoUrl(seed: string, w: number, h: number) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;
}

export default function DayTimeline({
  days,
  onAddDay,
  onAddStop,
  onDeleteDay,
  onDeleteStop,
  onUpdateDay,
  onUpdateStop,
}: DayTimelineProps) {
  const [addingDay, setAddingDay] = useState(false);
  const [newDayPlace, setNewDayPlace] = useState('');
  const [newDayDate, setNewDayDate] = useState('');
  const [newDayRegion, setNewDayRegion] = useState<'mainland' | 'coast'>('mainland');
  const [submittingDay, setSubmittingDay] = useState(false);

  const [addingStopFor, setAddingStopFor] = useState<string | null>(null);
  const [newStopName, setNewStopName] = useState('');
  const [newStopTime, setNewStopTime] = useState('');
  const [newStopCategory, setNewStopCategory] = useState('Activity');
  const [newStopCost, setNewStopCost] = useState<number | ''>('');
  const [submittingStop, setSubmittingStop] = useState(false);

  // ---- Editing an existing day ----
  const [editingDayId, setEditingDayId] = useState<string | null>(null);
  const [editDayPlace, setEditDayPlace] = useState('');
  const [editDayDate, setEditDayDate] = useState('');
  const [editDayRegion, setEditDayRegion] = useState<'mainland' | 'coast'>('mainland');
  const [savingDay, setSavingDay] = useState(false);

  // ---- Editing an existing stop ----
  const [editingStopId, setEditingStopId] = useState<string | null>(null);
  const [editStopName, setEditStopName] = useState('');
  const [editStopTime, setEditStopTime] = useState('');
  const [editStopCategory, setEditStopCategory] = useState('Activity');
  const [editStopCost, setEditStopCost] = useState<number | ''>('');
  const [savingStop, setSavingStop] = useState(false);

  const startEditDay = (day: ItineraryDay) => {
    setEditingDayId(day.id);
    setEditDayPlace(day.place);
    setEditDayDate(day.date ? day.date.split('T')[0] : '');
    setEditDayRegion(day.region === 'coast' ? 'coast' : 'mainland');
  };

  const cancelEditDay = () => setEditingDayId(null);

  const submitEditDay = async (dayId: string) => {
    if (!onUpdateDay || !editDayPlace || !editDayDate || savingDay) return;
    setSavingDay(true);
    try {
      await onUpdateDay(dayId, editDayPlace, editDayDate, editDayRegion);
      setEditingDayId(null);
    } finally {
      setSavingDay(false);
    }
  };

  const startEditStop = (stop: ItineraryDay['stops'][number]) => {
    setEditingStopId(stop.id);
    setEditStopName(stop.name);
    setEditStopTime(stop.timeLabel || '');
    setEditStopCategory(stop.category || 'Activity');
    setEditStopCost(stop.cost || '');
  };

  const cancelEditStop = () => setEditingStopId(null);

  const submitEditStop = async (stopId: string) => {
    if (!onUpdateStop || !editStopName || savingStop) return;
    setSavingStop(true);
    try {
      await onUpdateStop(
        stopId,
        editStopName,
        editStopTime,
        editStopCategory,
        typeof editStopCost === 'number' ? editStopCost : 0
      );
      setEditingStopId(null);
    } finally {
      setSavingStop(false);
    }
  };

  const handleDaySubmit = async () => {
    if (!newDayPlace || !newDayDate || submittingDay) return;
    setSubmittingDay(true);
    try {
      await onAddDay(newDayPlace, newDayDate, newDayRegion);
      setAddingDay(false);
      setNewDayPlace('');
      setNewDayDate('');
      setNewDayRegion('mainland');
    } finally {
      setSubmittingDay(false);
    }
  };

  const handleStopSubmit = async (dayId: string) => {
    if (!newStopName || submittingStop) return;
    setSubmittingStop(true);
    try {
      await onAddStop(
        dayId,
        newStopName,
        newStopTime,
        newStopCategory,
        typeof newStopCost === 'number' ? newStopCost : 0
      );
      setAddingStopFor(null);
      setNewStopName('');
      setNewStopTime('');
      setNewStopCategory('Activity');
      setNewStopCost('');
    } finally {
      setSubmittingStop(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {days.map((day, index) => {
        const regionKey = day.region === 'coast' ? 'coast' : 'mainland';
        const region = REGION_STYLE[regionKey];
        const dayTotal = day.stops?.reduce((sum, s) => sum + (s.cost || 0), 0) || 0;

        return (
          <div key={day.id} className="karibu-fade-up" style={{ animationDelay: `${index * 60}ms` }}>
            {/* Day Header */}
            {editingDayId === day.id ? (
              <div className="bg-white p-4 rounded-2xl border-[1.5px] border-[#2D5A3D]/25 flex flex-col gap-3 shadow-sm mb-3">
                <input
                  autoFocus
                  type="text"
                  placeholder="Where to?"
                  value={editDayPlace}
                  onChange={(e) => setEditDayPlace(e.target.value)}
                  className="w-full border-b border-[#1C3A2E]/20 text-[13px] bg-transparent focus:outline-none pb-1 font-serif"
                />
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={editDayDate}
                    onChange={(e) => setEditDayDate(e.target.value)}
                    className="flex-1 border-b border-[#1C3A2E]/20 text-[13px] bg-transparent focus:outline-none pb-1"
                  />
                  <button
                    type="button"
                    onClick={() => setEditDayRegion('mainland')}
                    className={`flex-1 rounded-md py-1.5 text-[11px] font-bold border transition-colors ${
                      editDayRegion === 'mainland'
                        ? 'bg-[#2D5A3D] text-white border-[#2D5A3D]'
                        : 'border-[#1C3A2E]/20 text-[#2D5A3D]'
                    }`}
                  >
                    Mainland
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditDayRegion('coast')}
                    className={`flex-1 rounded-md py-1.5 text-[11px] font-bold border transition-colors ${
                      editDayRegion === 'coast'
                        ? 'bg-[#1E4B65] text-white border-[#1E4B65]'
                        : 'border-[#1C3A2E]/20 text-[#1E4B65]'
                    }`}
                  >
                    Coast
                  </button>
                </div>
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => submitEditDay(day.id)}
                    disabled={savingDay || !editDayPlace || !editDayDate}
                    className="flex-1 bg-[#1C3A2E] text-white rounded-lg py-2 text-[12.5px] font-bold disabled:opacity-50 flex items-center justify-center gap-1.5"
                  >
                    <Check size={13} /> {savingDay ? 'Saving...' : 'Save changes'}
                  </button>
                  <button
                    onClick={cancelEditDay}
                    className="px-3 rounded-lg py-2 text-[12.5px] font-bold text-[#666] hover:bg-[#FAF8F4]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 mb-3 group">
                <img
                  src={photoUrl(day.place || `day-${index}`, 80, 80)}
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
                    <h2 className="font-serif text-[18px] text-[#1C3A2E] font-semibold m-0 leading-tight">
                      {day.place}
                    </h2>
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

                <div className="text-right shrink-0 flex items-center gap-2">
                  <p className="text-[13px] font-mono font-bold text-[#1C3A2E]">{money(dayTotal)}</p>
                  {onUpdateDay && (
                    <button
                      onClick={() => startEditDay(day)}
                      aria-label={`Edit day ${index + 1}`}
                      className="text-[#888] hover:text-[#2D5A3D] opacity-0 group-hover:opacity-100 transition-opacity p-1"
                    >
                      <Pencil size={13} />
                    </button>
                  )}
                  {onDeleteDay && (
                    <button
                      onClick={() => onDeleteDay(day.id)}
                      aria-label={`Delete day ${index + 1}`}
                      className="text-[#888] hover:text-[#C4522A] opacity-0 group-hover:opacity-100 transition-opacity p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Vertical Connector Timeline & Stops */}
            <div className="ml-[22px] border-l-2 border-dashed border-[#1C3A2E]/12 pl-4 flex flex-col gap-1">
              {day.stops?.map((stop) => {
                const IconComponent = CATEGORY_ICON[stop.category] ?? MapPin;

                if (editingStopId === stop.id) {
                  return (
                    <div
                      key={stop.id}
                      className="py-3 flex flex-col gap-2.5 bg-white border border-[#2D5A3D]/25 rounded-xl p-3.5 my-1 shadow-sm"
                    >
                      <input
                        autoFocus
                        type="text"
                        placeholder="Stop name"
                        value={editStopName}
                        onChange={(e) => setEditStopName(e.target.value)}
                        className="w-full border-b border-[#1C3A2E]/20 text-[13px] bg-transparent focus:outline-none pb-1"
                      />
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Time (e.g. 7pm)"
                          value={editStopTime}
                          onChange={(e) => setEditStopTime(e.target.value)}
                          className="flex-1 border-b border-[#1C3A2E]/20 text-[12px] bg-transparent focus:outline-none pb-1"
                        />
                        <input
                          type="number"
                          placeholder="Cost ($)"
                          value={editStopCost}
                          onChange={(e) => setEditStopCost(e.target.value ? Number(e.target.value) : '')}
                          className="w-24 border-b border-[#1C3A2E]/20 text-[12px] bg-transparent focus:outline-none pb-1"
                        />
                        <select
                          value={editStopCategory}
                          onChange={(e) => setEditStopCategory(e.target.value)}
                          className="border-b border-[#1C3A2E]/20 text-[12px] bg-transparent focus:outline-none pb-1"
                        >
                          <option>Activity</option>
                          <option>Food</option>
                          <option>Stays</option>
                          <option>Transport</option>
                        </select>
                      </div>
                      <div className="flex gap-2 mt-1">
                        <button
                          onClick={() => submitEditStop(stop.id)}
                          disabled={savingStop || !editStopName}
                          className="bg-[#1C3A2E] text-white rounded-lg px-3.5 py-1.5 text-[11.5px] font-bold disabled:opacity-50"
                        >
                          {savingStop ? 'Saving...' : 'Save changes'}
                        </button>
                        <button
                          onClick={cancelEditStop}
                          className="px-2 text-[11.5px] font-bold text-[#666]"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={stop.id}
                    className="flex items-center gap-3 py-2.5 border-b border-[#1C3A2E]/6 last:border-none group/stop"
                  >
                    <IconComponent size={15} className="text-[#C4522A] shrink-0" />
                    <span className="text-[13px] font-medium text-[#1a1a1a] flex-1 min-w-0 truncate">
                      {stop.name}
                    </span>
                    {stop.timeLabel && (
                      <span className="text-[11px] font-mono text-[#888] shrink-0">{stop.timeLabel}</span>
                    )}
                    {stop.cost > 0 && (
                      <span className="text-[12px] font-mono text-[#1C3A2E] shrink-0 w-14 text-right">
                        {money(stop.cost)}
                      </span>
                    )}
                    {onUpdateStop && (
                      <button
                        onClick={() => startEditStop(stop)}
                        aria-label={`Edit ${stop.name}`}
                        className="text-[#888] hover:text-[#2D5A3D] opacity-0 group-hover/stop:opacity-100 transition-opacity shrink-0 p-1"
                      >
                        <Pencil size={12} />
                      </button>
                    )}
                    {onDeleteStop && (
                      <button
                        onClick={() => onDeleteStop(stop.id)}
                        aria-label={`Delete ${stop.name}`}
                        className="text-[#888] hover:text-[#C4522A] opacity-0 group-hover/stop:opacity-100 transition-opacity shrink-0 p-1"
                      >
                        <X size={13} />
                      </button>
                    )}
                  </div>
                );
              })}

              {/* Add Stop Form / Trigger */}
              {addingStopFor === day.id ? (
                <div className="py-3 flex flex-col gap-2.5 bg-white border border-[#1C3A2E]/10 rounded-xl p-3.5 mt-1 shadow-sm">
                  <input
                    autoFocus
                    type="text"
                    placeholder="Stop name (e.g. Forodhani Night Market)"
                    value={newStopName}
                    onChange={(e) => setNewStopName(e.target.value)}
                    className="w-full border-b border-[#1C3A2E]/20 text-[13px] bg-transparent focus:outline-none pb-1"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Time (e.g. 7pm)"
                      value={newStopTime}
                      onChange={(e) => setNewStopTime(e.target.value)}
                      className="flex-1 border-b border-[#1C3A2E]/20 text-[12px] bg-transparent focus:outline-none pb-1"
                    />
                    <input
                      type="number"
                      placeholder="Cost ($)"
                      value={newStopCost}
                      onChange={(e) => setNewStopCost(e.target.value ? Number(e.target.value) : '')}
                      className="w-24 border-b border-[#1C3A2E]/20 text-[12px] bg-transparent focus:outline-none pb-1"
                    />
                    <select
                      value={newStopCategory}
                      onChange={(e) => setNewStopCategory(e.target.value)}
                      className="border-b border-[#1C3A2E]/20 text-[12px] bg-transparent focus:outline-none pb-1"
                    >
                      <option>Activity</option>
                      <option>Food</option>
                      <option>Stays</option>
                      <option>Transport</option>
                    </select>
                  </div>
                  <div className="flex gap-2 mt-1">
                    <button
                      onClick={() => handleStopSubmit(day.id)}
                      disabled={submittingStop || !newStopName}
                      className="bg-[#1C3A2E] text-white rounded-lg px-3.5 py-1.5 text-[11.5px] font-bold disabled:opacity-50"
                    >
                      {submittingStop ? 'Saving...' : 'Add stop'}
                    </button>
                    <button
                      onClick={() => setAddingStopFor(null)}
                      className="px-2 text-[11.5px] font-bold text-[#666]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setAddingStopFor(day.id)}
                  className="flex items-center gap-1.5 text-[12px] text-[#2D5A3D] font-bold py-2 hover:text-[#1C3A2E] transition-colors"
                >
                  <Plus size={14} /> Add a stop
                </button>
              )}
            </div>
          </div>
        );
      })}

      {/* Add Day Section */}
      <div className="mt-2">
        {addingDay ? (
          <div className="bg-white p-5 rounded-2xl border-[1.5px] border-[#1C3A2E]/15 flex flex-col gap-3 shadow-sm max-w-[400px]">
            <input
              type="text"
              placeholder="Where to?"
              value={newDayPlace}
              onChange={(e) => setNewDayPlace(e.target.value)}
              className="w-full border-b border-[#1C3A2E]/20 text-[13px] bg-transparent focus:outline-none pb-1 font-serif"
              autoFocus
            />
            <input
              type="date"
              value={newDayDate}
              onChange={(e) => setNewDayDate(e.target.value)}
              className="w-full border-b border-[#1C3A2E]/20 text-[13px] bg-transparent focus:outline-none pb-1"
            />
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setNewDayRegion('mainland')}
                className={`flex-1 rounded-md py-1.5 text-[11px] font-bold border transition-colors ${
                  newDayRegion === 'mainland'
                    ? 'bg-[#2D5A3D] text-white border-[#2D5A3D]'
                    : 'border-[#1C3A2E]/20 text-[#2D5A3D]'
                }`}
              >
                Mainland
              </button>
              <button
                type="button"
                onClick={() => setNewDayRegion('coast')}
                className={`flex-1 rounded-md py-1.5 text-[11px] font-bold border transition-colors ${
                  newDayRegion === 'coast'
                    ? 'bg-[#1E4B65] text-white border-[#1E4B65]'
                    : 'border-[#1C3A2E]/20 text-[#1E4B65]'
                }`}
              >
                Coast
              </button>
            </div>
            <div className="flex gap-2 mt-1">
              <button
                onClick={handleDaySubmit}
                disabled={submittingDay || !newDayPlace || !newDayDate}
                className="flex-1 bg-[#1C3A2E] text-white rounded-lg py-2 text-[12.5px] font-bold disabled:opacity-50"
              >
                {submittingDay ? 'Adding...' : `Add day ${days.length + 1}`}
              </button>
              <button
                onClick={() => setAddingDay(false)}
                className="px-3 rounded-lg py-2 text-[12.5px] font-bold text-[#666] hover:bg-[#FAF8F4]"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setAddingDay(true)}
            className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-[#1C3A2E]/20 rounded-2xl text-[#2D5A3D] text-[13px] font-bold px-6 py-4 hover:bg-white hover:border-[#2D5A3D] transition-colors"
          >
            <Plus size={16} /> Add day {days.length + 1}
          </button>
        )}
      </div>
    </div>
  );
}