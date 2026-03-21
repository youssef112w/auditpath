// src/hooks/useTimer.js
// ─────────────────────────────────────────────────────────────────────────────
// Custom hook: يحتوي كل state وlogic الـ timer
// الـ Dashboard مش بيعرف أي حاجة عن الـ timer إلا اللي بيرجعه الـ hook ده
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect, useRef, useCallback } from 'react'
import api from '../api'

// ── localStorage keys ────────────────────────────────────────────────────────
const TIMER_KEY   = 'ap_timerStart'
const RUNNING_KEY = 'ap_timerRunning'
const PAUSED_KEY  = 'ap_timerPaused'
const NOTE_KEY    = 'ap_timerNote'
const LAPS_KEY    = 'ap_timerLaps'

// ── Helpers ──────────────────────────────────────────────────────────────────
export function fmt(ms) {
  const s   = Math.floor(Math.abs(ms) / 1000)
  const h   = Math.floor(s / 3600)
  const m   = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
}

export function fmtShort(ms) {
  const s = Math.floor(ms / 1000)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  if (Math.floor(s / 3600) > 0) return fmt(ms)
  return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
}

function clearStorage() {
  ;[TIMER_KEY, RUNNING_KEY, PAUSED_KEY, NOTE_KEY, LAPS_KEY].forEach(k =>
    localStorage.removeItem(k)
  )
}

// ─────────────────────────────────────────────────────────────────────────────
export function useTimer({ notify, onSessionSaved }) {
  const [running,   setRunning]   = useState(false)
  const [paused,    setPaused]    = useState(false)
  const [elapsed,   setElapsed]   = useState(0)
  const [startTime, setStartTime] = useState(null)
  const [pausedAt,  setPausedAt]  = useState(0)
  const [note,      setNote]      = useState('')
  const [laps,      setLaps]      = useState([])
  const [intensity, setIntensity] = useState('medium')
  const timerRef = useRef(null)

  // ── Restore from localStorage on mount ───────────────────────────────────
  useEffect(() => {
    const savedRunning = localStorage.getItem(RUNNING_KEY)
    const savedStart   = localStorage.getItem(TIMER_KEY)
    const savedPaused  = localStorage.getItem(PAUSED_KEY)
    const savedNote    = localStorage.getItem(NOTE_KEY)
    const savedLaps    = localStorage.getItem(LAPS_KEY)

    if (savedNote) setNote(savedNote)
    if (savedLaps) try { setLaps(JSON.parse(savedLaps)) } catch {}

    if (savedRunning === 'paused' && savedPaused) {
      const ms = parseInt(savedPaused)
      setPaused(true)
      setRunning(true)
      setPausedAt(ms)
      setElapsed(ms)
    } else if (savedRunning === 'true' && savedStart) {
      const t             = parseInt(savedStart)
      const alreadyPaused = parseInt(savedPaused || '0')
      setStartTime(t)
      setPausedAt(alreadyPaused)
      setElapsed(Date.now() - t + alreadyPaused)
      setRunning(true)
      setPaused(false)
    }
  }, [])

  // ── Tick — only this hook re-renders every 200ms, not the whole Dashboard ─
  useEffect(() => {
    if (running && !paused && startTime) {
      timerRef.current = setInterval(() => {
        setElapsed(Date.now() - startTime + pausedAt)
      }, 200)
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [running, paused, startTime, pausedAt])

  // ── Persist note live ─────────────────────────────────────────────────────
  useEffect(() => {
    if (running) localStorage.setItem(NOTE_KEY, note)
  }, [note, running])

  // ── Actions ───────────────────────────────────────────────────────────────
  const startSession = useCallback(() => {
    const t = Date.now()
    setStartTime(t); setElapsed(0); setPausedAt(0)
    setRunning(true); setPaused(false); setLaps([])
    localStorage.setItem(TIMER_KEY,   String(t))
    localStorage.setItem(RUNNING_KEY, 'true')
    localStorage.setItem(PAUSED_KEY,  '0')
    localStorage.setItem(NOTE_KEY,    '')
    localStorage.setItem(LAPS_KEY,    '[]')
    notify('بدأت الجلسة! 🚀')
  }, [notify])

  const pauseSession = useCallback(() => {
    setPaused(true)
    // snapshot elapsed at pause moment
    setElapsed(prev => {
      const snap = prev
      setPausedAt(snap)
      localStorage.setItem(RUNNING_KEY, 'paused')
      localStorage.setItem(PAUSED_KEY,  String(snap))
      return snap
    })
    notify('الجلسة متوقفة مؤقتاً ⏸')
  }, [notify])

  const resumeSession = useCallback(() => {
    const t = Date.now()
    setStartTime(t)
    setPaused(false)
    localStorage.setItem(TIMER_KEY,   String(t))
    localStorage.setItem(RUNNING_KEY, 'true')
    notify('استكملت الجلسة ▶')
  }, [notify])

  const addLap = useCallback(() => {
    setLaps(prev => {
      const prevTotal = prev.length > 0 ? prev[prev.length - 1].total : 0
      const newLap    = { n: prev.length + 1, total: elapsed, split: elapsed - prevTotal }
      const updated   = [...prev, newLap]
      localStorage.setItem(LAPS_KEY, JSON.stringify(updated))
      return updated
    })
  }, [elapsed])

  const endSession = useCallback(async () => {
    if (!running) return
    clearInterval(timerRef.current)
    setRunning(false)
    setPaused(false)

    const finalElapsed = elapsed
    const hours        = parseFloat((finalElapsed / 3600000).toFixed(2))
    const date         = new Date().toISOString().split('T')[0]
    const capturedNote = note
    const capturedStart = startTime

    clearStorage()
    setElapsed(0); setPausedAt(0); setNote(''); setLaps([])

    try {
      await api.post('/sessions', {
        date,
        hours,
        note: capturedNote,
        startedAt: new Date(capturedStart).toISOString(),
        endedAt:   new Date().toISOString(),
      })
      // تبلّغ الـ Dashboard إن جلسة اتحفظت — هو يعمل loadStats
      onSessionSaved()
      notify(`جلسة محفوظة: ${fmt(finalElapsed)} ✓`)
    } catch {
      notify('خطأ في حفظ الجلسة ❌')
    }
  }, [running, elapsed, note, startTime, notify, onSessionSaved])

  const cancelSession = useCallback(() => {
    clearInterval(timerRef.current)
    setRunning(false); setPaused(false)
    setElapsed(0); setPausedAt(0); setNote(''); setLaps([])
    clearStorage()
    notify('تم إلغاء الجلسة')
  }, [notify])

  // ── Derived (computed once here, not in render) ───────────────────────────
  const elapsedHours    = elapsed / 3600000
  const intensityColor  = intensity === 'high'
    ? 'var(--accent3)'
    : intensity === 'low'
      ? 'var(--accent2)'
      : 'var(--accent)'

  return {
    // state
    running, paused, elapsed, startTime, note, laps, intensity,
    elapsedHours, intensityColor,
    // setters
    setNote, setIntensity,
    // actions
    startSession, pauseSession, resumeSession, addLap, endSession, cancelSession,
  }
}