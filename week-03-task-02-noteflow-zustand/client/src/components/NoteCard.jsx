export default function NoteCard({ note, onEdit, onDelete }) {
  const preview = note.content.length > 140 ? note.content.slice(0, 140) + '…' : note.content
  const date = new Date(note.updatedAt || note.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })

  return (
    <div className="note-enter group bg-white border border-ink/10 rounded-xl p-4 hover:border-teal/40 hover:shadow-sm transition-all">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display font-semibold text-ink truncate">{note.title}</h3>
        <span className="text-xs text-ink/40 font-mono shrink-0 mt-0.5">{date}</span>
      </div>
      <p className="text-sm text-ink/60 mt-1.5 leading-relaxed whitespace-pre-line">{preview}</p>
      <div className="flex gap-3 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(note)}
          className="text-xs font-medium text-teal hover:text-teal-dark"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(note._id)}
          className="text-xs font-medium text-coral hover:text-coral/80"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
