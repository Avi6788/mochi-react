import { useEffect, useState } from 'react'

// Generic persisted-state hook. Loads once on mount, saves on every change.
export function useStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key)
      if (saved) return { ...defaultValue, ...JSON.parse(saved) }
    } catch (e) {
      // storage blocked or corrupted — fall back to defaults silently
    }
    return defaultValue
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
      // quota exceeded or storage disabled — app still works, just won't persist
    }
  }, [key, value])

  return [value, setValue]
}
