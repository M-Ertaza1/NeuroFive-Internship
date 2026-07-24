# Reeler — Movie Explorer

Week 1, Task 2 for the NeuroFive Solutions Full Stack Web Development
internship: a frontend app that fetches and displays live data from a public
API (TMDB), with loading, error, and empty states, plus a live search filter.

## Live demo
[Add your Vercel/Netlify URL here after deploying]

## Features
- Fetches popular movies from TMDB on load
- Search input filters results live (debounced 500ms so it doesn't spam the API on every keystroke)
- **Loading state**: skeleton placeholder cards while fetching
- **Error state**: friendly message + "Try again" button if the API call fails
- **Empty state**: message when a search returns zero results

## Setup
1. Get a free API key at https://www.themoviedb.org/settings/api
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Paste your TMDB API Read Access Token into `.env`
4. Install and run:
   ```bash
   npm install
   npm run dev
   ```

⚠️ `.env` is git-ignored on purpose — never commit real API keys to a public repo.

## Structure
```
src/
  api.js               — TMDB fetch wrapper, throws descriptive errors
  App.jsx              — owns query/movies/status state, debounces search
  components/
    SearchBar.jsx
    MovieCard.jsx       — reusable, renders one movie's poster/title/rating
    LoadingState.jsx    — skeleton grid
    ErrorState.jsx      — retry button
    EmptyState.jsx      — shown for zero search results
```

## Testing the error state
To see the error state deliberately (for your demo video), you can temporarily
rename your `.env` file, or edit `src/api.js` to point `BASE_URL` at an invalid
URL, reload, then restore it afterward.

## Deploying
Remember to add `VITE_TMDB_API_KEY` as an **environment variable** in your
Vercel project settings (Project → Settings → Environment Variables) — it
won't work from a committed `.env` file since that's git-ignored.
