export default function EmptyState({ query }) {
  return (
    <div className="flex flex-col items-center text-center py-20">
      <span className="text-4xl mb-4">🔍</span>
      <h3 className="font-display font-600 text-lg">No movies found</h3>
      <p className="mt-2 text-sm text-ink/60">
        Nothing matched "{query}". Try a different title.
      </p>
    </div>
  )
}
