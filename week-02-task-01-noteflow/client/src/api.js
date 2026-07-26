const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || `Request failed (status ${response.status}).`)
  }

  return data
}

export const getNotes = () => request('/api/notes')

export const createNote = (note) =>
  request('/api/notes', { method: 'POST', body: JSON.stringify(note) })

export const updateNote = (id, note) =>
  request(`/api/notes/${id}`, { method: 'PUT', body: JSON.stringify(note) })

export const deleteNote = (id) =>
  request(`/api/notes/${id}`, { method: 'DELETE' })
