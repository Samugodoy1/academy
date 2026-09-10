import { API_URL } from '../config';
import { CURRENT_PRODUCT } from '../config/product';

export function authToken(): string {
  if (typeof localStorage === 'undefined') return '';
  const token = localStorage.getItem('token') || '';
  return token === 'null' || token === 'undefined' ? '' : token;
}

export function currentUserId(): number | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    const user = JSON.parse(raw) as { id?: unknown };
    const id = Number(user?.id);
    return Number.isFinite(id) && id > 0 ? id : null;
  } catch {
    return null;
  }
}

export function authHeaders(json = true): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'x-product': CURRENT_PRODUCT,
  };
  if (json) headers['Content-Type'] = 'application/json';
  const token = authToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
    headers['x-auth-token'] = token;
  }
  return headers;
}

export async function academyApiFetch(path: string, options: RequestInit = {}, json = true) {
  const fullUrl = path.startsWith('http') ? path : `${API_URL}${path}`;
  return fetch(fullUrl, {
    ...options,
    headers: { ...authHeaders(json), ...(options.headers as Record<string, string> | undefined) },
    credentials: API_URL ? 'include' : 'same-origin',
  });
}
