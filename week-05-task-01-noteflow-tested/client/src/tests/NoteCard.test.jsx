import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NoteCard from '../components/NoteCard'

const sampleNote = {
  _id: 'abc123',
  title: 'Grocery list',
  content: 'Milk, eggs, bread',
  createdAt: '2026-01-15T00:00:00.000Z',
}

describe('NoteCard', () => {
  it('renders the note title and content', () => {
    render(<NoteCard note={sampleNote} onEdit={vi.fn()} onDelete={vi.fn()} isDeleting={false} />)

    expect(screen.getByText('Grocery list')).toBeInTheDocument()
    expect(screen.getByText('Milk, eggs, bread')).toBeInTheDocument()
  })

  it('calls onEdit with the note when "Edit" is clicked', async () => {
    const user = userEvent.setup()
    const onEdit = vi.fn()
    render(<NoteCard note={sampleNote} onEdit={onEdit} onDelete={vi.fn()} isDeleting={false} />)

    await user.click(screen.getByRole('button', { name: /edit/i }))

    expect(onEdit).toHaveBeenCalledWith(sampleNote)
  })

  it('calls onDelete with the note id when "Delete" is clicked', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()
    render(<NoteCard note={sampleNote} onEdit={vi.fn()} onDelete={onDelete} isDeleting={false} />)

    await user.click(screen.getByRole('button', { name: /delete/i }))

    expect(onDelete).toHaveBeenCalledWith('abc123')
  })

  it('shows "Deleting…" and disables both buttons when isDeleting is true', () => {
    render(<NoteCard note={sampleNote} onEdit={vi.fn()} onDelete={vi.fn()} isDeleting={true} />)

    expect(screen.getByRole('button', { name: /deleting/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /edit/i })).toBeDisabled()
  })
})
