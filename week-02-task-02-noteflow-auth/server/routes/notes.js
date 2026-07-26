import { Router } from 'express'
import Note from '../models/Note.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// Every route below requires a valid token — this is the "protected" API side.
router.use(requireAuth)

// GET /api/notes — list only the logged-in user's notes
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find({ owner: req.userId }).sort({ createdAt: -1 })
    res.json(notes)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch notes.' })
  }
})

// POST /api/notes — create a note owned by the logged-in user
router.post('/', async (req, res) => {
  try {
    const { title, content } = req.body
    const note = await Note.create({ title, content, owner: req.userId })
    res.status(201).json(note)
  } catch (err) {
    res.status(400).json({ message: err.message || 'Failed to create note.' })
  }
})

// PUT /api/notes/:id — update, only if it belongs to the logged-in user
router.put('/:id', async (req, res) => {
  try {
    const { title, content } = req.body
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, owner: req.userId },
      { title, content },
      { new: true, runValidators: true }
    )
    if (!note) return res.status(404).json({ message: 'Note not found.' })
    res.json(note)
  } catch (err) {
    res.status(400).json({ message: err.message || 'Failed to update note.' })
  }
})

// DELETE /api/notes/:id — delete, only if it belongs to the logged-in user
router.delete('/:id', async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, owner: req.userId })
    if (!note) return res.status(404).json({ message: 'Note not found.' })
    res.json({ message: 'Note deleted.' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete note.' })
  }
})

export default router
