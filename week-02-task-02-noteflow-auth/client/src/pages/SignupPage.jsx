import { useNavigate, Link } from 'react-router-dom'
import AuthForm from '../components/AuthForm'
import { useAuth } from '../context/AuthContext'

export default function SignupPage() {
  const { signup } = useAuth()
  const navigate = useNavigate()

  async function handleSignup(email, password) {
    await signup(email, password)
    navigate('/notes')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-4">
        <AuthForm mode="signup" onSubmit={handleSignup} />
        <p className="text-center text-sm text-ink/60">
          Already have an account?{' '}
          <Link to="/login" className="text-teal font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
