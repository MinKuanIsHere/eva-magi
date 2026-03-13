import { describe, expect, it } from 'vitest'

import { classifyMotion } from './classifyMotion'

describe('classifyMotion', () => {
  it('detects self-destruct variants in English', () => {
    expect(classifyMotion('Initiate self-destruct sequence')).toBe('self_destruct')
    expect(classifyMotion('begin self destruct now')).toBe('self_destruct')
  })

  it('detects self-destruct variants in Chinese', () => {
    expect(classifyMotion('啟動自爆程序')).toBe('self_destruct')
    expect(classifyMotion('提訴: 自律自爆')).toBe('self_destruct')
  })

  it('classifies non matching input as general motion', () => {
    expect(classifyMotion('Authorize power reroute to defense layer')).toBe('general')
  })
})
