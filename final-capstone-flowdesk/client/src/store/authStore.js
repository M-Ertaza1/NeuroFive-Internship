import { create } from 'zustand'
import { login as apiLogin, signup as apiSignup, fetchCurrentUser } from '../api'

const TOKEN_KEY = 'flowdesk_token'

export const useAuthStore = create((set) => ({
  user: null,
  checkingSession: true,

  initSession: async () => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) return set({ checkingSession: false })
    try {
      const data = await fetchCurrentUser()
      set({ user: data.user, checkingSession: false })
    } catch {
      localStorage.removeItem(TOKEN_KEY)
      set({ user: null, checkingSession: false })
    }
  },

  login: async (email, password) => {
    const data = await apiLogin(email, password)
    localStorage.setItem(TOKEN_KEY, data.token)
    set({ user: data.user })
  },

  signup: async (name, email, password) => {
    const data = await apiSignup(name, email, password)
    localStorage.setItem(TOKEN_KEY, data.token)
    set({ user: data.user })
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY)
    set({ user: null })
  },
}))
