import express from 'express'
import cors from 'cors'
import notesRouter from './routes/notes.js'

// Exported separately from index.js so tests can import the Express app
// directly with supertest, without needing to bind a real port or connect
// to a real MongoDB — that's what makes the backend tests fast and isolated.
export function createApp() {
  const app = express()
  app.use(cors())
  app.use(express.json())
  app.use('/api/notes', notesRouter)
  app.get('/', (req, res) => res.json({ status: 'NoteFlow API is running.' }))
  return app
}
