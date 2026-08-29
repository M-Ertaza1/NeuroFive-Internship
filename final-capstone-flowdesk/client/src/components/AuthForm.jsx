import { useState } from 'react'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function AuthForm({ mode, onSubmit }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [validationError, setValidationError] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const isSignup = mode === 'signup'

  function validate() {
    if (isSignup && name.trim().length < 2) return 'Name must be at least 2 characters.'
    if (!EMAIL_RE.test(email)) return 'Please enter a valid email address.'
    if (isSignup && password.length < 8) return 'Password must be at least 8 characters.'
    if (!isSignup && password.length === 0) return 'Please enter your password.'
    return ''
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const validation = validate()
    if (validation) return setValidationError(validation)
    setValidationError('')
    setSubmitError('')
    setSubmitting(true)
    try {
      await onSubmit(isSignup ? { name, email, password } : { email, password })
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="bg-white dark:bg-ink/60 rounded-xl border border-ink/10 dark:border-canvas/10 p-6 space-y-4 max-w-sm w-full">
      <h1 className="font-display font-700 text-2xl">{isSignup ? 'Create your account' : 'Log in'}</h1>

      {isSignup && (
        <div>
          <label htmlFor="signup-name" className="text-sm font-medium block mb-1">Name</label>
          <input
            id="signup-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-ink/15 dark:border-canvas/15 dark:bg-ink rounded-lg px-4 py-2.5 focus:border-teal transition-colors"
            placeholder="Jane Doe"
          />
        </div>
      )}

      <div>
        <label htmlFor="auth-email" className="text-sm font-medium block mb-1">Email</label>
        <input
          id="auth-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-ink/15 dark:border-canvas/15 dark:bg-ink rounded-lg px-4 py-2.5 focus:border-teal transition-colors"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label htmlFor="auth-password" className="text-sm font-medium block mb-1">Password</label>
        <input
          id="auth-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-ink/15 dark:border-canvas/15 dark:bg-ink rounded-lg px-4 py-2.5 focus:border-teal transition-colors"
          placeholder={isSignup ? 'At least 8 characters' : 'Your password'}
        />
      </div>

      {validationError && <p className="text-sm text-coral">{validationError}</p>}
      {submitError && <p className="text-sm text-coral">{submitError}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-ink dark:bg-teal text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-amber hover:text-ink transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {submitting && <span className="spinner inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full" />}
        {submitting ? 'Please wait…' : isSignup ? 'Sign up' : 'Log in'}
      </button>
    </form>
  )
}
