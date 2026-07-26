import mongoose from 'mongoose'

const noteSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: 120,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true,
    },
  },
  { timestamps: true }
)

export default mongoose.model('Note', noteSchema)
