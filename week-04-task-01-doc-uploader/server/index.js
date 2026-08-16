import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import uploadsRouter from './routes/uploads.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.use('/api/uploads', uploadsRouter)

app.get('/', (req, res) => {
  res.json({ status: 'Doc Uploader API is running.' })
})

async function start() {
  const required = ['MONGODB_URI', 'CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET']
  const missing = required.filter((key) => !process.env[key])
  if (missing.length > 0) {
    console.error(`Missing required .env values: ${missing.join(', ')} — see .env.example.`)
    process.exit(1)
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB.')
    app.listen(PORT, () => console.log(`Doc Uploader API listening on port ${PORT}`))
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message)
    process.exit(1)
  }
}

start()
