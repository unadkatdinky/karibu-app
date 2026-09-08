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
  endDate?: string;
  coverImageUrl?: string;
  travelers: number;
  budget: number;
  season: string;
  seasonNote: string;
  days?: ItineraryDay[];
}

export interface CreateItineraryInput {
  name: string;
  startDate: string;
  endDate?: string;
  coverImageUrl?: string;
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

export interface UpdateDayInput {
  date: string;
  region: string;
  place: string;
  sortOrder?: number;
}

export interface UpdateStopInput {
  name: string;
  timeLabel?: string;
  cost?: number;
  category?: string;
  sortOrder?: number;
}

export async function fetchItineraries(): Promise<Itinerary[]> {
  const res = await api.get('/itineraries');
  return res.data?.itineraries || [];
}

export async function fetchItineraryById(id: string): Promise<Itinerary> {
  const res = await api.get(`/itineraries/${id}`);
  const itinerary = res.data?.itinerary || {};
  return {
    ...itinerary,
    days: itinerary.days || []
  };
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

export async function deleteItineraryDay(dayId: string): Promise<void> {
  await api.delete(`/itineraries/days/${dayId}`);
}

export async function deleteItineraryStop(stopId: string): Promise<void> {
  await api.delete(`/itineraries/stops/${stopId}`);
}

export async function updateItineraryDay(dayId: string, data: UpdateDayInput): Promise<ItineraryDay> {
  const res = await api.patch(`/itineraries/days/${dayId}`, data);
  return res.data.day;
}

export async function updateItineraryStop(stopId: string, data: UpdateStopInput): Promise<ItineraryStop> {
  const res = await api.patch(`/itineraries/stops/${stopId}`, data);
  return res.data.stop;
}