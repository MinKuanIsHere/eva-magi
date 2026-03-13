export type MotionType = 'self_destruct' | 'general'

export type Vote = 'APPROVE' | 'DISSENT'

export type FinalDecision = 'APPROVED' | 'REJECTED'

export type UiPhase = 'idle' | 'processing' | 'resolved'

export interface NodeDefinition {
  id: 'MELCHIOR-1' | 'BALTHASAR-2' | 'CASPER-3'
  persona: 'Scientist' | 'Mother' | 'Woman'
  accent: 'orange' | 'amber' | 'red'
}

export interface NodeResult extends NodeDefinition {
  vote: Vote
}

export interface DeliberationResult {
  input: string
  motionType: MotionType
  motionLabel: string
  nodes: NodeResult[]
  finalDecision: FinalDecision
}
