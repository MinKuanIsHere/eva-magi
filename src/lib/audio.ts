export interface AudioController {
  prime: () => void
  playProcessing: () => Promise<void>
  stopProcessing: () => void
  playDecision: (approved: boolean) => Promise<void>
}

const SOUND_PATHS = {
  processing: '/sounds/processing.mp3',
  rejected: '/sounds/rejected.mp3',
  approved: '/sounds/approved.mp3',
} as const

async function safePlay(audio: HTMLAudioElement): Promise<void> {
  audio.currentTime = 0
  const maybePromise = audio.play()
  if (maybePromise && typeof maybePromise.then === 'function') {
    await maybePromise
  }
}

export function createAudioController(): AudioController {
  if (typeof window === 'undefined' || typeof window.Audio === 'undefined') {
    return {
      prime: () => undefined,
      playProcessing: async () => undefined,
      stopProcessing: () => undefined,
      playDecision: async () => undefined,
    }
  }

  if (window.navigator.userAgent.toLowerCase().includes('jsdom')) {
    return {
      prime: () => undefined,
      playProcessing: async () => undefined,
      stopProcessing: () => undefined,
      playDecision: async () => undefined,
    }
  }

  const processing = new window.Audio(SOUND_PATHS.processing)
  const rejected = new window.Audio(SOUND_PATHS.rejected)
  const approvedSound = new window.Audio(SOUND_PATHS.approved)

  processing.loop = true
  processing.preload = 'auto'
  rejected.preload = 'auto'
  approvedSound.preload = 'auto'

  return {
    prime: () => {
      processing.load()
      rejected.load()
      approvedSound.load()
    },
    playProcessing: async () => {
      try {
        await safePlay(processing)
      } catch {
        // ignore autoplay blocking
      }
    },
    stopProcessing: () => {
      processing.pause()
      processing.currentTime = 0
    },
    playDecision: async (approved: boolean) => {
      try {
        if (approved) {
          await safePlay(approvedSound)
        } else {
          await safePlay(rejected)
        }
      } catch {
        // ignore autoplay blocking
      }
    },
  }
}
