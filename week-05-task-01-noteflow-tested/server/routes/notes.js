import { Router } from 'express'
import Note from '../models/Note.js'

const router = Router()

// GET /api/notes
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 })
    res.json(notes)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch notes.' })
  }
})

// POST /api/notes
router.post('/', async (req, res) => {
  try {
    const { title, content } = req.body
    const note = await Note.create({ title, content })
    res.status(201).json(note)
  } catch (err) {
    res.status(400).json({ message: err.message || 'Failed to create note.' })
  }
})

// PUT /api/notes/:id
router.put('/:id', async (req, res) => {
  try {
    const { title, content } = req.body
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true, runValidators: true }
    )
    if (!note) return res.status(404).json({ message: 'Note not found.' })
    res.json(note)
  } catch (err) {
    res.status(400).json({ message: err.message || 'Failed to update note.' })
  }
})

// DELETE /api/notes/:id
router.delete('/:id', async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id)
    if (!note) return res.status(404).json({ message: 'Note not found.' })
    res.json({ message: 'Note deleted.' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete note.' })
  }
})

export default router
