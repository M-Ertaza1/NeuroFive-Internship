export default function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center text-center py-20">
      <span className="text-4xl mb-4">🎬💔</span>
      <h3 className="font-display font-600 text-lg">Couldn't load movies</h3>
      <p className="mt-2 text-sm text-ink/60 max-w-sm">
        {message || 'Something went wrong reaching the movie database. Please try again.'}
      </p>
      <button
        onClick={onRetry}
        className="mt-6 bg-ink text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-amber hover:text-ink transition-colors"
      >
        Try again
      </button>
    </div>
  )
}
