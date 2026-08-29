import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { createApp } from './app.js'

dotenv.config()

const PORT = process.env.PORT || 5000
const app = createApp()

async function start() {
  const required = ['MONGODB_URI', 'JWT_SECRET', 'CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET']
  const missing = required.filter((key) => !process.env[key])
  if (missing.length > 0) {
    console.error(`Missing required .env values: ${missing.join(', ')} — see .env.example.`)
    process.exit(1)
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB.')
    app.listen(PORT, () => console.log(`Flowdesk API listening on port ${PORT}`))
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message)
    process.exit(1)
  }
}

start()
