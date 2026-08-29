# Flowdesk — Project & Task Management

**Final capstone project** for the NeuroFive Solutions Full Stack Web
Development internship: a complete, deployed, tested full-stack application
— a lightweight Trello/Asana-style project management tool with team roles,
Kanban boards, file attachments, search & filtering, a stats dashboard, and
dark mode.

## Live URLs
## Live URLs
- **Frontend**: https://neuro-five-internship-14dk.vercel.app
- **Backend API**: https://neurofive-internship-production-2b85.up.railway.app

## The problem
Small teams often reach for a spreadsheet or a group chat to track tasks,
which breaks down fast: no ownership, no due dates, no history, and no way
to see the shape of the work at a glance. Flowdesk gives a team a shared
board per project, with real accountability (who owns what, who can change
what) and a dashboard that shows where things actually stand.

## Case study

### Tech choices, and why
- **MongoDB with embedded project membership** rather than a separate
  join collection for team roles. A project's `members` array (each entry
  holding a `user` ref and a `role`) means checking "can this person delete
  this project?" is one document fetch, not a second query — worth it at
  this scale, where a project rarely has more than a handful of members.
- **JWT auth**, consistent with earlier tasks in this internship, chosen
  over sessions because the frontend and backend are deployed on completely
  separate hosts (Vercel + Railway) — no shared cookie domain to rely on.
- **Zustand** for auth and dark-mode state — both need to be read from many
  unrelated components (Navbar, ProtectedRoute, every page), which is
  exactly the prop-drilling problem global state solves.
- **HTML5 drag-and-drop** (native `draggable`/`onDragStart`/`onDrop`)
  instead of a drag-and-drop library — one Kanban board with three columns
  doesn't need the complexity of a full DnD library, and building it by
  hand is a better demonstration of understanding the underlying browser
  APIs than importing something that does it invisibly.
