// All tunable numbers live here so nothing is hardcoded inside components.

export const PERIODS = ['morning', 'day', 'evening', 'night']
export const WEATHERS = ['clear', 'cloudy', 'rainy', 'heavy-rain', 'thunderstorm', 'snow', 'windy']

// How dark the sky overlay gets per weather type
export const WEATHER_DARKNESS = {
  clear: 0,
  cloudy: 0.15,
  rainy: 0.28,
  'heavy-rain': 0.42,
  thunderstorm: 0.55,
  snow: 0.1,
  windy: 0.08,
}

// Cloud speed multiplier per weather type (affects drift animation)
export const CLOUD_SPEED = {
  clear: 1,
  cloudy: 1.4,
  rainy: 1.8,
  'heavy-rain': 2.2,
  thunderstorm: 2.8,
  snow: 0.6,
  windy: 3.5,
}
export const SPOTS = [15, 50, 83]

export const STORAGE_KEY = 'mochi-world'

export const DAY_NIGHT_INTERVAL_MS = 40000
export const WEATHER_CHECK_INTERVAL_MS = 30000
export const WEATHER_CHANGE_CHANCE = 0.35
export const STAT_DRIFT_INTERVAL_MS = 8000

// If Mochi hasn't been fed/petted in this long, she gets a little upset
export const IGNORE_THRESHOLD_MS = 90000

export const STAT_THRESHOLDS = { good: 60, low: 30 } // >=60 green, >=30 yellow, else red

export const DEFAULT_STATE = {
  hunger: 70,
  joy: 60,
  energy: 80,
  asleep: false,
  period: 'day',
  weather: 'clear',
  spot: 15,
}

export const MESSAGES = {
  full: 'Mochi is full! 🎋',
  sleeping: 'Mochi is sleeping... 💤',
  happy: 'Mochi is so happy! 🌟',
  hungry: "Mochi's tummy is rumbling...",
  upset: "Mochi feels a little ignored 🥺",
  wokeUp: 'Mochi stretches and wakes up! ☀️',
}
