import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import EmptyState from '../components/EmptyState'
import LoadingState from '../components/LoadingState'

describe('EmptyState', () => {
  it('renders the "No notes yet" message', () => {
    render(<EmptyState />)
    expect(screen.getByText(/no notes yet/i)).toBeInTheDocument()
  })
})

describe('LoadingState', () => {
  it('renders 6 skeleton placeholder cards', () => {
    render(<LoadingState />)
    const container = screen.getByTestId('loading-state')
    expect(container.children).toHaveLength(6)
  })
})
