import { useNavigate, Link, useLocation } from 'react-router-dom'
import AuthForm from '../components/AuthForm'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // If the user was redirected here from a protected page, send them back
  // there after a successful login instead of always going to /notes.
  const redirectTo = location.state?.from || '/notes'

  async function handleLogin(email, password) {
    await login(email, password)
    navigate(redirectTo, { replace: true })
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-4">
        <AuthForm mode="login" onSubmit={handleLogin} />
        <p className="text-center text-sm text-ink/60">
          Don't have an account?{' '}
          <Link to="/signup" className="text-teal font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
