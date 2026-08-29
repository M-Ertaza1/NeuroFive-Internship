import TaskCard from './TaskCard'

const LABELS = { todo: 'To Do', 'in-progress': 'In Progress', done: 'Done' }

export default function Column({ status, tasks, onDrop, onTaskClick, onDragStart }) {
  function handleDragOver(e) {
    e.preventDefault() // required to allow dropping
  }

  function handleDrop(e) {
    e.preventDefault()
    onDrop(status)
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="bg-canvas dark:bg-ink/40 rounded-xl p-4 min-h-[300px] flex-1"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-600 text-sm">{LABELS[status]}</h3>
        <span className="text-xs font-mono text-ink/40 dark:text-canvas/40 bg-white dark:bg-ink rounded-full px-2 py-0.5">
          {tasks.length}
        </span>
      </div>
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onClick={() => onTaskClick(task)}
            onDragStart={onDragStart}
          />
        ))}
        {tasks.length === 0 && (
          <p className="text-xs text-ink/30 dark:text-canvas/30 text-center py-6">Drop tasks here</p>
        )}
      </div>
    </div>
  )
}
