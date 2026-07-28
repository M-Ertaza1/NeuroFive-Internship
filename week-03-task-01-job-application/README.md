# Job Application Form — Full-Stack Validated Form

Week 3, Task 1 for the NeuroFive Solutions Full Stack Web Development
internship: a multi-field form with client-side AND server-side validation,
a file upload, success/error toasts, and a disabled/loading submit state.

## Live demo
- Frontend: [Add your deployed frontend URL here]
- Backend API: [Add your deployed backend URL here]

## Fields (6, covering all three required input types)
1. Full name — text
2. Email — text
3. Phone — text
4. Role — **dropdown/select** (options fetched from the backend, so frontend
   and backend never disagree about valid values)
5. Available from — **date** (blocked from selecting a past date, both in
   the browser's date picker `min` attribute and again on the server)
6. Resume — **file upload** (PDF/Word only, max 5MB)
7. Cover letter — optional textarea, bonus field

## Validation — client AND server, matching rules
| Rule | Frontend | Backend |
|------|----------|---------|
| Full name ≥ 2 chars | ✅ | ✅ (Mongoose `minlength`) |
| Valid email format | ✅ regex | ✅ Mongoose `match` |
| Valid phone format | ✅ regex | ✅ Mongoose `match` |
| Role must be one of the fixed list | ✅ (dropdown only shows valid options) | ✅ Mongoose `enum` |
| Date must be today or later | ✅ (`min` on date input + JS check) | ✅ (rejects past dates explicitly) |
| Resume required, correct type, under 5MB | ✅ | ✅ (multer `fileFilter` + `limits`) |

Every field-specific error message is shown directly under that field — not
a single generic "invalid input" banner.

## Stack
- **Backend**: Node.js, Express, MongoDB (Mongoose), Multer (file uploads)
- **Frontend**: React (Vite), Tailwind CSS

## Project structure
```
job-application/
  server/
    models/Application.js   — schema + validation rules, exports ROLE_OPTIONS
    upload.js                — multer config: file type filter, 5MB limit
    routes/applications.js   — POST (submit) + GET (list) + GET /roles
    index.js
  client/
    src/
      api.js
      App.jsx
      components/
        ApplicationForm.jsx  — all fields, client-side validation, submit logic
        Toast.jsx            — success/error banner
```

## Running locally

### 1. Backend
```bash
cd server
cp .env.example .env
# paste your MongoDB connection string into .env
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

## Testing validation (for your demo video)
- Submit with empty fields → see field-specific errors appear under each one
- Enter an invalid email (e.g. "notanemail") → see the email-specific error
- Try to pick a date in the past → date input won't allow it
- Try uploading a .txt or .jpg file as the resume → see the file-type error
- Try uploading a resume over 5MB → see the size error
- Fill everything correctly → submit button shows a spinner + "Submitting…",
  then a green success toast appears and the form resets
- To see a server-rejected submission even after passing client validation
  (proving the backend really does check independently): temporarily stop
  the backend server, then submit — you'll see the red error toast

## Deploying
Same pattern as previous tasks — Render/Railway for the backend (remember:
file uploads on most free hosting tiers are NOT persisted across restarts/
redeploys, since the filesystem is ephemeral; for a real production app,
resumes would go to S3 or Cloudinary instead of local disk — worth
mentioning if asked in an interview), Vercel/Netlify for the frontend with
`VITE_API_URL` set to the deployed backend's URL.
