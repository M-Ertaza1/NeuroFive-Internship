import mongoose from 'mongoose'

const uploadSchema = new mongoose.Schema(
  {
    originalName: { type: String, required: true },
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    resourceType: { type: String, required: true }, // 'image' or 'raw' (documents)
    format: { type: String },
    bytes: { type: Number, required: true },
  },
  { timestamps: true }
)

export default mongoose.model('Upload', uploadSchema)
