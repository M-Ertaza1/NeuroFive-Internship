import { useEffect, useState } from 'react'
import { useNotesStore } from '../store/notesStore.js'
import NoteCard from '../components/NoteCard.jsx'
import NoteEditorModal from '../components/NoteEditorModal.jsx'

function SkeletonCard() {
  return (
    <div className="bg-white border border-ink/10 rounded-xl p-4 space-y-2">
      <div className="skeleton h-4 w-1/3 rounded"></div>
      <div className="skeleton h-3 w-full rounded"></div>
      <div className="skeleton h-3 w-2/3 rounded"></div>
    </div>
  )
}

export default function Notes() {
  const { notes, loading, error, fetchNotes, addNote, updateNote, deleteNote, clearError } =
    useNotesStore()
  const [editingNote, setEditingNote] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchNotes()
  }, [])

  function openNew() {
    setEditingNote(null)
    setShowModal(true)
  }

  function openEdit(note) {
    setEditingNote(note)
    setShowModal(true)
  }

  async function handleSave({ title, content }) {
    setSaving(true)
    const result = editingNote?._id
      ? await updateNote(editingNote._id, title, content)
      : await addNote(title, content)
    setSaving(false)
    if (result.ok) setShowModal(false)
  }

  async function handleDelete(id) {
    if (confirm('Delete this note? This cannot be undone.')) {
      await deleteNote(id)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-5 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-semibold text-2xl text-ink">Your notes</h1>
          <p className="text-sm text-ink/50 mt-0.5">
            {notes.length} note{notes.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={openNew}
          className="bg-amber hover:bg-amber-dark text-ink text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
        >
          + New note
        </button>
      </div>

      {error && (
        <div className="bg-coral-light text-coral text-sm rounded-lg px-3 py-2 mb-4 flex justify-between items-center">
          {error}
          <button onClick={clearError} className="text-coral/70 hover:text-coral font-medium">
            ✕
          </button>
        </div>
      )}

      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : notes.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-ink/15 rounded-xl">
          <p className="text-ink/50 text-sm">No notes yet. Create your first one.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {notes.map((note) => (
            <NoteCard key={note._id} note={note} onEdit={openEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {showModal && (
        <NoteEditorModal
          note={editingNote}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
          saving={saving}
        />
      )}
    </div>
  )
}
