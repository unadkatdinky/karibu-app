import api from '../utils/api';

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

export interface CreateItineraryInput {
  name: string;
  startDate: string;
  travelers: number;
  budget: number;
}

export interface AddDayInput {
  date: string;
  region: string;
  place: string;
  sortOrder?: number;
}

export interface AddStopInput {
  name: string;
  timeLabel?: string;
  cost?: number;
  category?: string;
  sortOrder?: number;
}

export async function fetchItineraries(): Promise<Itinerary[]> {
  const res = await api.get('/itineraries');
  return res.data.itineraries;
}

export async function fetchItineraryById(id: string): Promise<Itinerary> {
  const res = await api.get(`/itineraries/${id}`);
  return res.data.itinerary;
}

export async function createItinerary(data: CreateItineraryInput): Promise<Itinerary> {
  const res = await api.post('/itineraries', data);
  return res.data.itinerary;
}

export async function addItineraryDay(itineraryId: string, data: AddDayInput): Promise<ItineraryDay> {
  const res = await api.post(`/itineraries/${itineraryId}/days`, data);
  return res.data.day;
}

export async function addItineraryStop(dayId: string, data: AddStopInput): Promise<ItineraryStop> {
  const res = await api.post(`/itineraries/days/${dayId}/stops`, data);
  return res.data.stop;
}

export async function generateItinerarySuggestions(id: string): Promise<void> {
  await api.post(`/itineraries/${id}/suggest`);
}