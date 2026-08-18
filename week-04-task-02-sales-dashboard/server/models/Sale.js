import mongoose from 'mongoose'

const CATEGORIES = ['Electronics', 'Apparel', 'Home & Garden', 'Sports', 'Books']
const REGIONS = ['North', 'South', 'East', 'West']

const saleSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  category: { type: String, required: true, enum: CATEGORIES },
  region: { type: String, required: true, enum: REGIONS },
  amount: { type: Number, required: true },
})

export const CATEGORY_OPTIONS = CATEGORIES
export const REGION_OPTIONS = REGIONS
export default mongoose.model('Sale', saleSchema)
