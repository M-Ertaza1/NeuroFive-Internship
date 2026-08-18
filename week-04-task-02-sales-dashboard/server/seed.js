import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Sale, { CATEGORY_OPTIONS, REGION_OPTIONS } from './models/Sale.js'

dotenv.config()

function randomBetween(min, max) {
  return Math.random() * (max - min) + min
}

function randomDateInLast(months) {
  const now = new Date()
  const past = new Date()
  past.setMonth(now.getMonth() - months)
  const time = randomBetween(past.getTime(), now.getTime())
  return new Date(time)
}

async function seed() {
  if (!process.env.MONGODB_URI) {
    console.error('Missing MONGODB_URI in .env')
    process.exit(1)
  }

  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Connected to MongoDB. Seeding sample sales data...')

  await Sale.deleteMany({})

  const records = []
  const COUNT = 400

  for (let i = 0; i < COUNT; i++) {
    const category = CATEGORY_OPTIONS[Math.floor(Math.random() * CATEGORY_OPTIONS.length)]
    const region = REGION_OPTIONS[Math.floor(Math.random() * REGION_OPTIONS.length)]

    // Give categories different typical price ranges so the charts look
    // realistic rather than uniformly random.
    const ranges = {
      Electronics: [80, 900],
      Apparel: [15, 150],
      'Home & Garden': [20, 400],
      Sports: [10, 250],
      Books: [8, 60],
    }
    const [min, max] = ranges[category]
    const amount = Math.round(randomBetween(min, max) * 100) / 100

    records.push({
      date: randomDateInLast(9),
      category,
      region,
      amount,
    })
  }

  await Sale.insertMany(records)
  console.log(`Seeded ${records.length} sample sales records.`)
  await mongoose.disconnect()
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
