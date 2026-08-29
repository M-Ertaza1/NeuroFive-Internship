export default function EmptyState({ icon = '📭', title, description }) {
  return (
    <div className="text-center py-16 border border-dashed border-ink/15 dark:border-canvas/15 rounded-xl">
      <span className="text-3xl" role="img" aria-hidden="true">{icon}</span>
      <p className="mt-3 font-display font-600">{title}</p>
      {description && <p className="mt-1 text-sm text-ink/50 dark:text-canvas/50">{description}</p>}
    </div>
  )
}
