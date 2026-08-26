export default function NoteCard({ note, onEdit, onDelete, isDeleting }) {
  const date = new Date(note.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })

  return (
    <div data-testid="note-card" className="note-enter bg-white rounded-xl border border-ink/10 p-5 flex flex-col">
      <div className="flex items-start justify-between">
        <h3 className="font-display font-600 leading-snug pr-2">{note.title}</h3>
        <span className="font-mono text-xs text-ink/40 whitespace-nowrap">{date}</span>
      </div>
      <p className="mt-2 text-sm text-ink/70 leading-relaxed flex-1 whitespace-pre-wrap">
        {note.content}
      </p>
      <div className="mt-4 flex gap-3">
        <button
          onClick={() => onEdit(note)}
          disabled={isDeleting}
          className="text-sm font-semibold text-teal hover:underline disabled:opacity-40"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(note._id)}
          disabled={isDeleting}
          className="text-sm font-semibold text-coral hover:underline disabled:opacity-40"
        >
          {isDeleting ? 'Deleting…' : 'Delete'}
        </button>
      </div>
    </div>
  )
}
