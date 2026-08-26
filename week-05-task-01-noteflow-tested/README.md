# NoteFlow — Tested

Week 5, Task 1 for the NeuroFive Solutions Full Stack Web Development
internship: adds a full automated test suite to the NoteFlow CRUD app
(Week 2, Task 1) — frontend component tests, backend API tests, and an
end-to-end test simulating a real user flow.

## Test summary
| Layer | Tool | Count | Location |
|-------|------|-------|----------|
| Frontend | Vitest + React Testing Library | **11 tests** | `client/src/tests/` |
| Backend | Vitest + Supertest | **8 tests** | `server/tests/` |
| End-to-end | Playwright | **1 flow test** | `e2e/tests/` |

## What's tested

### Frontend (`client/src/tests/`)
- `NoteForm.test.jsx` (5 tests): renders inputs/button, blocks submission
  and shows an error on empty fields, calls `onSubmit` with trimmed values,
  pre-fills correctly in edit mode, disables the button while saving
- `NoteCard.test.jsx` (4 tests): renders title/content, calls `onEdit` /
  `onDelete` with the right arguments, disables buttons and shows
  "Deleting…" while a delete is in flight
- `EmptyLoadingStates.test.jsx` (2 tests): empty state message renders,
  loading state renders the expected number of skeleton placeholders

### Backend (`server/tests/notes.test.js`)
Each endpoint has a happy-path test AND a failure-case test:
- `GET /api/notes` — 200 with notes / 500 on DB error
- `POST /api/notes` — 201 on success / 400 on validation failure
- `PUT /api/notes/:id` — 200 on success / 404 when note doesn't exist
- `DELETE /api/notes/:id` — 200 on success / 404 when note doesn't exist

The Mongoose `Note` model is **mocked** in these tests (`vi.mock`), so they
run instantly with no real database connection required — they test the
route/HTTP layer's behavior (status codes, response shape, error handling),
not Mongoose itself.

### End-to-end (`e2e/tests/notes-flow.spec.js`)
Simulates a real user: opens the app, fills out the note form, submits it,
confirms the new note appears in the list **without a page reload**, deletes
it, and confirms it disappears. This is the one thing unit tests can't
verify — that the frontend, backend, and database actually work together.

## Running the tests

### Backend tests
```bash
cd server
npm install
npm test
```
No `.env` or real database needed — the model is mocked.

### Frontend tests
```bash
cd client
npm install
npm test
```

### End-to-end test
Requires both servers actually running (this test drives a real browser
against your real app):
```bash
# Terminal 1
cd server
cp .env.example .env   # fill in MONGODB_URI
npm install
npm run dev

# Terminal 2
cd client
cp .env.example .env
npm install
npm run dev

# Terminal 3
cd e2e
npm install
npx playwright install   # downloads browser binaries, one-time
npm test
```

## Project structure
```
noteflow-tested/
  server/
    app.js              — Express app factory (exported so tests can import
                           it directly with supertest, without binding a
                           real port or connecting to a real database)
    index.js             — actual entry point, connects to MongoDB + listens
    tests/notes.test.js
  client/
    src/
      tests/
        setup.js          — loads jest-dom matchers
        NoteForm.test.jsx
        NoteCard.test.jsx
        EmptyLoadingStates.test.jsx
  e2e/
    playwright.config.js
    tests/notes-flow.spec.js
```

## Deploying
Same as the original NoteFlow task — Render/Railway for the backend,
Vercel/Netlify for the frontend. Tests aren't part of the deployed app;
they run in your local environment (or a CI pipeline) before/after
deploying, not on the live server.
