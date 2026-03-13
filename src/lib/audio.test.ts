import { describe, expect, it } from 'vitest'

import { createAudioController } from './audio'

describe('createAudioController', () => {
  it('returns safe callable methods', async () => {
    const controller = createAudioController()

    controller.prime()
    await expect(controller.playProcessing()).resolves.toBeUndefined()
    controller.stopProcessing()
    controller.stopAll()
    await expect(controller.playDecision(true)).resolves.toBeUndefined()
  })
})
