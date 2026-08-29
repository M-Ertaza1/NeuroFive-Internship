import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TaskCard from '../components/TaskCard'

const task = {
  _id: 't1',
  title: 'Design homepage',
  priority: 'high',
  status: 'todo',
  assignee: { name: 'Jane Doe' },
  dueDate: '2026-12-01T00:00:00.000Z',
}

describe('TaskCard', () => {
  it('renders the task title and priority', () => {
    render(<TaskCard task={task} onClick={vi.fn()} onDragStart={vi.fn()} />)
    expect(screen.getByText('Design homepage')).toBeInTheDocument()
    expect(screen.getByText('high')).toBeInTheDocument()
  })

  it("renders the assignee's first name", () => {
    render(<TaskCard task={task} onClick={vi.fn()} onDragStart={vi.fn()} />)
    expect(screen.getByText('Jane')).toBeInTheDocument()
  })

  it('calls onClick when the card is clicked', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<TaskCard task={task} onClick={onClick} onDragStart={vi.fn()} />)

    await user.click(screen.getByText('Design homepage'))
    expect(onClick).toHaveBeenCalled()
  })

  it('shows a paperclip icon when the task has an attachment', () => {
    const withAttachment = { ...task, attachmentUrl: 'https://example.com/file.pdf' }
    render(<TaskCard task={withAttachment} onClick={vi.fn()} onDragStart={vi.fn()} />)
    expect(screen.getByLabelText('Has attachment')).toBeInTheDocument()
  })
})
