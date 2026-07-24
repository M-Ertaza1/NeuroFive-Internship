import { useEffect, useState } from 'react'
import SearchBar from './components/SearchBar'
import MovieCard from './components/MovieCard'
import LoadingState from './components/LoadingState'
import ErrorState from './components/ErrorState'
import EmptyState from './components/EmptyState'
import { fetchMovies } from './api'

export default function App() {
  const [query, setQuery] = useState('')
  const [movies, setMovies] = useState([])
  const [status, setStatus] = useState('loading') // 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('')
  const [retryToken, setRetryToken] = useState(0)

  useEffect(() => {
    // Debounce: wait 500ms after the user stops typing before calling the API,
    // so we don't fire a request on every keystroke.
    const timer = setTimeout(() => {
      let cancelled = false
      setStatus('loading')

      fetchMovies(query)
        .then((results) => {
          if (cancelled) return
          setMovies(results)
          setStatus('success')
        })
        .catch((err) => {
          if (cancelled) return
          setErrorMessage(err.message)
          setStatus('error')
        })

      return () => {
        cancelled = true
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [query, retryToken])

  return (
    <div className="min-h-screen">
      <header className="max-w-6xl mx-auto px-6 pt-12 pb-8">
        <span className="inline-block font-mono text-xs tracking-wide text-teal bg-teal-light px-3 py-1 rounded-full mb-4">
          WEEK 1 · TASK 2
        </span>
        <h1 className="font-display font-700 text-3xl md:text-4xl tracking-tight">
          Reeler — Movie Explorer
        </h1>
        <p className="mt-3 text-ink/60 max-w-lg">
          Browsing popular movies via the TMDB API. Search below to filter live.
        </p>
        <div className="mt-6 max-w-md">
          <SearchBar value={query} onChange={setQuery} />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pb-20">
        {status === 'loading' && <LoadingState />}

        {status === 'error' && (
          <ErrorState message={errorMessage} onRetry={() => setRetryToken((t) => t + 1)} />
        )}

        {status === 'success' && movies.length === 0 && <EmptyState query={query} />}

        {status === 'success' && movies.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
