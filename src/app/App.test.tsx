import { act, fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'

import App from './App'
import { PROCESSING_DELAY_MS } from '../lib/constants'

describe('App', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    window.localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('submits a motion with the button, resolves self-destruct, and writes history', async () => {
    render(<App />)

    fireEvent.change(screen.getByLabelText(/enter motion/i), {
      target: { value: 'Initiate self-destruct sequence' },
    })
    fireEvent.click(screen.getByRole('button', { name: /start|スタート/i }))

    expect(screen.getByDisplayValue('Initiate self-destruct sequence')).toBeDisabled()
    expect(screen.getByText(/deliberation in progress/i)).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(PROCESSING_DELAY_MS)
    })

    expect(screen.getByText('RESULT:')).toBeInTheDocument()
    expect(screen.getByText('REJECTED')).toBeInTheDocument()
    expect(screen.getByText('BALTHASAR-2')).toBeInTheDocument()
    expect(screen.getByText('CASPER-3')).toBeInTheDocument()
    expect(screen.getByText('MELCHIOR-1')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /history/i }))
    expect(screen.getByText(/decision history/i)).toBeInTheDocument()
    expect(screen.getByText(/initiate self-destruct sequence/i)).toBeInTheDocument()
    expect(screen.getByText(/REJECTED/i)).toBeInTheDocument()
  })

  it('submits with enter and resolves a general approved motion', async () => {
    const randomSpy = vi.spyOn(Math, 'random')
    randomSpy.mockReturnValue(0.1)

    render(<App />)

    const input = screen.getByLabelText(/enter motion/i)
    fireEvent.change(input, { target: { value: 'Authorize perimeter lockdown' } })
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })

    act(() => {
      vi.advanceTimersByTime(PROCESSING_DELAY_MS)
    })

    expect(screen.getByText('APPROVED')).toBeInTheDocument()
  })

  it('switches bottom navigation tabs', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: /about/i }))
    expect(screen.getByText(/about magi/i)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /task/i }))
    expect(
      screen.getByPlaceholderText(/enter motion \(e\.g\. self-destruct\)/i),
    ).toBeInTheDocument()
  })

  it('clears history records', () => {
    render(<App />)

    fireEvent.change(screen.getByLabelText(/enter motion/i), {
      target: { value: 'Initiate self-destruct sequence' },
    })
    fireEvent.click(screen.getByRole('button', { name: /start|スタート/i }))

    act(() => {
      vi.advanceTimersByTime(PROCESSING_DELAY_MS)
    })

    fireEvent.click(screen.getByRole('button', { name: /history/i }))
    expect(screen.getByText(/initiate self-destruct sequence/i)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /clear/i }))
    expect(screen.getByText(/no decision records yet/i)).toBeInTheDocument()
  })

  it('prevents duplicate submit from rapid start clicks', () => {
    render(<App />)

    fireEvent.change(screen.getByLabelText(/enter motion/i), {
      target: { value: 'rapid click test' },
    })

    const startButton = screen.getByRole('button', { name: /start|スタート/i })
    fireEvent.click(startButton)
    fireEvent.click(startButton)

    act(() => {
      vi.advanceTimersByTime(PROCESSING_DELAY_MS)
    })

    expect(screen.getByRole('button', { name: /history\(1\)/i })).toBeInTheDocument()
  })

  it('ignores malformed history payload from localStorage', () => {
    window.localStorage.setItem(
      'magi.history.v1',
      JSON.stringify([{ invalid: true }, { id: 'bad-shape' }]),
    )

    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /history/i }))

    expect(screen.getByText(/no decision records yet/i)).toBeInTheDocument()
  })
})
