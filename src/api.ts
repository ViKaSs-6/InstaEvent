import { User, Venue, Vendor, Booking, ChatMessage, UserRole } from './types';

const API_BASE = '/api';

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('insta_jwt_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// --- AUTH API ---

export async function apiRegister(
  name: string,
  email: string,
  pass: string,
  role: UserRole,
  businessName?: string
): Promise<User> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      email,
      password: pass,
      role: role.toLowerCase(),
      businessName
    })
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Registration failed.');
  }

  localStorage.setItem('insta_jwt_token', data.token);
  return data.user;
}

export async function apiLogin(email: string, pass: string): Promise<User> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: pass })
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Login failed.');
  }

  localStorage.setItem('insta_jwt_token', data.token);
  return data.user;
}

export async function apiGetMe(): Promise<User | null> {
  const token = localStorage.getItem('insta_jwt_token');
  if (!token) return null;

  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) {
      localStorage.removeItem('insta_jwt_token');
      return null;
    }
    const data = await res.json();
    return data.user;
  } catch (err) {
    console.error('apiGetMe error:', err);
    return null;
  }
}

export function apiLogout(): void {
  localStorage.removeItem('insta_jwt_token');
}

// --- LISTINGS API ---

export async function apiFetchListings(params?: { category?: string; search?: string; status?: string }): Promise<{ venues: Venue[]; vendors: Vendor[] }> {
  try {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.search) query.append('search', params.search);
    if (params?.status) query.append('status', params.status);

    const res = await fetch(`${API_BASE}/listings?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch listings.');

    const data = await res.json();
    
    // Separate into venues and vendors
    const venues: Venue[] = data.filter((item: any) => item.category === 'Venue' || item.pricePerHour);
    const vendors: Vendor[] = data.filter((item: any) => item.category !== 'Venue' && !item.pricePerHour);

    return { venues, vendors };
  } catch (err) {
    console.error('apiFetchListings error:', err);
    return { venues: [], vendors: [] };
  }
}

export async function apiCreateListing(listingData: any): Promise<any> {
  const res = await fetch(`${API_BASE}/listings`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(listingData)
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to create listing.');
  }
  return data;
}

export async function apiDeleteListing(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/listings/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Failed to delete listing.');
  }
}

export async function apiModerateListing(id: string, status: 'approved' | 'rejected'): Promise<any> {
  const res = await fetch(`${API_BASE}/listings/${id}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to moderate listing.');
  }
  return data;
}

// --- BOOKINGS API ---

export async function apiFetchBookings(): Promise<Booking[]> {
  try {
    const res = await fetch(`${API_BASE}/bookings`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('apiFetchBookings error:', err);
    return [];
  }
}

export async function apiCreateBooking(bookingData: {
  venueName: string;
  venueImage?: string;
  date: string;
  guests: number;
  totalAmount: number;
  baseAmount?: number;
  vendorNames?: string[];
  listingId?: string;
  vendorId?: string;
}): Promise<Booking> {
  const res = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(bookingData)
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to create booking.');
  }
  return data;
}

// --- MESSAGES / CHAT API ---

export async function apiFetchMessages(): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE}/messages`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error('apiFetchMessages error:', err);
    return [];
  }
}

export async function apiSendMessage(data: { threadId: string; text: string; senderRole?: string; quoteOffer?: any }): Promise<any> {
  const res = await fetch(`${API_BASE}/messages`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.error || 'Failed to send message.');
  }
  return await res.json();
}

// --- ADMIN STATS API ---

export async function apiFetchAdminStats(): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error('apiFetchAdminStats error:', err);
    return null;
  }
}
