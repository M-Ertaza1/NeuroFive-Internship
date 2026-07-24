import { posterUrl } from '../api'

export default function MovieCard({ movie }) {
  const poster = posterUrl(movie.poster_path)
  const year = movie.release_date ? movie.release_date.slice(0, 4) : '—'

  return (
    <div className="bg-white rounded-xl border border-ink/10 overflow-hidden hover:border-teal/40 transition-colors">
      <div className="aspect-[2/3] bg-canvas">
        {poster ? (
          <img
            src={poster}
            alt={`${movie.title} poster`}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-ink/30 text-sm px-4 text-center">
            No poster available
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-display font-600 text-sm leading-snug line-clamp-2">
          {movie.title}
        </h3>
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="font-mono text-ink/50">{year}</span>
          <span className="font-mono bg-teal-light text-teal px-2 py-0.5 rounded">
            ★ {movie.vote_average?.toFixed(1) ?? '—'}
          </span>
        </div>
      </div>
    </div>
  )
}
