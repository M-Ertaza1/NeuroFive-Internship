import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import LoadingState from '../components/LoadingState'
import ErrorBanner from '../components/ErrorBanner'
import { useAuthStore } from '../store/authStore'
import { getProject, addMember, updateMemberRole, removeMember, deleteProject, updateProject } from '../api'

export default function ProjectSettingsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const currentUser = useAuthStore((s) => s.user)

  const [project, setProject] = useState(null)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')

  const [inviteEmail, setInviteEmail] = useState('')
  const [inviting, setInviting] = useState(false)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [savingDetails, setSavingDetails] = useState(false)

  function load() {
    setStatus('loading')
    getProject(id)
      .then((p) => {
        setProject(p)
        setName(p.name)
        setDescription(p.description || '')
        setStatus('ready')
      })
      .catch((err) => {
        setError(err.message)
        setStatus('error')
      })
  }

  useEffect(() => { load() }, [id])

  const myMembership = project?.members.find((m) => m.user._id === currentUser?.id)
  const isOwner = myMembership?.role === 'owner'

  async function handleInvite(e) {
    e.preventDefault()
    if (!inviteEmail.trim()) return
    setInviting(true)
    setActionError('')
    try {
      const updated = await addMember(id, inviteEmail.trim())
      setProject(updated)
      setInviteEmail('')
    } catch (err) {
      setActionError(err.message)
    } finally {
      setInviting(false)
    }
  }

  async function handleRoleChange(userId, role) {
    setActionError('')
    try {
      const updated = await updateMemberRole(id, userId, role)
      setProject(updated)
    } catch (err) {
      setActionError(err.message)
    }
  }

  async function handleRemove(userId) {
    setActionError('')
    try {
      const updated = await removeMember(id, userId)
      setProject(updated)
    } catch (err) {
      setActionError(err.message)
    }
  }

  async function handleSaveDetails(e) {
    e.preventDefault()
    setSavingDetails(true)
    setActionError('')
    try {
      const updated = await updateProject(id, { name, description })
      setProject((prev) => ({ ...prev, ...updated }))
    } catch (err) {
      setActionError(err.message)
    } finally {
      setSavingDetails(false)
    }
  }

  async function handleDeleteProject() {
    if (!window.confirm('Delete this project and all its tasks? This cannot be undone.')) return
    try {
      await deleteProject(id)
      navigate('/dashboard')
    } catch (err) {
      setActionError(err.message)
    }
  }

  if (status === 'loading') {
    return <div className="min-h-screen"><Navbar /><main className="max-w-3xl mx-auto px-6 py-10"><LoadingState count={2} /></main></div>
  }
  if (status === 'error') {
    return <div className="min-h-screen"><Navbar /><main className="max-w-3xl mx-auto px-6 py-10"><ErrorBanner message={error} /></main></div>
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-10 space-y-8">
        <div>
          <Link to={`/projects/${id}`} className="text-sm text-teal hover:underline">← Back to board</Link>
          <h1 className="font-display font-700 text-3xl mt-1">Project settings</h1>
        </div>

        <ErrorBanner message={actionError} onDismiss={() => setActionError('')} />

        {!isOwner && (
          <div className="bg-amber/10 border border-amber/30 text-amber-dark rounded-lg px-4 py-3 text-sm">
            You're viewing this as a member. Only project owners can change settings or manage the team.
          </div>
        )}

        <section className="bg-white dark:bg-ink/60 rounded-xl border border-ink/10 dark:border-canvas/10 p-5">
          <h2 className="font-display font-600 mb-4">Project details</h2>
          <form onSubmit={handleSaveDetails} className="space-y-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!isOwner}
              className="w-full border border-ink/15 dark:border-canvas/15 dark:bg-ink rounded-lg px-4 py-2.5 disabled:opacity-60"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={!isOwner}
              rows={2}
              className="w-full border border-ink/15 dark:border-canvas/15 dark:bg-ink rounded-lg px-4 py-2.5 resize-none disabled:opacity-60"
            />
            {isOwner && (
              <button
                type="submit"
                disabled={savingDetails}
                className="bg-ink dark:bg-teal text-white font-semibold px-5 py-2.5 rounded-lg text-sm disabled:opacity-50"
              >
                {savingDetails ? 'Saving…' : 'Save changes'}
              </button>
            )}
          </form>
        </section>

        <section className="bg-white dark:bg-ink/60 rounded-xl border border-ink/10 dark:border-canvas/10 p-5">
          <h2 className="font-display font-600 mb-4">Team members</h2>
          <div className="space-y-3">
            {project.members.map((m) => (
              <div key={m.user._id} className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="font-medium text-sm">{m.user.name}</p>
                  <p className="text-xs text-ink/50 dark:text-canvas/50">{m.user.email}</p>
                </div>
                {isOwner ? (
                  <div className="flex items-center gap-2">
                    <select
                      value={m.role}
                      onChange={(e) => handleRoleChange(m.user._id, e.target.value)}
                      className="text-sm border border-ink/15 dark:border-canvas/15 dark:bg-ink rounded-lg px-2 py-1.5"
                    >
                      <option value="owner">Owner</option>
                      <option value="member">Member</option>
                    </select>
                    <button
                      onClick={() => handleRemove(m.user._id)}
                      className="text-sm text-coral hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <span className="text-xs font-mono text-ink/40 dark:text-canvas/40 uppercase">{m.role}</span>
                )}
              </div>
            ))}
          </div>

          {isOwner && (
            <form onSubmit={handleInvite} className="mt-5 flex gap-2">
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="Invite by email"
                className="flex-1 border border-ink/15 dark:border-canvas/15 dark:bg-ink rounded-lg px-4 py-2.5 text-sm"
              />
              <button
                type="submit"
                disabled={inviting}
                className="bg-ink dark:bg-teal text-white font-semibold px-4 py-2.5 rounded-lg text-sm disabled:opacity-50"
              >
                {inviting ? 'Inviting…' : 'Invite'}
              </button>
            </form>
          )}
        </section>

        {isOwner && (
          <section className="border border-coral/30 rounded-xl p-5">
            <h2 className="font-display font-600 text-coral mb-2">Danger zone</h2>
            <p className="text-sm text-ink/60 dark:text-canvas/60 mb-4">Deleting a project removes it and all its tasks permanently.</p>
            <button
              onClick={handleDeleteProject}
              className="border border-coral text-coral font-semibold px-4 py-2 rounded-lg text-sm hover:bg-coral-light transition-colors"
            >
              Delete project
            </button>
          </section>
        )}
      </main>
    </div>
  )
}
