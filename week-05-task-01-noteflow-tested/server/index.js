import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { createApp } from './app.js'

dotenv.config()

const PORT = process.env.PORT || 5000
const app = createApp()

async function start() {
  if (!process.env.MONGODB_URI) {
    console.error('Missing MONGODB_URI in .env — see .env.example.')
    process.exit(1)
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB.')
    app.listen(PORT, () => console.log(`NoteFlow API listening on port ${PORT}`))
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message)
    process.exit(1)
  }
}

start()
