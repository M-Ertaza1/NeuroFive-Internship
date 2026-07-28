import mongoose from 'mongoose'

const ROLES = ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'UI/UX Designer', 'QA Engineer']

const applicationSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Full name must be at least 2 characters'],
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^\+?[0-9\s-]{7,15}$/, 'Please enter a valid phone number'],
    },
    role: {
      type: String,
      required: [true, 'Please select a role'],
      enum: {
        values: ROLES,
        message: 'Please select a valid role from the list',
      },
    },
    availableFrom: {
      type: Date,
      required: [true, 'Availability date is required'],
    },
    coverLetter: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    resumeFilename: {
      type: String,
      required: [true, 'A resume file is required'],
    },
    resumeOriginalName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

export const ROLE_OPTIONS = ROLES
export default mongoose.model('Application', applicationSchema)
