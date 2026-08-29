export default function LoadingState({ count = 4 }) {
  return (
    <div data-testid="loading-state" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-ink/60 rounded-xl border border-ink/10 dark:border-canvas/10 p-5 space-y-3">
          <div className="h-4 w-2/3 rounded skeleton" />
          <div className="h-3 w-full rounded skeleton" />
        </div>
      ))}
    </div>
  )
}
