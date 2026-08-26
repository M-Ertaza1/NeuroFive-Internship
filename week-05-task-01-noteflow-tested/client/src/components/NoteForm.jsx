import { useEffect, useState } from 'react'

export default function NoteForm({ onSubmit, editingNote, onCancelEdit, saving }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [formError, setFormError] = useState('')

  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title)
      setContent(editingNote.content)
    } else {
      setTitle('')
      setContent('')
    }
  }, [editingNote])

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim() || !content.trim()) {
      setFormError('Both title and content are required.')
      return
    }
    setFormError('')
    onSubmit({ title: title.trim(), content: content.trim() })
    if (!editingNote) {
      setTitle('')
      setContent('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-ink/10 p-5 space-y-4">
      <h2 className="font-display font-600 text-sm text-ink/60">
        {editingNote ? 'Edit note' : 'New note'}
      </h2>

      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          aria-label="Title"
          className="w-full border border-ink/15 rounded-lg px-4 py-2.5 focus:border-teal transition-colors"
        />
      </div>

      <div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your note..."
          aria-label="Content"
          rows={4}
          className="w-full border border-ink/15 rounded-lg px-4 py-2.5 focus:border-teal transition-colors resize-none"
        />
      </div>

      {formError && <p className="text-sm text-coral">{formError}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-ink text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-amber hover:text-ink transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving…' : editingNote ? 'Update note' : 'Add note'}
        </button>
        {editingNote && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="border border-ink/15 font-semibold px-5 py-2.5 rounded-lg hover:border-ink/40 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
