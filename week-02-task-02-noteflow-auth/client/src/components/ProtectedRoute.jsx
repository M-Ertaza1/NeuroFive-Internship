import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Wraps a page that requires login. While we're still checking whether a
 * stored token is valid, render nothing (avoids a flash of the login page).
 * Once checked: no user -> redirect to /login, remembering where they were
 * headed so we can send them back after they log in.
 */
export default function ProtectedRoute({ children }) {
  const { user, checkingSession } = useAuth()
  const location = useLocation()

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-ink/40 font-mono text-sm">Checking session…</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return children
}
