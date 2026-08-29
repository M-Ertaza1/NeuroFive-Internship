import { create } from 'zustand'

const STORAGE_KEY = 'flowdesk_theme'

function applyTheme(theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

const initial = localStorage.getItem(STORAGE_KEY) || 'light'
applyTheme(initial)

// Dark mode as global state — any component can read/toggle it without
// prop-drilling a theme value down through the tree.
export const useThemeStore = create((set, get) => ({
  theme: initial,
  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark'
    localStorage.setItem(STORAGE_KEY, next)
    applyTheme(next)
    set({ theme: next })
  },
}))
