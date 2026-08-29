import { useNavigate, Link } from 'react-router-dom'
import AuthForm from '../components/AuthForm'
import { useAuthStore } from '../store/authStore'

export default function SignupPage() {
  const signup = useAuthStore((s) => s.signup)
  const navigate = useNavigate()

  async function handleSignup({ name, email, password }) {
    await signup(name, email, password)
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-4">
        <AuthForm mode="signup" onSubmit={handleSignup} />
        <p className="text-center text-sm text-ink/60 dark:text-canvas/60">
          Already have an account? <Link to="/login" className="text-teal font-medium hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  )
}
