import { useNavigate, Link, useLocation } from 'react-router-dom'
import AuthForm from '../components/AuthForm'
import { useAuthStore } from '../store/authStore'

export default function LoginPage() {
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from || '/dashboard'

  async function handleLogin({ email, password }) {
    await login(email, password)
    navigate(redirectTo, { replace: true })
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-4">
        <AuthForm mode="login" onSubmit={handleLogin} />
        <p className="text-center text-sm text-ink/60 dark:text-canvas/60">
          Don't have an account? <Link to="/signup" className="text-teal font-medium hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  )
}
