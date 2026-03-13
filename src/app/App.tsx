import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

import { DecorativeOverlay } from '../components/DecorativeOverlay'
import { PROCESSING_DELAY_MS } from '../lib/constants'
import { createAudioController } from '../lib/audio'
import { classifyMotion } from '../lib/classifyMotion'
import { simulateVotes } from '../lib/simulateVotes'
import type {
  DeliberationResult,
  NodeResult,
  UiPhase,
  Vote,
} from '../lib/types'

type TabId = 'about' | 'task' | 'history'
type NodeId = NodeResult['id']
type LiveVotes = Record<NodeId, Vote>

interface HistoryItem {
  id: number
  createdAt: string
  decisionCode: string
  result: DeliberationResult
}

const TABS: Array<{ id: TabId; label: string }> = [
  { id: 'about', label: 'About' },
  { id: 'task', label: 'Task' },
  { id: 'history', label: 'History' },
]
const HISTORY_STORAGE_KEY = 'magi.history.v1'

const VOTE_LABEL: Record<Vote, string> = {
  APPROVE: '承認',
  DISSENT: '否決',
}
const INITIAL_LIVE_VOTES: LiveVotes = {
  'BALTHASAR-2': 'APPROVE',
  'CASPER-3': 'APPROVE',
  'MELCHIOR-1': 'APPROVE',
}

function getNodeVote(result: DeliberationResult | null, nodeId: NodeResult['id']) {
  return result?.nodes.find((node) => node.id === nodeId)?.vote
}

function formatEnglishTime(date: Date) {
  return date.toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}

function createDecisionCode() {
  const rand = Math.floor(Math.random() * 0xffff)
    .toString(16)
    .toUpperCase()
    .padStart(4, '0')
  return `MAGI-${Date.now().toString().slice(-6)}-${rand}`
}

function createCheckpoint() {
  return `CP-${Math.floor(Math.random() * 900 + 100)}`
}

function loadInitialHistory(): HistoryItem[] {
  try {
    const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY)
    if (!raw) return []

    const parsed = JSON.parse(raw) as HistoryItem[]
    if (!Array.isArray(parsed)) return []
    return parsed.slice(0, 30)
  } catch {
    return []
  }
}

