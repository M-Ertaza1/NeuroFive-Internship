const BASE_URL = 'https://api.themoviedb.org/3'
const API_KEY = import.meta.env.VITE_TMDB_API_KEY

/**
 * Fetches movies from TMDB — either "popular" (no query) or a search
 * result (with query). Throws a descriptive error on failure so the
 * calling component can show a friendly message instead of crashing.
 */
export async function fetchMovies(query) {
  if (!API_KEY) {
    throw new Error(
      'Missing API key. Add VITE_TMDB_API_KEY to your .env file (see .env.example).'
    )
  }

  const endpoint = query
    ? `${BASE_URL}/search/movie?query=${encodeURIComponent(query)}&include_adult=false`
    : `${BASE_URL}/movie/popular`

  const response = await fetch(endpoint, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`TMDB request failed (status ${response.status}).`)
  }

  const data = await response.json()
  return data.results ?? []
}

export function posterUrl(path) {
  return path
    ? `https://image.tmdb.org/t/p/w342${path}`
    : null
}
