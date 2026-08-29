process.env.JWT_SECRET = 'test-secret-for-vitest'

import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'
import jwt from 'jsonwebtoken'
import { createApp } from '../app.js'
import Project from '../models/Project.js'

vi.mock('../models/Project.js', () => ({
  default: {
    find: vi.fn(),
    create: vi.fn(),
    findById: vi.fn(),
  },
}))

const app = createApp()
const userId = '507f1f77bcf86cd799439011'
const otherUserId = '507f1f77bcf86cd799439099'
const token = () => jwt.sign({ userId }, process.env.JWT_SECRET)

beforeEach(() => {
  vi.clearAllMocks()
})

describe('GET /api/projects', () => {
  it('requires auth — returns 401 without a token', async () => {
    const res = await request(app).get('/api/projects')
    expect(res.status).toBe(401)
  })

  it('returns 200 and the list of projects the user belongs to (happy path)', async () => {
    const fakeProjects = [{ _id: 'p1', name: 'Website Redesign' }]
    Project.find.mockReturnValue({
      populate: vi.fn().mockReturnValue({ sort: vi.fn().mockResolvedValue(fakeProjects) }),
    })

    const res = await request(app).get('/api/projects').set('Authorization', `Bearer ${token()}`)

    expect(res.status).toBe(200)
    expect(res.body).toEqual(fakeProjects)
  })
})

describe('POST /api/projects', () => {
  it('creates a project with the creator as owner (happy path)', async () => {
    const created = {
      _id: 'p2',
      name: 'New Project',
      members: [{ user: userId, role: 'owner' }],
      populate: vi.fn().mockResolvedValue({ _id: 'p2', name: 'New Project' }),
    }
    Project.create.mockResolvedValue(created)

    const res = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${token()}`)
      .send({ name: 'New Project' })

    expect(res.status).toBe(201)
    expect(Project.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'New Project',
        members: [{ user: userId, role: 'owner' }],
      })
    )
  })

  it('returns 400 when the project name is missing', async () => {
    const res = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${token()}`)
      .send({})

    expect(res.status).toBe(400)
  })
})

describe('Role-based permission enforcement (DELETE /api/projects/:id)', () => {
  it('returns 403 when a non-owner member tries to delete the project', async () => {
    Project.findById.mockResolvedValue({
      _id: 'p3',
      members: [
        { user: { toString: () => userId }, role: 'owner' },
        { user: { toString: () => otherUserId }, role: 'member' },
      ],
    })

    // Authenticated as the MEMBER (not owner) trying to delete
    const memberToken = jwt.sign({ userId: otherUserId }, process.env.JWT_SECRET)

    const res = await request(app)
      .delete('/api/projects/p3')
      .set('Authorization', `Bearer ${memberToken}`)

    expect(res.status).toBe(403)
    expect(res.body.message).toMatch(/owner/i)
  })

  it('returns 404 when trying to access a project that does not exist', async () => {
    Project.findById.mockResolvedValue(null)

    const res = await request(app)
      .get('/api/projects/does-not-exist')
      .set('Authorization', `Bearer ${token()}`)

    expect(res.status).toBe(404)
  })
})
