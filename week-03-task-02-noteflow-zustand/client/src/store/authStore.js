import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      loading: false,
      error: null,

      signup: async (email, password) => {
        set({ loading: true, error: null })
        try {
          const res = await fetch(`${API_URL}/api/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          })
          const data = await res.json()
          if (!res.ok) throw new Error(data.message || 'Signup failed.')
          set({ token: data.token, user: data.user, loading: false })
          return { ok: true }
        } catch (err) {
          set({ error: err.message, loading: false })
          return { ok: false, error: err.message }
        }
      },

      login: async (email, password) => {
        set({ loading: true, error: null })
        try {
          const res = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          })
          const data = await res.json()
          if (!res.ok) throw new Error(data.message || 'Login failed.')
          set({ token: data.token, user: data.user, loading: false })
          return { ok: true }
        } catch (err) {
          set({ error: err.message, loading: false })
          return { ok: false, error: err.message }
        }
      },

      logout: () => set({ token: null, user: null }),

      clearError: () => set({ error: null }),
    }),
    {
      name: 'noteflow-auth',
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
)
