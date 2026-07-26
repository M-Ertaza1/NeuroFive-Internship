# NoteFlow Auth — Full-Stack CRUD + Authentication

Week 2, Task 2 for the NeuroFive Solutions Full Stack Web Development
internship: extends the NoteFlow app (Task 1) with real user accounts —
signup, login, a JWT-protected API, a protected frontend page, and logout.

## Live demo
- Frontend: [Add your deployed frontend URL here]
- Backend API: [Add your deployed backend URL here]

## Stack
- **Backend**: Node.js, Express, MongoDB (Mongoose), bcryptjs, jsonwebtoken
- **Frontend**: React (Vite), React Router, Tailwind CSS

## Auth flow
1. **Signup** (`POST /api/auth/signup`) — validates email format and password
   length (min 8 chars) server-side (in addition to the frontend's own
   validation), hashes the password with bcrypt (10 salt rounds), creates the
   user, and returns a JWT.
2. **Login** (`POST /api/auth/login`) — verifies the password against the
   stored hash with `bcrypt.compare`, returns a JWT on success.
3. **Token storage** — the JWT is stored in the browser's `localStorage` and
   attached as an `Authorization: Bearer <token>` header on every notes
   request.
4. **Protected routes**:
   - *Backend*: `requireAuth` middleware verifies the JWT on every `/api/notes/*`
     request; without a valid token you get a 401, not data.
   - *Frontend*: `/notes` is wrapped in `<ProtectedRoute>` — if there's no
     logged-in user, it redirects to `/login` and remembers where you were
     headed so it can send you back after logging in.
5. **Logout** — clears the token from `localStorage` and clears the in-memory
   user state, so the protected page immediately redirects to login again.
6. **Per-user data** — notes now have an `owner` field; the API only ever
   returns/updates/deletes notes belonging to the logged-in user.

## A note on token storage (worth mentioning in an interview)
This project stores the JWT in `localStorage` for simplicity, which is the
most common approach in tutorials but is vulnerable to theft via XSS if the
app ever has an injection bug. A more production-hardened approach stores the
token in an `httpOnly` cookie instead, which JavaScript can't read at all.
That requires the backend to set/read cookies rather than the frontend
attaching a header manually — a good next iteration on this project.

## Project structure
```
noteflow-auth/
  server/
    models/User.js       — email + bcrypt password hash
    models/Note.js       — now includes an `owner` field
    middleware/auth.js   — verifies JWT, attaches req.userId
    routes/auth.js       — signup / login / me
    routes/notes.js      — all routes now behind requireAuth, scoped by owner
    index.js
  client/
    src/
      context/AuthContext.jsx   — holds user state, login/signup/logout, checks
                                   stored token validity on load
      components/AuthForm.jsx   — shared form for signup + login
      components/ProtectedRoute.jsx
      pages/SignupPage.jsx
      pages/LoginPage.jsx
      pages/NotesPage.jsx       — the protected page (moved out of App.jsx)
      App.jsx                   — sets up routes
```

## Running locally

### 1. Backend
```bash
cd server
cp .env.example .env
```
Fill in `.env`:
```
MONGODB_URI=<your MongoDB connection string>
PORT=5000
JWT_SECRET=<a long random string>
```
Generate a random secret with:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Then:
```bash
npm install
npm run dev
```

### 2. Frontend
```bash
cd client
cp .env.example .env
npm install
npm run dev
```

## Testing the full flow (for your demo video)
1. Go to `/signup`, create an account → you land on `/notes`
2. Log out → you're kicked back to `/login`
3. Try visiting `/notes` directly while logged out → redirected to `/login`
4. Log back in with the same credentials → lands on `/notes` again, your
   notes are still there (they belong to your user)
5. Try a wrong password → see the "Invalid email or password" error

## Deploying
Same as NoteFlow (Task 1) — Render/Railway for the backend, Vercel/Netlify
for the frontend. Remember to set `JWT_SECRET`, `MONGODB_URI`, and `PORT` as
environment variables on the backend host, and `VITE_API_URL` on the frontend
host pointing at the deployed backend.
