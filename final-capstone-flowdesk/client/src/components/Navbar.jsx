import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useThemeStore } from '../store/themeStore'

export default function Navbar() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const theme = useThemeStore((s) => s.theme)
  const toggleTheme = useThemeStore((s) => s.toggleTheme)
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <header className="border-b border-ink/10 dark:border-canvas/10">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/dashboard" className="font-display font-700 text-lg">
          Flow<span className="text-teal">desk</span>
        </Link>
        {user && (
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="text-sm border border-ink/15 dark:border-canvas/15 rounded-lg px-3 py-1.5 hover:border-teal transition-colors"
            >
              {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
            </button>
            <span className="text-sm text-ink/60 dark:text-canvas/60 hidden sm:inline">{user.name}</span>
            <button
              onClick={handleLogout}
              className="text-sm font-semibold border border-ink/15 dark:border-canvas/15 rounded-lg px-3 py-1.5 hover:border-coral hover:text-coral transition-colors"
            >
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
