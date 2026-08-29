import { Router } from 'express'
import streamifier from 'streamifier'
import Task, { TASK_STATUSES, TASK_PRIORITIES } from '../models/Task.js'
import { requireAuth } from '../middleware/auth.js'
import { requireProjectMember } from '../middleware/projectAccess.js'
import cloudinary from '../cloudinary.js'
import { upload } from '../upload.js'

const router = Router({ mergeParams: true })
router.use(requireAuth)
router.use(requireProjectMember) // :projectId param — every member can view/manage tasks

function streamUpload(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'auto', folder: 'flowdesk-attachments' },
      (error, result) => (error ? reject(error) : resolve(result))
    )
    streamifier.createReadStream(buffer).pipe(stream)
  })
}

// GET /api/projects/:projectId/tasks — with optional search + filters (stretch goal)
router.get('/', async (req, res) => {
  try {
    const { search, status, priority, assignee } = req.query
    const match = { project: req.project._id }

    if (search) match.title = { $regex: search, $options: 'i' }
    if (status) match.status = status
    if (priority) match.priority = priority
    if (assignee) match.assignee = assignee

    const tasks = await Task.find(match)
      .populate('assignee', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
    res.json(tasks)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch tasks.' })
  }
})

// POST /api/projects/:projectId/tasks — optional file attachment in the same request
router.post('/', (req, res) => {
  upload.single('attachment')(req, res, async (uploadErr) => {
    if (uploadErr) return res.status(400).json({ message: uploadErr.message })

    try {
      const { title, description, priority, dueDate, assignee } = req.body
      if (!title || !title.trim()) {
        return res.status(400).json({ message: 'Title is required.' })
      }
      if (priority && !TASK_PRIORITIES.includes(priority)) {
        return res.status(400).json({ message: 'Invalid priority value.' })
      }

      let attachmentUrl, attachmentName
      if (req.file) {
        const result = await streamUpload(req.file.buffer)
        attachmentUrl = result.secure_url
        attachmentName = req.file.originalname
      }

      const task = await Task.create({
        project: req.project._id,
        title: title.trim(),
        description,
        priority: priority || 'medium',
        dueDate: dueDate || undefined,
        assignee: assignee || undefined,
        createdBy: req.userId,
        attachmentUrl,
        attachmentName,
      })
      const populated = await task.populate(['assignee', 'createdBy'])
      res.status(201).json(populated)
    } catch (err) {
      res.status(400).json({ message: err.message || 'Failed to create task.' })
    }
  })
})

// PUT /api/projects/:projectId/tasks/:taskId — update fields, including drag-and-drop status change
router.put('/:taskId', async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, assignee } = req.body

    if (status && !TASK_STATUSES.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' })
    }
    if (priority && !TASK_PRIORITIES.includes(priority)) {
      return res.status(400).json({ message: 'Invalid priority value.' })
    }

    const task = await Task.findOne({ _id: req.params.taskId, project: req.project._id })
    if (!task) return res.status(404).json({ message: 'Task not found.' })

    if (title !== undefined) {
      if (!title.trim()) return res.status(400).json({ message: 'Title cannot be empty.' })
      task.title = title.trim()
    }
    if (description !== undefined) task.description = description
    if (status !== undefined) task.status = status
    if (priority !== undefined) task.priority = priority
    if (dueDate !== undefined) task.dueDate = dueDate || undefined
    if (assignee !== undefined) task.assignee = assignee || undefined

    await task.save()
    const populated = await task.populate(['assignee', 'createdBy'])
    res.json(populated)
  } catch (err) {
    res.status(400).json({ message: err.message || 'Failed to update task.' })
  }
})

// DELETE /api/projects/:projectId/tasks/:taskId
router.delete('/:taskId', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.taskId, project: req.project._id })
    if (!task) return res.status(404).json({ message: 'Task not found.' })
    res.json({ message: 'Task deleted.' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete task.' })
  }
})

export default router
