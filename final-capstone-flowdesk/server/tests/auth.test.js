import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'

process.env.JWT_SECRET = 'test-secret-for-vitest'

import { createApp } from '../app.js'
import User from '../models/User.js'

vi.mock('../models/User.js', () => ({
  default: {
    findOne: vi.fn(),
    create: vi.fn(),
    findById: vi.fn(),
  },
}))

vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn().mockResolvedValue('hashed-password'),
    compare: vi.fn(),
  },
}))

const app = createApp()

beforeEach(() => {
  vi.clearAllMocks()
})

describe('POST /api/auth/signup', () => {
  it('creates a user and returns 201 with a token (happy path)', async () => {
    User.findOne.mockResolvedValue(null)
    User.create.mockResolvedValue({ _id: '1', name: 'Jane', email: 'jane@example.com' })

    const res = await request(app)
      .post('/api/auth/signup')
      .send({ name: 'Jane', email: 'jane@example.com', password: 'password123' })

    expect(res.status).toBe(201)
    expect(res.body.token).toBeTruthy()
    expect(res.body.user.email).toBe('jane@example.com')
  })

  it('returns 409 when the email is already registered', async () => {
    User.findOne.mockResolvedValue({ _id: 'existing' })

    const res = await request(app)
      .post('/api/auth/signup')
      .send({ name: 'Jane', email: 'jane@example.com', password: 'password123' })

    expect(res.status).toBe(409)
  })

  it('returns 400 when the password is too short', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ name: 'Jane', email: 'jane@example.com', password: 'short' })

    expect(res.status).toBe(400)
    expect(res.body.message).toMatch(/password/i)
  })
})

describe('POST /api/auth/login', () => {
  it('returns a token on valid credentials (happy path)', async () => {
    const bcrypt = (await import('bcryptjs')).default
    bcrypt.compare.mockResolvedValue(true)
    User.findOne.mockResolvedValue({
      _id: '1',
      name: 'Jane',
      email: 'jane@example.com',
      comparePassword: () => Promise.resolve(true),
    })

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'jane@example.com', password: 'password123' })

    expect(res.status).toBe(200)
    expect(res.body.token).toBeTruthy()
  })

  it('returns 401 on wrong password', async () => {
    User.findOne.mockResolvedValue({
      _id: '1',
      comparePassword: () => Promise.resolve(false),
    })

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'jane@example.com', password: 'wrongpassword' })

    expect(res.status).toBe(401)
  })

  it('returns 401 when the email does not exist', async () => {
    User.findOne.mockResolvedValue(null)

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'jane@example.com', password: 'password123' })

    expect(res.status).toBe(401)
  })
})
