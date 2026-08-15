import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useStorage } from '../hooks/useStorage'
import { useTime } from '../hooks/useTime'
import { useWeather } from '../hooks/useWeather'
import {
  STORAGE_KEY, DEFAULT_STATE, STAT_DRIFT_INTERVAL_MS,
  IGNORE_THRESHOLD_MS, MESSAGES,
} from '../utils/constants'
import { clamp } from '../utils/helpers'

const PandaContext = createContext(null)

export function PandaProvider({ children }) {
  const [state, setState] = useStorage(STORAGE_KEY, DEFAULT_STATE)
  const [message, setMessage] = useState(null)
  const [bursts, setBursts] = useState([])
  const [blushing, setBlushing] = useState(false)
  const burstId = useRef(0)
  const lastInteraction = useRef(Date.now())
  const messageTimeout = useRef(null)

  useTime(setState)
  useWeather(setState)

  // Passive stat drift — hunger/energy fall slowly while awake, energy recovers while asleep
  useEffect(() => {
    const timer = setInterval(() => {
      setState((s) => s.asleep
        ? { ...s, energy: clamp(s.energy + 3) }
        : { ...s, hunger: clamp(s.hunger - 1), energy: clamp(s.energy - 1) })
    }, STAT_DRIFT_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [setState])

  // If ignored too long, Mochi gets a little upset (small joy dip + message)
  useEffect(() => {
    const timer = setInterval(() => {
      if (!state.asleep && Date.now() - lastInteraction.current > IGNORE_THRESHOLD_MS) {
        setState((s) => ({ ...s, joy: clamp(s.joy - 8) }))
        showMessage(MESSAGES.upset)
        lastInteraction.current = Date.now() // reset so it doesn't spam
      }
    }, IGNORE_THRESHOLD_MS)
    return () => clearInterval(timer)
  }, [state.asleep, setState])

  function showMessage(text, duration = 2200) {
    clearTimeout(messageTimeout.current)
    setMessage(text)
    messageTimeout.current = setTimeout(() => setMessage(null), duration)
  }

  function spawnBurst(x, y, emoji, count = 1) {
    const id = burstId.current++
    setBursts((b) => [...b, { id, x, y, emoji, count }])
    setTimeout(() => setBursts((b) => b.filter((burst) => burst.id !== id)), 1400)
  }

  function feedAt(spot) {
    if (state.asleep) return
    lastInteraction.current = Date.now()
    setState((s) => {
      const hunger = clamp(s.hunger + 22)
      if (hunger >= 95) showMessage(MESSAGES.full)
      return { ...s, spot, hunger, joy: clamp(s.joy + 6) }
    })
    spawnBurst((spot / 100) * 420 + 20, 160, '🍃', 5)
    if (Math.random() < 0.4) {
      setBlushing(true)
      setTimeout(() => setBlushing(false), 900)
    }
  }

  function pet() {
    if (state.asleep) return
    lastInteraction.current = Date.now()
    setState((s) => ({ ...s, joy: clamp(s.joy + 15) }))
    spawnBurst(200, 120, '💛', 3)
    setBlushing(true)
    setTimeout(() => setBlushing(false), 900)
  }

  function toggleSleep() {
    lastInteraction.current = Date.now()
    setState((s) => {
      if (s.asleep) {
        showMessage(MESSAGES.wokeUp)
        return { ...s, asleep: false, energy: clamp(s.energy + 40) }
      }
      showMessage(MESSAGES.sleeping)
      return { ...s, asleep: true }
    })
  }

  const mood = state.asleep ? 'asleep'
    : state.joy > 75 ? 'happy'
    : state.hunger < 20 ? 'angry'
    : state.hunger < 35 ? 'hungry'
    : state.energy < 25 ? 'sleepy'
    : 'normal'

  const value = { state, setState, mood, message, bursts, blushing, feedAt, pet, toggleSleep, showMessage }

  return <PandaContext.Provider value={value}>{children}</PandaContext.Provider>
}

export function usePanda() {
  const ctx = useContext(PandaContext)
  if (!ctx) throw new Error('usePanda must be used inside <PandaProvider>')
  return ctx
}
