import { Router } from 'express'
import Note from '../models/Note.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
router.use(requireAuth)

router.get('/', async (req, res) => {
  try {
    const notes = await Note.find({ owner: req.userId }).sort({ createdAt: -1 })
    res.json(notes)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch notes.' })
  }
})

router.post('/', async (req, res) => {
  try {
    const { title, content } = req.body
    const note = await Note.create({ title, content, owner: req.userId })
    res.status(201).json(note)
  } catch (err) {
    res.status(400).json({ message: err.message || 'Failed to create note.' })
  }
})

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
