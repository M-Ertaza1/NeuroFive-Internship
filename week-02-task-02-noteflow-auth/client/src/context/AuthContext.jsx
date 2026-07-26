import { createContext, useContext, useEffect, useState } from 'react'
import { login as apiLogin, signup as apiSignup, fetchCurrentUser } from '../api'

const TOKEN_KEY = 'noteflow_token'
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [checkingSession, setCheckingSession] = useState(true)

  // On first load, if a token is already in storage, verify it's still valid
  // by asking the backend who it belongs to — this keeps the user logged in
  // across page refreshes without ever trusting the token blindly.
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) {
      setCheckingSession(false)
      return
    }
    fetchCurrentUser()
      .then((data) => setUser(data.user))
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setCheckingSession(false))
  }, [])

  async function login(email, password) {
    const data = await apiLogin(email, password)
    localStorage.setItem(TOKEN_KEY, data.token)
    setUser(data.user)
  }

  async function signup(email, password) {
    const data = await apiSignup(email, password)
    localStorage.setItem(TOKEN_KEY, data.token)
    setUser(data.user)
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, checkingSession }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
