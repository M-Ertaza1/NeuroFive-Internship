const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// Reads the token fresh on every call, so it always reflects the latest
// login/logout state rather than a stale value captured at import time.
function getToken() {
  return localStorage.getItem('noteflow_token')
}

async function request(path, options = {}) {
  const token = getToken()

  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || `Request failed (status ${response.status}).`)
  }

  return data
}

// --- Auth ---
export const signup = (email, password) =>
  request('/api/auth/signup', { method: 'POST', body: JSON.stringify({ email, password }) })

export const login = (email, password) =>
  request('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })

export const fetchCurrentUser = () => request('/api/auth/me')

// --- Notes (all require a valid token — server enforces this too) ---
export const getNotes = () => request('/api/notes')

export const createNote = (note) =>
  request('/api/notes', { method: 'POST', body: JSON.stringify(note) })

export const updateNote = (id, note) =>
  request(`/api/notes/${id}`, { method: 'PUT', body: JSON.stringify(note) })

export const deleteNote = (id) =>
  request(`/api/notes/${id}`, { method: 'DELETE' })
