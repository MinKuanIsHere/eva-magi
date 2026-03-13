import { SELF_DESTRUCT_KEYWORDS } from './constants'
import type { MotionType } from './types'

export function classifyMotion(input: string): MotionType {
  const normalized = input.trim().toLowerCase()

  return SELF_DESTRUCT_KEYWORDS.some((keyword) => normalized.includes(keyword))
    ? 'self_destruct'
    : 'general'
}
