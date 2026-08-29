import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AuthForm from '../components/AuthForm'

describe('AuthForm (signup mode)', () => {
  it('renders name, email, and password fields', () => {
    render(<AuthForm mode="signup" onSubmit={vi.fn()} />)
    expect(screen.getByLabelText('Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
  })

  it('shows a validation error and does not call onSubmit for a short password', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<AuthForm mode="signup" onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Name'), 'Jane Doe')
    await user.type(screen.getByLabelText('Email'), 'jane@example.com')
    await user.type(screen.getByLabelText('Password'), 'short')
    await user.click(screen.getByRole('button', { name: /sign up/i }))

    expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('shows a validation error for an invalid email', async () => {
    const user = userEvent.setup()
    render(<AuthForm mode="signup" onSubmit={vi.fn()} />)

    await user.type(screen.getByLabelText('Name'), 'Jane Doe')
    await user.type(screen.getByLabelText('Email'), 'not-an-email')
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.click(screen.getByRole('button', { name: /sign up/i }))

    expect(screen.getByText(/valid email/i)).toBeInTheDocument()
  })

  it('calls onSubmit with the entered values when valid', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue()
    render(<AuthForm mode="signup" onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Name'), 'Jane Doe')
    await user.type(screen.getByLabelText('Email'), 'jane@example.com')
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.click(screen.getByRole('button', { name: /sign up/i }))

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'password123',
    })
  })
})

describe('AuthForm (login mode)', () => {
  it('does not show a Name field in login mode', () => {
    render(<AuthForm mode="login" onSubmit={vi.fn()} />)
    expect(screen.queryByLabelText('Name')).not.toBeInTheDocument()
  })
})
