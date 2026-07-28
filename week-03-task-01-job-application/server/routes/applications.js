import { Router } from 'express'
import fs from 'fs'
import Application, { ROLE_OPTIONS } from '../models/Application.js'
import { upload } from '../upload.js'

const router = Router()

// GET /api/applications/roles — so the frontend dropdown always matches
// what the backend will actually accept (single source of truth).
router.get('/roles', (req, res) => {
  res.json(ROLE_OPTIONS)
})

// POST /api/applications
router.post('/', (req, res) => {
  upload.single('resume')(req, res, async (uploadErr) => {
    // Multer errors (wrong file type, too large) surface here first,
    // before we ever touch the database.
    if (uploadErr) {
      return res.status(400).json({ message: uploadErr.message })
    }

    try {
      const { fullName, email, phone, role, availableFrom, coverLetter } = req.body

      if (!req.file) {
        return res.status(400).json({ message: 'A resume file is required.' })
      }

      // Reject a past availability date server-side, even though the
      // frontend also blocks this — never trust the client alone.
      const parsedDate = new Date(availableFrom)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (isNaN(parsedDate.getTime()) || parsedDate < today) {
        fs.unlink(req.file.path, () => {})
        return res.status(400).json({ message: 'Availability date must be today or later.' })
      }

      const application = await Application.create({
        fullName,
        email,
        phone,
        role,
        availableFrom: parsedDate,
        coverLetter,
        resumeFilename: req.file.filename,
        resumeOriginalName: req.file.originalname,
      })

      res.status(201).json({
        message: 'Application submitted successfully.',
        application,
      })
    } catch (err) {
      // Clean up the uploaded file if the DB save failed, so we don't
      // accumulate orphaned files on disk.
      if (req.file) fs.unlink(req.file.path, () => {})

      if (err.name === 'ValidationError') {
        const firstError = Object.values(err.errors)[0]?.message || 'Invalid submission.'
        return res.status(400).json({ message: firstError, errors: err.errors })
      }
      res.status(500).json({ message: 'Failed to submit application. Please try again.' })
    }
  })
})

// GET /api/applications — list submissions (useful to confirm data landed)
router.get('/', async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 })
    res.json(applications)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch applications.' })
  }
})

export default router
