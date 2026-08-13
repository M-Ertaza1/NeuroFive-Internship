import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore.js'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signup, loading, error, clearError } = useAuthStore()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    clearError()
    const result = await signup(email, password)
    if (result.ok) navigate('/')
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-5">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5">
        <div>
          <h1 className="font-display font-semibold text-2xl text-ink">Create an account</h1>
          <p className="text-sm text-ink/50 mt-1">Start capturing your notes in seconds.</p>
        </div>

        {error && (
          <div className="bg-coral-light text-coral text-sm rounded-lg px-3 py-2">{error}</div>
        )}

        <div>
          <label className="text-xs font-medium text-ink/50 uppercase tracking-wide">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full mt-1 border border-ink/15 rounded-lg px-3 py-2 text-sm focus:border-teal outline-none"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-ink/50 uppercase tracking-wide">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full mt-1 border border-ink/15 rounded-lg px-3 py-2 text-sm focus:border-teal outline-none"
            placeholder="At least 8 characters"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal hover:bg-teal-dark disabled:opacity-60 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
        >
          {loading ? 'Creating account…' : 'Sign up'}
        </button>

        <p className="text-sm text-ink/50 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-teal font-medium hover:text-teal-dark">
            Log in
          </Link>
        </p>
      </form>
    </div>
  )
}
