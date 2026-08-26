import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NoteForm from '../components/NoteForm'

describe('NoteForm', () => {
  it('renders title input, content textarea, and an "Add note" button', () => {
    render(<NoteForm onSubmit={vi.fn()} editingNote={null} onCancelEdit={vi.fn()} saving={false} />)

    expect(screen.getByLabelText('Title')).toBeInTheDocument()
    expect(screen.getByLabelText('Content')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /add note/i })).toBeInTheDocument()
  })

  it('shows a validation error and does NOT call onSubmit when fields are empty', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<NoteForm onSubmit={onSubmit} editingNote={null} onCancelEdit={vi.fn()} saving={false} />)

    await user.click(screen.getByRole('button', { name: /add note/i }))

    expect(screen.getByText(/both title and content are required/i)).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('calls onSubmit with trimmed title/content when the form is valid', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<NoteForm onSubmit={onSubmit} editingNote={null} onCancelEdit={vi.fn()} saving={false} />)

    await user.type(screen.getByLabelText('Title'), '  My Title  ')
    await user.type(screen.getByLabelText('Content'), '  My content  ')
    await user.click(screen.getByRole('button', { name: /add note/i }))

    expect(onSubmit).toHaveBeenCalledWith({ title: 'My Title', content: 'My content' })
  })

  it('pre-fills the form and shows "Update note" when editing an existing note', () => {
    const editingNote = { _id: '1', title: 'Existing', content: 'Existing body' }
    render(<NoteForm onSubmit={vi.fn()} editingNote={editingNote} onCancelEdit={vi.fn()} saving={false} />)

    expect(screen.getByLabelText('Title')).toHaveValue('Existing')
    expect(screen.getByLabelText('Content')).toHaveValue('Existing body')
    expect(screen.getByRole('button', { name: /update note/i })).toBeInTheDocument()
  })

  it('disables the submit button and shows "Saving…" while saving is true', () => {
    render(<NoteForm onSubmit={vi.fn()} editingNote={null} onCancelEdit={vi.fn()} saving={true} />)

    const button = screen.getByRole('button', { name: /saving/i })
    expect(button).toBeDisabled()
  })
})
