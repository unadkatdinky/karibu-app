// Wraps the /destinations endpoints — the shared catalog of real, curated
// places (as opposed to the old free-text saved_places approach).

import api from '../utils/api';

export interface Destination {
  id: string;
  slug: string;
  name: string;
  region: string;
  shortDescription: string;
  longDescription: string;
  coverImageUrl: string;
  galleryImageUrls: string[];
  color: string;
  createdAt: string;
}

export interface DestinationWithSaved extends Destination {
  isSaved: boolean;
}

export async function fetchDestinations(): Promise<DestinationWithSaved[]> {
  const res = await api.get('/destinations');
  return res.data.destinations;
}

export async function fetchDestinationBySlug(slug: string): Promise<DestinationWithSaved> {
  const res = await api.get(`/destinations/${slug}`);
  return res.data.destination;
}

export async function saveDestination(id: string): Promise<void> {
  await api.post(`/destinations/${id}/save`);
}

export async function unsaveDestination(id: string): Promise<void> {
  await api.delete(`/destinations/${id}/save`);
}
