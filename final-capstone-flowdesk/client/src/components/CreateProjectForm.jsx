import { useState } from 'react'

export default function CreateProjectForm({ onSubmit }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) {
      setError('Project name is required.')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      await onSubmit({ name: name.trim(), description: description.trim() })
      setName('')
      setDescription('')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-ink/60 rounded-xl border border-ink/10 dark:border-canvas/10 p-5 space-y-3">
      <h2 className="font-display font-600 text-sm text-ink/60 dark:text-canvas/60">New project</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Project name"
        aria-label="Project name"
        className="w-full border border-ink/15 dark:border-canvas/15 dark:bg-ink rounded-lg px-4 py-2.5 focus:border-teal transition-colors"
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        aria-label="Description"
        className="w-full border border-ink/15 dark:border-canvas/15 dark:bg-ink rounded-lg px-4 py-2.5 focus:border-teal transition-colors"
      />
      {error && <p className="text-sm text-coral">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="bg-ink dark:bg-teal text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-amber hover:text-ink transition-colors disabled:opacity-50"
      >
        {submitting ? 'Creating…' : 'Create project'}
      </button>
    </form>
  )
}
