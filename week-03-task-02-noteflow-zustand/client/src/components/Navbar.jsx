import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore.js'

export default function Navbar() {
  const { user, token, logout } = useAuthStore()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav className="border-b border-ink/10 bg-canvas/80 backdrop-blur sticky top-0 z-10">
      <div className="max-w-3xl mx-auto px-5 py-4 flex items-center justify-between">
        <Link to="/" className="font-display font-semibold text-lg tracking-tight text-ink">
          Note<span className="text-teal">Flow</span>
        </Link>
        {token && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-ink/50 font-mono hidden sm:inline">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-coral hover:text-coral/80 transition-colors"
            >
              Log out
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
