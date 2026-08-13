import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function signToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ message: 'A valid email is required.' })
    }
    if (!password || password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters.' })
    }

    const existing = await User.findOne({ email: email.toLowerCase() })
    if (existing) {
      return res.status(409).json({ message: 'An account with that email already exists.' })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await User.create({ email, passwordHash })

    const token = signToken(user._id)
    res.status(201).json({ token, user: { id: user._id, email: user.email } })
  } catch (err) {
    res.status(500).json({ message: 'Signup failed. Please try again.' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' })
    }

    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    const match = await user.comparePassword(password)
    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    const token = signToken(user._id)
    res.json({ token, user: { id: user._id, email: user.email } })
  } catch (err) {
    res.status(500).json({ message: 'Login failed. Please try again.' })
  }
})

router.get('/me', requireAuth, async (req, res) => {
  const user = await User.findById(req.userId).select('email')
  if (!user) return res.status(404).json({ message: 'User not found.' })
  res.json({ user: { id: user._id, email: user.email } })
})

export default router
