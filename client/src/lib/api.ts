const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function request<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('mext_token') : null;

  const headers = new Headers(options.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const hasBody = options.body !== undefined && options.body !== null;
  if (hasBody && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({} as Record<string, unknown>));
    const message = (errorData && (errorData as any).message) || `API error: ${response.status}`; 
    throw new Error(String(message));
  }

  const json = await response.json().catch(() => ({}));
  return json as T;
}

export const api = {
  get: <T = unknown>(path: string, options?: RequestInit) => request<T>(path, { ...options, method: 'GET' }),
  post: <T = unknown>(path: string, body?: unknown, options?: RequestInit) => request<T>(path, {
    ...options,
    method: 'POST',
    body: body instanceof FormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
  }),
  put: <T = unknown>(path: string, body?: unknown, options?: RequestInit) => request<T>(path, {
    ...options,
    method: 'PUT',
    body: body instanceof FormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
  }),
  patch: <T = unknown>(path: string, body?: unknown, options?: RequestInit) => request<T>(path, {
    ...options,
    method: 'PATCH',
    body: body instanceof FormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
  }),
  delete: <T = unknown>(path: string, options?: RequestInit) => request<T>(path, { ...options, method: 'DELETE' }),
};
