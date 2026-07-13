// Wraps GET /places — the logged-in user's bookmarked destinations.
// To bookmark/un-bookmark, use saveDestination/unsaveDestination in
// destinations.ts instead — that's where the action lives, since bookmarking
// happens from the Explore/browse page and the detail page, not just here.

import api from '../utils/api';
import type { Destination } from './destinations';

export async function fetchSavedPlaces(): Promise<Destination[]> {
  const res = await api.get('/places');
  return res.data.places;
}
