# Doc Uploader — Drag-and-Drop File Upload with Cloudinary

Week 4, Task 1 for the NeuroFive Solutions Full Stack Web Development
internship: a polished file/image upload component with drag-and-drop, a
real upload progress bar, client-side validation, and cloud storage via
Cloudinary.

## Live demo
- Frontend: [Add your deployed frontend URL here]
- Backend API: [Add your deployed backend URL here]

## Features
- **Drag-and-drop zone** (or click to browse) — not a bare `<input type="file">`
- **Preview before upload**: image files show a thumbnail; documents show a
  file icon, name, and size
- **Real upload progress bar** — driven by `XMLHttpRequest`'s
  `upload.onprogress` event (fetch has no way to report upload progress, so
  this deliberately uses XHR instead)
- **Client-side validation** before anything is sent: file type (images,
  PDF, Word only) and size (10MB max) — with matching limits enforced again
  on the server via multer
- **Cloud storage** — files are streamed straight from the server's memory
  to Cloudinary, never touching local disk (this matters for deployment,
  since most free hosting tiers have ephemeral filesystems)
- **Gallery of uploaded files** — image previews or download links, with a
  skeleton loading state and a distinct empty state

## Stack
- **Backend**: Node.js, Express, MongoDB (Mongoose, stores file metadata),
  Multer (memory storage), Cloudinary SDK, streamifier
- **Frontend**: React (Vite), Tailwind CSS

## Project structure
```
doc-uploader/
  server/
    cloudinary.js         — Cloudinary SDK config
    upload.js              — multer memory storage + type/size filter
    models/Upload.js        — stores originalName, url, publicId, bytes, etc.
    routes/uploads.js       — POST (stream to Cloudinary) + GET (list)
    index.js
  client/
    src/
      api.js                — getUploads + uploadFile (XHR w/ progress)
      App.jsx
      components/
        Dropzone.jsx         — drag-and-drop, validation, preview, progress
        UploadedFilesList.jsx — gallery with loading/empty states
```

## Running locally

### 1. Get a free Cloudinary account
Sign up at cloudinary.com — your dashboard shows **Cloud Name**, **API
Key**, and **API Secret**.

### 2. Backend
```bash
cd server
cp .env.example .env
```
Fill in `.env` with your MongoDB URI and Cloudinary credentials, then:
```bash
npm install
npm run dev
```

### 3. Frontend
```bash
cd client
cp .env.example .env
npm install
npm run dev
```

## Testing (for your demo video)
- Drag a file onto the dropzone (or click to browse) — confirm the zone
  highlights on drag-over
- Try an unsupported file type (e.g. `.zip`) — confirm the validation error
  appears before any network request happens
- Try a file over 10MB — confirm the size error
- Upload a valid image — watch the real progress bar climb to 100%, then see
  it appear in the gallery below with a thumbnail
- Upload a PDF/Word doc — confirm it appears with a file icon and a working
  "Download / view" link that opens the Cloudinary-hosted file
- Reload the page — confirm previously uploaded files still load (they're
  persisted in MongoDB + Cloudinary, not just local component state)

## Deploying
Render/Railway for the backend (add `MONGODB_URI`, `CLOUDINARY_CLOUD_NAME`,
`CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `PORT` as environment
variables there), Vercel/Netlify for the frontend (`VITE_API_URL` pointing
at the deployed backend).
