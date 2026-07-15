// --- Types ---
export interface ItineraryStop {
  id: string;
  dayId: string;
  name: string;
  timeLabel: string;
  cost: number;
  category: string;
  sortOrder: number;
}

export interface ItineraryDay {
  id: string;
  itineraryId: string;
  date: string;
  region: string;
  place: string;
  weather: string;
  sortOrder: number;
  stops: ItineraryStop[];
}

export interface Itinerary {
  id: string;
  userId: string;
  name: string;
  startDate: string;
  travelers: number;
  budget: number;
  season: string;
  seasonNote: string;
  days?: ItineraryDay[]; 
}

// --- API Functions ---
const API_BASE = '/api/v1'; // Adjust if you use a specific axios instance or config

export async function fetchItineraries(): Promise<Itinerary[]> {
  const res = await fetch(`${API_BASE}/itineraries`, { credentials: 'omit' }); // use 'include' if using cookies
  if (!res.ok) throw new Error('Failed to load trips');
  const data = await res.json();
  return data.itineraries;
}

export async function fetchItineraryById(id: string): Promise<Itinerary> {
  const res = await fetch(`${API_BASE}/itineraries/${id}`);
  if (!res.ok) throw new Error('Failed to load trip details');
  const data = await res.json();
  return data.itinerary;
}

export async function createItinerary(data: { name: string; startDate: string; travelers: number; budget: number }): Promise<Itinerary> {
  const res = await fetch(`${API_BASE}/itineraries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'omit', // use 'include' if using cookies
  });
  
  if (!res.ok) throw new Error('Failed to create trip permit');
  const responseData = await res.json();
  return responseData.itinerary;
}

export async function generateItinerarySuggestions(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/itineraries/${id}/suggest`, {
    method: 'POST',
    credentials: 'omit',
  });
  if (!res.ok) throw new Error('Failed to generate suggestions');
}

export async function addItineraryDay(
  itineraryId: string, 
  data: { date: string; region: string; place: string; sortOrder: number }
): Promise<ItineraryDay> {
  const res = await fetch(`${API_BASE}/itineraries/${itineraryId}/days`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'omit',
  });
  if (!res.ok) throw new Error('Failed to add day');
  const responseData = await res.json();
  return responseData.day;
}

export async function addItineraryStop(
  dayId: string, 
  data: { name: string; timeLabel: string; cost: number; category: string; sortOrder: number }
): Promise<ItineraryStop> {
  const res = await fetch(`${API_BASE}/itineraries/days/${dayId}/stops`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'omit',
  });
  if (!res.ok) throw new Error('Failed to add stop');
  const responseData = await res.json();
  return responseData.stop;
}
// You can add createItinerary, addDay, and addStop here following the same pattern.