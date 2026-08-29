const PRIORITY_STYLES = {
  low: 'bg-teal-light text-teal',
  medium: 'bg-amber/20 text-amber-dark',
  high: 'bg-coral-light text-coral',
}

export default function TaskCard({ task, onClick, onDragStart }) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className="fade-in bg-white dark:bg-ink rounded-lg border border-ink/10 dark:border-canvas/15 p-4 cursor-grab active:cursor-grabbing hover:border-teal/40 transition-colors"
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-medium text-sm leading-snug">{task.title}</h4>
        {task.attachmentUrl && <span title="Has attachment" aria-label="Has attachment">📎</span>}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className={`text-xs font-mono px-2 py-0.5 rounded ${PRIORITY_STYLES[task.priority]}`}>
          {task.priority}
        </span>
        {task.assignee && (
          <span className="text-xs text-ink/50 dark:text-canvas/50" title={task.assignee.name}>
            {task.assignee.name.split(' ')[0]}
          </span>
        )}
      </div>
      {task.dueDate && (
        <p className="text-xs text-ink/40 dark:text-canvas/40 mt-2 font-mono">
          Due {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </p>
      )}
    </div>
  )
}
