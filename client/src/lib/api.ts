const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function request(path: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('mext_token') : null;
  
  const headers = new Headers(options.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API error: ${response.status}`);
  }

  return response.json();
}

export const api = {
  get: (path: string, options?: RequestInit) => request(path, { ...options, method: 'GET' }),
  post: (path: string, body: any, options?: RequestInit) => request(path, {
    ...options,
    method: 'POST',
    body: body instanceof FormData ? body : JSON.stringify(body),
  }),
  put: (path: string, body: any, options?: RequestInit) => request(path, {
    ...options,
    method: 'PUT',
    body: body instanceof FormData ? body : JSON.stringify(body),
  }),
  delete: (path: string, options?: RequestInit) => request(path, { ...options, method: 'DELETE' }),
};
