import { describe, expect, it, vi } from 'vitest'

import { simulateVotes } from './simulateVotes'

describe('simulateVotes', () => {
  it('returns the deterministic self-destruct outcome', () => {
    const result = simulateVotes('Initiate self-destruct sequence', 'self_destruct')

    expect(result.motionLabel).toBe('MOTION: SELF-DESTRUCT')
    expect(result.nodes.map((node) => [node.id, node.vote])).toEqual([
      ['MELCHIOR-1', 'APPROVE'],
      ['BALTHASAR-2', 'APPROVE'],
      ['CASPER-3', 'DISSENT'],
    ])
    expect(result.finalDecision).toBe('APPROVED')
  })

  it('returns approved when majority of nodes approve', () => {
    const approveAll = vi.fn(() => 0.1)
    const result = simulateVotes('Authorize launch corridor', 'general', approveAll)

    expect(result.nodes.every((node) => node.vote === 'APPROVE')).toBe(true)
    expect(result.finalDecision).toBe('APPROVED')
  })

  it('returns approved when two out of three approve', () => {
    const randomValues = [0.1, 0.1, 0.95] // APPROVE, APPROVE, DISSENT
    const rng = vi.fn(() => randomValues.shift() ?? 0.1)

    const result = simulateVotes('Authorize launch corridor', 'general', rng)

    expect(result.nodes[2]?.vote).toBe('DISSENT')
    expect(result.finalDecision).toBe('APPROVED')
  })

  it('returns rejected when two out of three dissent', () => {
    const randomValues = [0.95, 0.95, 0.1] // DISSENT, DISSENT, APPROVE
    const rng = vi.fn(() => randomValues.shift() ?? 0.95)

    const result = simulateVotes('Authorize launch corridor', 'general', rng)

    expect(result.nodes[0]?.vote).toBe('DISSENT')
    expect(result.nodes[1]?.vote).toBe('DISSENT')
    expect(result.finalDecision).toBe('REJECTED')
  })
})