function App() {
  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] = useState<TabId>('task')
  const [phase, setPhase] = useState<UiPhase>('idle')
  const [result, setResult] = useState<DeliberationResult | null>(null)
  const [pendingResult, setPendingResult] = useState<DeliberationResult | null>(null)
  const [decisionCode, setDecisionCode] = useState('MAGI-BOOT-0000')
  const [checkpointCode, setCheckpointCode] = useState('CP-000')
  const [decisionTimestamp, setDecisionTimestamp] = useState(
    formatEnglishTime(new Date()),
  )
  const [liveVotes, setLiveVotes] = useState<LiveVotes>(INITIAL_LIVE_VOTES)
  const [history, setHistory] = useState<HistoryItem[]>(loadInitialHistory)
  const timeoutRef = useRef<number | null>(null)
  const flickerRef = useRef<number | null>(null)
  const audioRef = useRef(createAudioController())

  useEffect(() => {
    const audioController = audioRef.current

    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current)
      }
      if (flickerRef.current !== null) {
        window.clearInterval(flickerRef.current)
      }
      audioController.stopProcessing()
    }
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history))
    } catch {
      // ignore storage failures in private mode / restricted environments
    }
  }, [history])

  const handleSubmit = () => {
    const trimmed = query.trim()
    if (!trimmed || phase === 'processing') return

    const motionType = classifyMotion(trimmed)
    const simulatedResult = simulateVotes(trimmed, motionType)
    const now = new Date()
    const nextDecisionCode = createDecisionCode()
    const nextCheckpoint = createCheckpoint()

    audioRef.current.prime()
    void audioRef.current.playProcessing().catch(() => undefined)

    setPhase('processing')
    setPendingResult(simulatedResult)
    setResult(null)
    setActiveTab('task')
    setDecisionTimestamp(formatEnglishTime(now))
    setDecisionCode(nextDecisionCode)
    setCheckpointCode(nextCheckpoint)
    setLiveVotes(INITIAL_LIVE_VOTES)

    flickerRef.current = window.setInterval(() => {
      setLiveVotes({
        'BALTHASAR-2': Math.random() > 0.5 ? 'APPROVE' : 'DISSENT',
        'CASPER-3': Math.random() > 0.5 ? 'APPROVE' : 'DISSENT',
        'MELCHIOR-1': Math.random() > 0.5 ? 'APPROVE' : 'DISSENT',
      })
    }, 130)

    timeoutRef.current = window.setTimeout(() => {
      const nextResult = simulatedResult

      audioRef.current.stopProcessing()
      void audioRef.current
        .playDecision(nextResult.finalDecision === 'APPROVED')
        .catch(() => undefined)

      setPendingResult(null)
      setResult(nextResult)
      setPhase('resolved')
      setLiveVotes({
        'BALTHASAR-2': getNodeVote(nextResult, 'BALTHASAR-2') ?? 'DISSENT',
        'CASPER-3': getNodeVote(nextResult, 'CASPER-3') ?? 'DISSENT',
        'MELCHIOR-1': getNodeVote(nextResult, 'MELCHIOR-1') ?? 'DISSENT',
      })
      if (flickerRef.current !== null) {
        window.clearInterval(flickerRef.current)
        flickerRef.current = null
      }
      setHistory((previous) => [
        {
          id: Date.now(),
          createdAt: new Date().toISOString(),
          decisionCode: nextDecisionCode,
          result: nextResult,
        },
        ...previous.slice(0, 29),
      ])
    }, PROCESSING_DELAY_MS)
  }

  const displayResult = phase === 'processing' ? pendingResult : result
  const displayVote = (nodeId: NodeId) => {
    if (phase === 'processing') return liveVotes[nodeId]
    return getNodeVote(displayResult, nodeId) ?? 'APPROVE'
  }

  const clearHistory = () => {
    setHistory([])
  }

  return (
    <main className="relative h-svh overflow-hidden bg-bg text-white">
      <DecorativeOverlay />
      <div className="relative mx-auto h-svh w-full max-w-[430px] overflow-hidden border-x border-line/20 pb-16">
        <section className="relative z-10 px-4 pt-3">
          <div className="eva-frame eva-cut overflow-hidden">
            <p className="border-b border-line/25 px-3 py-2 font-display text-[0.65rem] uppercase tracking-[0.35em] text-line2">
              DIRECT LINK CONNECTION: MAGI_01
            </p>
            <p className="px-3 py-2 font-display text-sm uppercase tracking-[0.25em] text-line2">
              ACCESS MODE: SUPERUSER
            </p>
          </div>
        </section>

        {activeTab === 'about' ? (
          <section className="relative z-10 px-4 pt-5">
            <div className="eva-frame eva-cut p-4">
              <h2 className="font-display text-lg uppercase tracking-[0.24em] text-line2">
                About MAGI
              </h2>
              <p className="mt-3 text-sm leading-6 text-white/85">
                This project is a fan tribute to Neon Genesis Evangelion. It is
                non-commercial and shared only for personal creative use.
              </p>
              <p className="mt-3 text-sm leading-6 text-white/85">
                MELCHIOR-1 focuses on logic and systems, BALTHASAR-2 on ethics
                and protection, and CASPER-3 on instinct and self-preservation.
                The final MAGI result is decided by the combined votes of all
                three personas.
              </p>
            </div>
          </section>
        ) : null}

        {activeTab === 'task' ? (
          <section className="relative z-10 px-3 pt-2">
            <div className="eva-frame eva-cut p-2">
              <p className="font-display text-[0.72rem] uppercase tracking-[0.36em] text-line2">
                RESULT OF THE DELIBERATION
              </p>
              <p className="mt-1 font-display text-base uppercase tracking-[0.2em] text-line2">
                {displayResult?.motionLabel ?? 'MOTION: STANDBY'}
              </p>
            </div>

            <div className="mt-2 task-grid text-[0.58rem] uppercase leading-3 tracking-[0.1em] text-line2/95">
              <div className="task-side">
                <p>TIME: {decisionTimestamp}</p>
                <p>DECISION CODE:</p>
                <p>{decisionCode}</p>
                <p>CHECKPOINT:</p>
                <p>{checkpointCode}</p>
              </div>
              <motion.article
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className={`hex-node hex-node-top ${phase === 'processing' ? `flash-${displayVote('BALTHASAR-2').toLowerCase()}` : displayVote('BALTHASAR-2') === 'APPROVE' ? 'steady-approve' : 'steady-dissent'}`}
              >
                <p className="hex-title">BALTHASAR-2</p>
                {phase !== 'idle' ? <p className="hex-vote">{VOTE_LABEL[displayVote('BALTHASAR-2')]}</p> : null}
              </motion.article>
              <div className="task-side task-side-emphasis text-right">
                <p>RESULT:</p>
                <p>
                  {phase === 'processing'
                    ? 'PROCESSING'
                    : displayResult?.finalDecision ?? 'STANDBY'}
                </p>
                <p>MOTION:</p>
                <p>{displayResult?.motionType ?? 'N/A'}</p>
                <p>LINK: L431-BASIC</p>
              </div>
            </div>

            <div className="hex-connector mt-1">
              <div className="hex-core">MAGI</div>
            </div>

            <div className="mt-1 grid grid-cols-2 gap-2">
                <motion.article
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                className={`hex-node hex-node-bottom ${phase === 'processing' ? `flash-${displayVote('CASPER-3').toLowerCase()}` : displayVote('CASPER-3') === 'APPROVE' ? 'steady-approve' : 'steady-dissent'}`}
                >
                  <p className="hex-vote">{phase === 'idle' ? '' : VOTE_LABEL[displayVote('CASPER-3')]}</p>
                  <p className="hex-title">CASPER-3</p>
                </motion.article>

                <motion.article
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                className={`hex-node hex-node-bottom ${phase === 'processing' ? `flash-${displayVote('MELCHIOR-1').toLowerCase()}` : displayVote('MELCHIOR-1') === 'APPROVE' ? 'steady-approve' : 'steady-dissent'}`}
                >
                  <p className="hex-vote">{phase === 'idle' ? '' : VOTE_LABEL[displayVote('MELCHIOR-1')]}</p>
                  <p className="hex-title">MELCHIOR-1</p>
                </motion.article>
            </div>

            <div className="mt-3 eva-frame eva-cut p-2">
              <label className="sr-only" htmlFor="motion-input">
                Enter motion
              </label>
              <input
                id="motion-input"
                value={query}
                disabled={phase === 'processing'}
                maxLength={50}
                placeholder="ENTER MOTION (e.g. SELF-DESTRUCT)"
                className="w-full border border-line/50 bg-black/65 px-2 py-2 font-body text-sm tracking-[0.08em] text-white outline-none placeholder:text-mute/55 focus:border-line"
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    handleSubmit()
                  }
                }}
              />
              <button
                type="button"
                disabled={phase === 'processing'}
                className="start-button mt-2 w-full border border-line py-2 font-display text-sm uppercase tracking-[0.26em] disabled:opacity-55"
                onClick={handleSubmit}
              >
                {phase === 'processing' ? 'DELIBERATION IN PROGRESS' : '|| スタート ||'}
              </button>
            </div>
          </section>
        ) : null}

        {activeTab === 'history' ? (
          <section className="relative z-10 h-[calc(100svh-140px)] overflow-y-auto px-4 pb-3 pt-3">
            <div className="eva-frame eva-cut p-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg uppercase tracking-[0.24em] text-line2">
                  Decision History
                </h2>
                <button
                  type="button"
                  className="border border-line/45 px-2 py-1 font-display text-[0.62rem] uppercase tracking-[0.24em] text-line2 disabled:opacity-40"
                  disabled={history.length === 0}
                  onClick={clearHistory}
                >
                  Clear
                </button>
              </div>
              {history.length === 0 ? (
                <p className="mt-3 text-sm text-mute">No decision records yet.</p>
              ) : (
                <ul className="mt-3 space-y-3">
                  {history.map((entry) => (
                    <li key={entry.id} className="border border-line/30 bg-black/50 p-3">
                      <p className="font-display text-xs uppercase tracking-[0.28em] text-line2">
                        {entry.result.motionLabel}
                      </p>
                      <p className="mt-1 text-xs text-mute">
                        {formatEnglishTime(new Date(entry.createdAt))}
                      </p>
                      <p className="mt-1 text-xs text-line2/90">{entry.decisionCode}</p>
                      <p className="mt-2 text-sm text-white/90">{entry.result.input}</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.18em] text-white/85">
                        {entry.result.nodes
                          .map((node) => `${node.id}: ${node.vote}`)
                          .join(' / ')}
                      </p>
                      <p
                        className={`mt-2 text-xs font-display uppercase tracking-[0.24em] ${
                          entry.result.finalDecision === 'APPROVED'
                            ? 'text-approve'
                            : 'text-alert'
                        }`}
                      >
                        FINAL: {entry.result.finalDecision}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        ) : null}

        <nav
          aria-label="Primary navigation"
          className="eva-frame fixed inset-x-0 bottom-0 z-20 mx-auto flex w-full max-w-[430px] items-center justify-around border-t border-line/35 bg-panel2/95 px-2 py-2"
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`min-w-[96px] border px-3 py-2 font-display text-xs uppercase tracking-[0.2em] ${
                activeTab === tab.id
                  ? 'border-line bg-black/65 text-line2'
                  : 'border-transparent text-mute'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.id === 'history' ? `${tab.label}(${history.length})` : tab.label}
            </button>
          ))}
        </nav>
      </div>
    </main>
  )
}

export default App
