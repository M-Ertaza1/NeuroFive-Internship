import { useEffect, useState } from 'react'
import NoteForm from './components/NoteForm'
import NoteCard from './components/NoteCard'
import LoadingState from './components/LoadingState'
import EmptyState from './components/EmptyState'
import ErrorBanner from './components/ErrorBanner'
import { getNotes, createNote, updateNote, deleteNote } from './api'

export default function App() {
  const [notes, setNotes] = useState([])
  const [listStatus, setListStatus] = useState('loading')
  const [listError, setListError] = useState('')

  const [editingNote, setEditingNote] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [actionError, setActionError] = useState('')

  function loadNotes() {
    setListStatus('loading')
    getNotes()
      .then((data) => {
        setNotes(data)
        setListStatus('ready')
      })
      .catch((err) => {
        setListError(err.message)
        setListStatus('error')
      })
  }

  useEffect(() => {
    loadNotes()
  }, [])

  async function handleSubmit(noteData) {
    setSaving(true)
    setActionError('')
    try {
      if (editingNote) {
        const updated = await updateNote(editingNote._id, noteData)
        setNotes((prev) => prev.map((n) => (n._id === updated._id ? updated : n)))
        setEditingNote(null)
      } else {
        const created = await createNote(noteData)
        setNotes((prev) => [created, ...prev])
      }
    } catch (err) {
      setActionError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    setDeletingId(id)
    setActionError('')
    try {
      await deleteNote(id)
      setNotes((prev) => prev.filter((n) => n._id !== id))
    } catch (err) {
      setActionError(err.message)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="min-h-screen">
      <header className="max-w-4xl mx-auto px-6 pt-12 pb-8">
        <h1 className="font-display font-700 text-3xl md:text-4xl tracking-tight">
          NoteFlow
        </h1>
        <p className="mt-3 text-ink/60">A simple, tested notes app.</p>
      </header>

      <main className="max-w-4xl mx-auto px-6 pb-20 space-y-6">
        <ErrorBanner message={actionError} onDismiss={() => setActionError('')} />

        <NoteForm
          onSubmit={handleSubmit}
          editingNote={editingNote}
          onCancelEdit={() => setEditingNote(null)}
          saving={saving}
        />

        {listStatus === 'loading' && <LoadingState />}

        {listStatus === 'error' && (
          <div className="text-center py-16">
            <p className="text-coral font-medium">{listError}</p>
            <button onClick={loadNotes} className="mt-4 bg-ink text-white font-semibold px-5 py-2.5 rounded-lg">
              Try again
            </button>
          </div>
        )}

        {listStatus === 'ready' && notes.length === 0 && <EmptyState />}

        {listStatus === 'ready' && notes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                onEdit={setEditingNote}
                onDelete={handleDelete}
                isDeleting={deletingId === note._id}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
