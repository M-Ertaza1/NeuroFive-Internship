import mongoose from 'mongoose'

// Membership (and therefore role-based permissions) lives directly on the
// Project rather than a separate join collection — simpler to query "is
// this user allowed to do X on this project" in one document fetch.
const memberSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['owner', 'member'], default: 'member' },
  },
  { _id: false }
)

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
      maxlength: 100,
    },
    description: { type: String, trim: true, maxlength: 500 },
    members: {
      type: [memberSchema],
      validate: {
        validator: (members) => members.length > 0,
        message: 'A project must have at least one member.',
      },
    },
  },
  { timestamps: true }
)

export default mongoose.model('Project', projectSchema)
