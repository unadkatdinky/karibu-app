import api from '../../utils/api';

export interface AdminDestination {
  id: string;
  slug: string;
  name: string;
  region: string;
  shortDescription: string;
  longDescription: string;
  coverImageUrl: string;
  galleryImageUrls: string[];
  color: string;
  isActive: boolean;
  createdAt: string;
}

export interface DestinationFormInput {
  name: string;
  region: string;
  shortDescription: string;
  longDescription: string;
  coverImageUrl: string;
  galleryImageUrls: string[];
  color: string;
}

export async function fetchAllDestinationsAdmin(): Promise<AdminDestination[]> {
  const res = await api.get('/admin/destinations');
  return res.data.destinations;
}

export async function fetchDestinationAdmin(id: string): Promise<AdminDestination> {
  const res = await api.get(`/admin/destinations/${id}`);
  return res.data.destination;
}

export async function createDestinationAdmin(input: DestinationFormInput): Promise<AdminDestination> {
  const res = await api.post('/admin/destinations', input);
  return res.data.destination;
}

export async function updateDestinationAdmin(id: string, input: DestinationFormInput): Promise<AdminDestination> {
  const res = await api.put(`/admin/destinations/${id}`, input);
  return res.data.destination;
}

export async function toggleDestinationActive(id: string): Promise<boolean> {
  const res = await api.patch(`/admin/destinations/${id}/toggle-active`);
  return res.data.isActive;
}