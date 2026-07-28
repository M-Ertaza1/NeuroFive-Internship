import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import path from 'path'
import applicationsRouter from './routes/applications.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))

app.use('/api/applications', applicationsRouter)

app.get('/', (req, res) => {
  res.json({ status: 'Job Application API is running.' })
})

async function start() {
  if (!process.env.MONGODB_URI) {
    console.error('Missing MONGODB_URI in .env — see .env.example.')
    process.exit(1)
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB.')
    app.listen(PORT, () => console.log(`Job Application API listening on port ${PORT}`))
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message)
    process.exit(1)
  }
}

start()
