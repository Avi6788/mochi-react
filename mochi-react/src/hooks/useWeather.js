import { useEffect } from 'react'
import { WEATHERS, WEATHER_CHECK_INTERVAL_MS, WEATHER_CHANGE_CHANCE } from '../utils/constants'
import { pickDifferent } from '../utils/helpers'

// Owns ONE responsibility: occasionally roll a new weather, simulating "sudden" change.
export function useWeather(setState) {
  useEffect(() => {
    const timer = setInterval(() => {
      if (Math.random() < WEATHER_CHANGE_CHANCE) {
        setState((s) => ({ ...s, weather: pickDifferent(WEATHERS, s.weather) }))
      }
    }, WEATHER_CHECK_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [setState])
}