- **Cloudinary** for task attachments, reusing the pattern proven out in
  the Week 4 file-upload task — the server streams the file straight from
  memory to Cloudinary, never touching local disk (important since
  Railway's filesystem is ephemeral).

### A challenge I hit, and how I solved it
Role-based permissions needed to be enforced on the **server**, not just
hidden in the UI — a member who edits `localStorage` or calls the API
directly with `curl` shouldn't be able to delete a project just because the
"Delete" button happened to be hidden from them. The fix was a small
`requireProjectOwner` Express middleware that runs *after* confirming
project membership, checks the membership's `role` field, and rejects with
a 403 before the route handler ever runs. This is directly covered by a
backend test that authenticates as a non-owner and asserts the delete
request is actually rejected — not just that the button doesn't render.

## Architecture overview
```
┌──────────────┐     HTTPS      ┌───────────────┐      ┌─────────────┐
│   Browser    │ ─────────────▶ │   Frontend     │      │             │
│ (mobile or   │                │  React + Vite  │      │   MongoDB   │
│  desktop)    │ ◀───────────── │   on Vercel    │      │   Atlas     │
└──────────────┘                └───────┬────────┘      │             │
                                          │ REST API      │             │
                                          │ (JWT auth)    └──────▲──────┘
                                  ┌───────▼────────┐             │
                                  │   Backend       │─────────────┘
                                  │ Express/Node    │
                                  │  on Railway     │
                                  └───────┬─────────┘
                                          │ upload_stream
                                  ┌───────▼────────┐
                                  │   Cloudinary    │
                                  │ (attachments)   │
                                  └────────────────┘
```

## Features

### MVP
- **5 distinct pages**: Login, Signup, Dashboard, Project Board, Project Settings
- **Full CRUD on 2 related resources**: Projects and Tasks (tasks belong to
  projects), plus member management as a third resource nested under projects
- **Complete auth flow**: signup/login with bcrypt-hashed passwords, JWT
  tokens, protected routes that redirect unauthenticated users to `/login`
- **Role-based permissions**: every project has `owner` and `member` roles;
  only owners can invite/remove members, change roles, edit project
  details, or delete the project — enforced server-side via middleware, not
  just hidden UI
- **Client + server validation** on every form (signup, login, project
  creation, task creation/editing), with server-side checks that don't trust
  the client (see the `bad password` and `bad status value` tests)
- **Loading, error, and empty states** throughout — skeleton loaders while
  fetching, dismissible error banners, and distinct empty-state messaging
  (not just a blank screen) wherever a list could be empty
- **Responsive UI** — Kanban columns stack vertically on narrow screens,
  grids collapse from 3 → 2 → 1 columns

### Stretch goals implemented (3 of the suggested list)
1. **Dashboard with charts** — bar chart (tasks by status) and doughnut
   chart (tasks by priority), aggregated server-side via a MongoDB `$facet`
   pipeline across all of the user's projects
2. **File uploads** — task attachments via Cloudinary, with client-side
   type/size validation matching server-side `multer` limits
3. **Search with filters** — the task board has a live search box plus
   priority and assignee filters, all applied server-side via query params
4. **Dark mode** — toggle in the navbar, persisted to `localStorage`,
   implemented via Tailwind's `dark:` class strategy and a Zustand store

*(4 stretch goals implemented — one more than the suggested 2-3, since search+filters and the dashboard chart turned out to reinforce each other well.)*

## Automated tests (22 total)
| Layer | Tool | Count |
|-------|------|-------|
| Backend | Vitest + Supertest | 12 |
| Frontend | Vitest + React Testing Library | 10 |

Backend tests cover signup/login (happy path + validation + duplicate
email + wrong password), project creation, and — importantly — an explicit
test that a non-owner is rejected with 403 when attempting an owner-only
action, proving role-based permissions are enforced server-side, not just
hidden in the UI.

Run them:
```bash
cd server && npm install && npm test
cd client && npm install && npm test
```

## Project structure
```
flowdesk/
  server/
    models/          User.js, Project.js (embeds member roles), Task.js
    middleware/       auth.js (JWT), projectAccess.js (role checks)
    routes/            auth.js, projects.js, tasks.js, dashboard.js
    cloudinary.js, upload.js
    app.js             Express app factory (importable by tests)
    index.js           real entry point — connects DB, starts server
    tests/             auth.test.js, projects.test.js
  client/
    src/
      store/            authStore.js, themeStore.js (Zustand)
      api.js
      components/        Navbar, ProtectedRoute, AuthForm, TaskCard, Column,
                          TaskModal, SearchFilterBar, CreateProjectForm,
                          LoadingState, EmptyState, ErrorBanner
      pages/              SignupPage, LoginPage, DashboardPage,
                          ProjectBoardPage, ProjectSettingsPage
      tests/              AuthForm, TaskCard, EmptyState tests
```

## Environment variables

### Backend
| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Long random string for signing tokens |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | From your Cloudinary dashboard |
| `PORT` | Usually auto-set by the host |

### Frontend
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Your deployed backend's URL |

## Running locally
```bash
# Backend
cd server
cp .env.example .env   # fill in real values
npm install
npm run dev

# Frontend (separate terminal)
cd client
cp .env.example .env
npm install
npm run dev
```

## Deploying
Same pattern as previous tasks in this internship:
- **Backend → Railway**: Root Directory = `server`, add all 5 backend env
  vars, generate a public domain
- **Frontend → Vercel**: Root Directory = `client`, add `VITE_API_URL`
  pointing at the Railway URL

Remember: MongoDB Atlas needs "Allow Access from Anywhere" (`0.0.0.0/0`) in
Network Access, since cloud hosts don't have one fixed IP to whitelist.

## Trying it out
1. Sign up for an account
2. Create a project — you become its owner automatically
3. Add a few tasks, drag them between columns
4. Go to Project Settings, invite a second account (sign up with a
   different email in another browser/incognito window) by email
5. Log in as that second account — notice it's a `member`, not an `owner`:
   the Settings page shows a read-only notice, and it can't delete the
   project or change anyone's role
6. Back on the Dashboard, see the charts update as you add more tasks
7. Toggle dark mode from the navbar
