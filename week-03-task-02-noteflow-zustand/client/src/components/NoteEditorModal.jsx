import { useState, useEffect } from 'react'

export default function NoteEditorModal({ note, onSave, onClose, saving }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    setTitle(note?.title || '')
    setContent(note?.content || '')
    setError('')
  }, [note])

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return setError('Title is required.')
    if (!content.trim()) return setError('Content is required.')
    onSave({ title: title.trim(), content: content.trim() })
  }

  return (
    <div className="fixed inset-0 bg-ink/30 backdrop-blur-sm flex items-center justify-center p-4 z-20">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 space-y-4"
      >
        <h2 className="font-display font-semibold text-lg text-ink">
          {note?._id ? 'Edit note' : 'New note'}
        </h2>

        {error && (
          <div className="bg-coral-light text-coral text-sm rounded-lg px-3 py-2">{error}</div>
        )}

        <div>
          <label className="text-xs font-medium text-ink/50 uppercase tracking-wide">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mt-1 border border-ink/15 rounded-lg px-3 py-2 text-sm focus:border-teal outline-none"
            placeholder="Note title"
            autoFocus
          />
        </div>

        <div>
          <label className="text-xs font-medium text-ink/50 uppercase tracking-wide">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="w-full mt-1 border border-ink/15 rounded-lg px-3 py-2 text-sm focus:border-teal outline-none resize-none"
            placeholder="Write something…"
          />
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-medium text-ink/60 px-4 py-2 rounded-lg hover:bg-ink/5"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="text-sm font-medium text-white bg-teal hover:bg-teal-dark disabled:opacity-60 px-4 py-2 rounded-lg transition-colors"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  )
}
