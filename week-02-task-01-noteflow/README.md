# NoteFlow — Full-Stack CRUD Notes App

Week 1, Task 3 for the NeuroFive Solutions Full Stack Web Development
internship: a self-built backend API connected to a React frontend, with full
Create / Read / Update / Delete for a single "Note" resource.

## Live demo
- Frontend: [Add your deployed frontend URL here]
- Backend API: [Add your deployed backend URL here]

## Stack
- **Backend**: Node.js, Express, MongoDB (Mongoose)
- **Frontend**: React (Vite), Tailwind CSS

## Project structure
```
noteflow/
  server/          — Express + MongoDB API
    models/Note.js
    routes/notes.js
    index.js
  client/          — React frontend
    src/
      api.js
      App.jsx
      components/
        NoteForm.jsx
        NoteCard.jsx
        LoadingState.jsx
        EmptyState.jsx
        ErrorBanner.jsx
```

## API endpoints
| Method | Path             | Description       |
|--------|------------------|--------------------|
| GET    | /api/notes       | List all notes     |
| POST   | /api/notes       | Create a note       |
| PUT    | /api/notes/:id   | Update a note       |
| DELETE | /api/notes/:id   | Delete a note       |

## Running locally

### 1. Backend
```bash
cd server
cp .env.example .env
# paste your MongoDB Atlas connection string into .env
npm install
npm run dev
```
Runs on http://localhost:5000 by default.

### 2. Frontend
```bash
cd client
cp .env.example .env
# .env already points at http://localhost:5000 for local dev
npm install
npm run dev
```
Runs on http://localhost:5173 by default.

## Loading & error states
Every action has its own visible state, not just a blank screen:
- Initial list load: skeleton cards
- Create/update: submit button shows "Saving…" and is disabled
- Delete: that specific card's button shows "Deleting…" (only that card, not the whole list)
- Any failed request: a dismissible red banner with the actual error message,
  plus a "Try again" button if the initial list load fails entirely

## Deploying
- **Backend**: Render, Railway, or Fly.io all have free tiers that work well
  for a small Express + MongoDB API.
- **Frontend**: Vercel or Netlify, same as previous tasks — just set
  `VITE_API_URL` as an environment variable pointing at your deployed
  backend's URL.
