import {
  GENERAL_APPROVAL_PROBABILITIES,
  MOTION_LABELS,
  NODE_DEFINITIONS,
} from './constants'
import type {
  DeliberationResult,
  FinalDecision,
  MotionType,
  NodeResult,
  Vote,
} from './types'

function resolveFinalDecision(nodes: NodeResult[]): FinalDecision {
  const approveCount = nodes.filter((node) => node.vote === 'APPROVE').length
  return approveCount >= 2 ? 'APPROVED' : 'REJECTED'
}

export function simulateVotes(
  input: string,
  motionType: MotionType,
  randomSource: () => number = Math.random,
): DeliberationResult {
  const nodes: NodeResult[] =
    motionType === 'self_destruct'
      ? NODE_DEFINITIONS.map((node) => ({
          ...node,
          vote: (node.id === 'CASPER-3' ? 'DISSENT' : 'APPROVE') as Vote,
        }))
      : NODE_DEFINITIONS.map((node) => ({
          ...node,
          vote: (
            randomSource() <= GENERAL_APPROVAL_PROBABILITIES[node.id]
              ? 'APPROVE'
              : 'DISSENT'
          ) as Vote,
        }))

  return {
    input,
    motionType,
    motionLabel: MOTION_LABELS[motionType],
    nodes,
    finalDecision: resolveFinalDecision(nodes),
  }
}
