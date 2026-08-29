import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function ProtectedRoute({ children }) {
  const user = useAuthStore((s) => s.user)
  const checkingSession = useAuthStore((s) => s.checkingSession)
  const location = useLocation()

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center gap-2">
        <span className="spinner inline-block w-4 h-4 border-2 border-ink/20 dark:border-canvas/20 border-t-teal rounded-full" />
        <p className="text-ink/40 dark:text-canvas/40 font-mono text-sm">Checking session…</p>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />
  return children
}
