# Doc Uploader — Deployed, Audited, and Optimized

Week 5, Task 2 for the NeuroFive Solutions Full Stack Web Development
internship: takes the Doc Uploader app (Week 4, Task 1) to production —
deployed frontend and backend, a Lighthouse audit with real fixes applied,
SEO essentials, and cross-device verification.

## Live URLs
## Live URLs
- **Frontend**: https://neuro-five-internship-ew65-2sagx7r8n-ertaza.vercel.app
- **Backend API**: https://neurofive-internship-production-7d0d.up.railway.app

## Architecture overview
```
┌─────────────┐        HTTPS         ┌──────────────┐        ┌────────────┐
│   Browser   │ ───────────────────▶ │  Frontend    │        │            │
│ (mobile or  │                      │  React/Vite  │        │            │
│  desktop)   │ ◀─────────────────── │  on Vercel   │        │            │
└─────────────┘                      └──────┬───────┘        │            │
                                             │ REST API       │  MongoDB   │
                                             │ (fetch/XHR)    │  Atlas     │
                                     ┌───────▼───────┐        │            │
                                     │   Backend      │───────▶            │
                                     │ Express/Node   │        └────────────┘
                                     │ on Render      │
                                     └───────┬────────┘
                                             │ upload_stream
                                     ┌───────▼────────┐
                                     │   Cloudinary   │
                                     │ (file storage) │
                                     └────────────────┘
```
The frontend never talks to Cloudinary or MongoDB directly — all of that
goes through the backend, which is the only place holding those credentials.

## Lighthouse audit — before / after
## Lighthouse audit — before / after
| Metric | Score |
|--------|-------|
| Performance | 99 |
| Accessibility | 94 |
| Best Practices | 100 |
| SEO | 60 → fixed with a `robots.txt` file (Vercel was serving the SPA's `index.html` for `/robots.txt` instead of a valid robots file) |

## SEO essentials added
- Descriptive `<title>` and `<meta name="description">`
- Open Graph tags so shared links preview nicely (e.g. on LinkedIn)
- `alt` text on every image (upload previews AND the gallery), not left empty
- Semantic heading structure (`h1` for the page title, `h2` for the gallery section)

## Accessibility improvements
- Drag-and-drop zone has `role="button"`, `tabIndex`, and keyboard (Enter)
  support — not mouse-only
- Icon-only buttons (remove file `×`) have `aria-label`s
- Error messages use `role="alert"` so screen readers announce them
- Upload progress bar has proper `role="progressbar"` + `aria-valuenow`

## Stack
- **Backend**: Node.js, Express, MongoDB (Mongoose), Cloudinary SDK, Multer
- **Frontend**: React (Vite), Tailwind CSS

## Environment variables

### Backend (set in Render/Railway dashboard, not committed)
| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `CLOUDINARY_CLOUD_NAME` | From Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | From Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | From Cloudinary dashboard |
| `PORT` | Usually auto-set by the host; `5000` for local dev |

### Frontend (set in Vercel dashboard)
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | The deployed backend's URL (e.g. `https://doc-uploader-api.onrender.com`) |

## Running locally
```bash
# Backend
cd server
cp .env.example .env   # fill in real values
npm install
npm run dev

# Frontend (separate terminal)
cd client
cp .env.example .env   # point at http://localhost:5000 for local dev
npm install
npm run dev
```

## Deploying

### Backend → Render
1. New Web Service → connect this repo → set **Root Directory** to this
   task's `server` folder
2. Build command: `npm install` · Start command: `npm start`
3. Add all four backend environment variables in Render's dashboard
4. Deploy — copy the resulting URL

### Frontend → Vercel
1. Import the repo → set **Root Directory** to this task's `client` folder
2. Add `VITE_API_URL` = your Render backend URL
3. Deploy

## Verified on
- Desktop Chrome (1440px+)
- Mobile viewport (375px, via DevTools device toolbar and a real phone)
- Drag-and-drop tested on desktop; tap-to-browse tested on mobile (drag-and-drop isn't a mobile interaction, so the fallback click-to-browse path matters there)
