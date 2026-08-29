import { useEffect, useState } from 'react'

const ALLOWED_TYPES = [
  'image/jpeg', 'image/png', 'image/webp', 'image/gif',
  'application/pdf', 'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]
const MAX_SIZE_MB = 10

export default function TaskModal({ task, members, onClose, onSave, onDelete }) {
  const isEditing = Boolean(task)

  const [title, setTitle] = useState(task?.title || '')
  const [description, setDescription] = useState(task?.description || '')
  const [priority, setPriority] = useState(task?.priority || 'medium')
  const [status, setStatus] = useState(task?.status || 'todo')
  const [dueDate, setDueDate] = useState(task?.dueDate ? task.dueDate.slice(0, 10) : '')
  const [assignee, setAssignee] = useState(task?.assignee?._id || '')
  const [file, setFile] = useState(null)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    function handleEsc(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  function validate() {
    const next = {}
    if (!title.trim()) next.title = 'Title is required.'
    if (file) {
      if (!ALLOWED_TYPES.includes(file.type)) next.file = 'File must be an image, PDF, or Word document.'
      else if (file.size > MAX_SIZE_MB * 1024 * 1024) next.file = `File must be under ${MAX_SIZE_MB}MB.`
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    setFormError('')
    try {
      const formData = new FormData()
      formData.append('title', title.trim())
      formData.append('description', description)
      formData.append('priority', priority)
      if (isEditing) formData.append('status', status)
      if (dueDate) formData.append('dueDate', dueDate)
      if (assignee) formData.append('assignee', assignee)
      if (file) formData.append('attachment', file)

      await onSave(formData, isEditing)
      onClose()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await onDelete(task._id)
      onClose()
    } catch (err) {
      setFormError(err.message)
      setDeleting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-ink/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={isEditing ? 'Edit task' : 'New task'}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="bg-white dark:bg-ink rounded-xl border border-ink/10 dark:border-canvas/15 p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display font-700 text-xl">{isEditing ? 'Edit task' : 'New task'}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="text-2xl leading-none text-ink/40 dark:text-canvas/40 hover:text-coral">×</button>
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full border rounded-lg px-4 py-2.5 dark:bg-ink ${errors.title ? 'border-coral' : 'border-ink/15 dark:border-canvas/15'}`}
          />
          {errors.title && <p className="text-sm text-coral mt-1">{errors.title}</p>}
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full border border-ink/15 dark:border-canvas/15 dark:bg-ink rounded-lg px-4 py-2.5 resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium block mb-1">Priority</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full border border-ink/15 dark:border-canvas/15 dark:bg-ink rounded-lg px-3 py-2.5">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          {isEditing && (
            <div>
              <label className="text-sm font-medium block mb-1">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full border border-ink/15 dark:border-canvas/15 dark:bg-ink rounded-lg px-3 py-2.5">
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium block mb-1">Due date</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full border border-ink/15 dark:border-canvas/15 dark:bg-ink rounded-lg px-3 py-2.5" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Assignee</label>
            <select value={assignee} onChange={(e) => setAssignee(e.target.value)} className="w-full border border-ink/15 dark:border-canvas/15 dark:bg-ink rounded-lg px-3 py-2.5">
              <option value="">Unassigned</option>
              {members.map((m) => (
                <option key={m.user._id} value={m.user._id}>{m.user.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Attachment (optional)</label>
          {isEditing && task.attachmentUrl && !file && (
            <a href={task.attachmentUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-teal hover:underline block mb-2">
              Current: {task.attachmentName}
            </a>
          )}
          <input
            type="file"
            accept={ALLOWED_TYPES.join(',')}
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full text-sm border border-ink/15 dark:border-canvas/15 rounded-lg px-3 py-2"
          />
          {errors.file && <p className="text-sm text-coral mt-1">{errors.file}</p>}
        </div>

        {formError && <p className="text-sm text-coral" role="alert">{formError}</p>}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-ink dark:bg-teal text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-amber hover:text-ink transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving…' : isEditing ? 'Save changes' : 'Create task'}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="border border-coral/30 text-coral font-semibold px-5 py-2.5 rounded-lg hover:bg-coral-light transition-colors disabled:opacity-50"
            >
              {deleting ? 'Deleting…' : 'Delete'}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
