import { create } from 'zustand'
import { useAuthStore } from './authStore.js'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function authHeaders() {
  const token = useAuthStore.getState().token
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export const useNotesStore = create((set, get) => ({
  notes: [],
  loading: false,
  error: null,

  fetchNotes: async () => {
    set({ loading: true, error: null })
    try {
      const res = await fetch(`${API_URL}/api/notes`, { headers: authHeaders() })
      if (!res.ok) throw new Error('Failed to load notes.')
      const data = await res.json()
      set({ notes: data, loading: false })
    } catch (err) {
      set({ error: err.message, loading: false })
    }
  },

  addNote: async (title, content) => {
    try {
      const res = await fetch(`${API_URL}/api/notes`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ title, content }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to create note.')
      set({ notes: [data, ...get().notes] })
      return { ok: true }
    } catch (err) {
      set({ error: err.message })
      return { ok: false, error: err.message }
    }
  },

  updateNote: async (id, title, content) => {
    try {
      const res = await fetch(`${API_URL}/api/notes/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ title, content }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to update note.')
      set({ notes: get().notes.map((n) => (n._id === id ? data : n)) })
      return { ok: true }
    } catch (err) {
      set({ error: err.message })
      return { ok: false, error: err.message }
    }
  },

  deleteNote: async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/notes/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Failed to delete note.')
      }
      set({ notes: get().notes.filter((n) => n._id !== id) })
      return { ok: true }
    } catch (err) {
      set({ error: err.message })
      return { ok: false, error: err.message }
    }
  },

  clearError: () => set({ error: null }),
}))
