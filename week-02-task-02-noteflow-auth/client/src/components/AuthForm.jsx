import { useState } from 'react'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function AuthForm({ mode, onSubmit }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [validationError, setValidationError] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const isSignup = mode === 'signup'

  function validate() {
    if (!EMAIL_RE.test(email)) return 'Please enter a valid email address.'
    if (isSignup && password.length < 8) return 'Password must be at least 8 characters.'
    if (!isSignup && password.length === 0) return 'Please enter your password.'
    return ''
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const validation = validate()
    if (validation) {
      setValidationError(validation)
      return
    }
    setValidationError('')
    setSubmitError('')
    setSubmitting(true)
    try {
      await onSubmit(email, password)
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-ink/10 p-6 space-y-4 max-w-sm w-full">
      <h1 className="font-display font-700 text-2xl">
        {isSignup ? 'Create your account' : 'Log in'}
      </h1>

      <div>
        <label className="text-sm font-medium block mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-ink/15 rounded-lg px-4 py-2.5 focus:border-teal transition-colors"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label className="text-sm font-medium block mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-ink/15 rounded-lg px-4 py-2.5 focus:border-teal transition-colors"
          placeholder={isSignup ? 'At least 8 characters' : 'Your password'}
        />
      </div>

      {validationError && <p className="text-sm text-coral">{validationError}</p>}
      {submitError && <p className="text-sm text-coral">{submitError}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-ink text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-amber hover:text-ink transition-colors disabled:opacity-50"
      >
        {submitting ? 'Please wait…' : isSignup ? 'Sign up' : 'Log in'}
      </button>
    </form>
  )
}
