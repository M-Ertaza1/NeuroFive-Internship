import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'
import { createApp } from '../app.js'
import Note from '../models/Note.js'

// The Note model is mocked so these tests never touch a real database —
// that's what keeps them fast, deterministic, and runnable anywhere without
// needing MongoDB credentials in CI. We're testing the route/HTTP layer's
// behavior (status codes, response shape, error handling), not Mongoose
// itself.
vi.mock('../models/Note.js', () => ({
  default: {
    find: vi.fn(),
    create: vi.fn(),
    findByIdAndUpdate: vi.fn(),
    findByIdAndDelete: vi.fn(),
  },
}))

const app = createApp()

beforeEach(() => {
  vi.clearAllMocks()
})

describe('GET /api/notes', () => {
  it('returns 200 and the list of notes on success (happy path)', async () => {
    const fakeNotes = [{ _id: '1', title: 'Test', content: 'Hello' }]
    Note.find.mockReturnValue({ sort: vi.fn().mockResolvedValue(fakeNotes) })

    const res = await request(app).get('/api/notes')

    expect(res.status).toBe(200)
    expect(res.body).toEqual(fakeNotes)
  })

  it('returns 500 with a message when the database query fails', async () => {
    Note.find.mockReturnValue({ sort: vi.fn().mockRejectedValue(new Error('DB down')) })

    const res = await request(app).get('/api/notes')

    expect(res.status).toBe(500)
    expect(res.body.message).toBeTruthy()
  })
})

describe('POST /api/notes', () => {
  it('creates a note and returns 201 on success (happy path)', async () => {
    const created = { _id: '2', title: 'New', content: 'Body' }
    Note.create.mockResolvedValue(created)

    const res = await request(app)
      .post('/api/notes')
      .send({ title: 'New', content: 'Body' })

    expect(res.status).toBe(201)
    expect(res.body).toEqual(created)
    expect(Note.create).toHaveBeenCalledWith({ title: 'New', content: 'Body' })
  })

  it('returns 400 when required fields are missing (validation failure)', async () => {
    Note.create.mockRejectedValue(new Error('Title is required'))

    const res = await request(app).post('/api/notes').send({ content: 'No title' })

    expect(res.status).toBe(400)
    expect(res.body.message).toMatch(/title/i)
  })
})

describe('PUT /api/notes/:id', () => {
  it('updates a note and returns 200 on success (happy path)', async () => {
    const updated = { _id: '3', title: 'Updated', content: 'New body' }
    Note.findByIdAndUpdate.mockResolvedValue(updated)

    const res = await request(app)
      .put('/api/notes/3')
      .send({ title: 'Updated', content: 'New body' })

    expect(res.status).toBe(200)
    expect(res.body).toEqual(updated)
  })

  it('returns 404 when updating a note that does not exist', async () => {
    Note.findByIdAndUpdate.mockResolvedValue(null)

    const res = await request(app)
      .put('/api/notes/does-not-exist')
      .send({ title: 'X', content: 'Y' })

    expect(res.status).toBe(404)
  })
})

describe('DELETE /api/notes/:id', () => {
  it('deletes a note and returns 200 on success (happy path)', async () => {
    Note.findByIdAndDelete.mockResolvedValue({ _id: '4' })

    const res = await request(app).delete('/api/notes/4')

    expect(res.status).toBe(200)
    expect(res.body.message).toMatch(/deleted/i)
  })

  it('returns 404 when deleting a note that does not exist', async () => {
    Note.findByIdAndDelete.mockResolvedValue(null)

    const res = await request(app).delete('/api/notes/does-not-exist')

    expect(res.status).toBe(404)
  })
})
