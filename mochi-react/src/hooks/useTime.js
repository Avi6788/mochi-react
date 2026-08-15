import { useEffect } from 'react'
import { PERIODS, DAY_NIGHT_INTERVAL_MS } from '../utils/constants'
import { nextInCycle } from '../utils/helpers'

// Owns ONE responsibility: advance `period` on a timer.
// Takes the state setter so it can update the shared store without owning the data itself.
export function useTime(setState) {
  useEffect(() => {
    const timer = setInterval(() => {
      setState((s) => ({ ...s, period: nextInCycle(PERIODS, s.period) }))
    }, DAY_NIGHT_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [setState])
}
