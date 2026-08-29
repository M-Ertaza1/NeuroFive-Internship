import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import EmptyState from '../components/EmptyState'

describe('EmptyState', () => {
  it('renders the given title and description', () => {
    render(<EmptyState icon="📋" title="No projects yet" description="Create one above." />)
    expect(screen.getByText('No projects yet')).toBeInTheDocument()
    expect(screen.getByText('Create one above.')).toBeInTheDocument()
  })
})
