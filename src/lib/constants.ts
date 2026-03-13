import type { MotionType, NodeDefinition } from './types'

export const PROCESSING_DELAY_MS = 3000

export const SELF_DESTRUCT_KEYWORDS = [
  'self-destruct',
  'self destruct',
  '自爆',
  '自律自爆',
] as const

export const NODE_DEFINITIONS: NodeDefinition[] = [
  { id: 'MELCHIOR-1', persona: 'Scientist', accent: 'orange' },
  { id: 'BALTHASAR-2', persona: 'Mother', accent: 'amber' },
  { id: 'CASPER-3', persona: 'Woman', accent: 'red' },
]

export const GENERAL_APPROVAL_PROBABILITIES: Record<
  NodeDefinition['id'],
  number
> = {
  'MELCHIOR-1': 0.85,
  'BALTHASAR-2': 0.7,
  'CASPER-3': 0.6,
}

export const MOTION_LABELS: Record<MotionType, string> = {
  self_destruct: 'MOTION: SELF-DESTRUCT',
  general: 'MOTION: GENERAL RESOLUTION',
}
