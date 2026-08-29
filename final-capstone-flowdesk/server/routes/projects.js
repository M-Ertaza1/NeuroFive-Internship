import { Router } from 'express'
import Project from '../models/Project.js'
import Task from '../models/Task.js'
import User from '../models/User.js'
import { requireAuth } from '../middleware/auth.js'
import { requireProjectMember, requireProjectOwner } from '../middleware/projectAccess.js'

const router = Router()
router.use(requireAuth)

// GET /api/projects — list projects the logged-in user belongs to
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find({ 'members.user': req.userId })
      .populate('members.user', 'name email')
      .sort({ createdAt: -1 })
    res.json(projects)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch projects.' })
  }
})

// POST /api/projects — create a project; creator becomes owner
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Project name is required.' })
    }
    const project = await Project.create({
      name: name.trim(),
      description,
      members: [{ user: req.userId, role: 'owner' }],
    })
    const populated = await project.populate('members.user', 'name email')
    res.status(201).json(populated)
  } catch (err) {
    res.status(400).json({ message: err.message || 'Failed to create project.' })
  }
})

// GET /api/projects/:id — project detail (any member)
router.get('/:id', requireProjectMember, async (req, res) => {
  const populated = await req.project.populate('members.user', 'name email')
  res.json(populated)
})

// PUT /api/projects/:id — update name/description (owner only)
router.put('/:id', requireProjectMember, requireProjectOwner, async (req, res) => {
  try {
    const { name, description } = req.body
    if (name !== undefined) {
      if (!name.trim()) return res.status(400).json({ message: 'Project name cannot be empty.' })
      req.project.name = name.trim()
    }
    if (description !== undefined) req.project.description = description
    await req.project.save()
    res.json(req.project)
  } catch (err) {
    res.status(400).json({ message: err.message || 'Failed to update project.' })
  }
})

// DELETE /api/projects/:id — owner only, also deletes its tasks
router.delete('/:id', requireProjectMember, requireProjectOwner, async (req, res) => {
  try {
    await Task.deleteMany({ project: req.project._id })
    await req.project.deleteOne()
    res.json({ message: 'Project deleted.' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete project.' })
  }
})

// --- Members ---

// POST /api/projects/:id/members — invite by email (owner only)
router.post('/:id/members', requireProjectMember, requireProjectOwner, async (req, res) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ message: 'Email is required.' })

    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) return res.status(404).json({ message: 'No user found with that email.' })

    const alreadyMember = req.project.members.some((m) => m.user.toString() === user._id.toString())
    if (alreadyMember) return res.status(409).json({ message: 'That user is already a member.' })

    req.project.members.push({ user: user._id, role: 'member' })
    await req.project.save()
    const populated = await req.project.populate('members.user', 'name email')
    res.status(201).json(populated)
  } catch (err) {
    res.status(400).json({ message: err.message || 'Failed to add member.' })
  }
})

// PUT /api/projects/:id/members/:userId — change role (owner only)
router.put('/:id/members/:userId', requireProjectMember, requireProjectOwner, async (req, res) => {
  try {
    const { role } = req.body
    if (!['owner', 'member'].includes(role)) {
      return res.status(400).json({ message: 'Role must be "owner" or "member".' })
    }
    const membership = req.project.members.find((m) => m.user.toString() === req.params.userId)
    if (!membership) return res.status(404).json({ message: 'Member not found.' })

    membership.role = role
    await req.project.save()
    const populated = await req.project.populate('members.user', 'name email')
    res.json(populated)
  } catch (err) {
    res.status(400).json({ message: err.message || 'Failed to update member role.' })
  }
})

// DELETE /api/projects/:id/members/:userId — remove a member (owner only)
router.delete('/:id/members/:userId', requireProjectMember, requireProjectOwner, async (req, res) => {
  try {
    const owners = req.project.members.filter((m) => m.role === 'owner')
    const target = req.project.members.find((m) => m.user.toString() === req.params.userId)
    if (!target) return res.status(404).json({ message: 'Member not found.' })
    if (target.role === 'owner' && owners.length === 1) {
      return res.status(400).json({ message: 'A project must have at least one owner.' })
    }

    req.project.members = req.project.members.filter((m) => m.user.toString() !== req.params.userId)
    await req.project.save()
    const populated = await req.project.populate('members.user', 'name email')
    res.json(populated)
  } catch (err) {
    res.status(400).json({ message: err.message || 'Failed to remove member.' })
  }
})

export default router
