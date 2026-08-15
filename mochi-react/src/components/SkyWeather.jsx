import { motion } from 'framer-motion'
import { useMemo } from 'react'
import WeatherEffects from './WeatherEffects'
import { CLOUD_SPEED } from '../utils/constants'

const PERIOD_META = {
  morning: { sky: 'sky-morning', pos: { left: '18%', top: 150 }, look: 'sun' },
  day:     { sky: 'sky-day',     pos: { left: '46%', top: 40  }, look: 'sun' },
  evening: { sky: 'sky-evening', pos: { left: '75%', top: 140 }, look: 'sun' },
  night:   { sky: 'sky-night',   pos: { left: '46%', top: 40  }, look: 'moon' },
}

// Clouds darken to grey before/during rain and storms
const CLOUD_COLOR = {
  clear: '#ffffff',
  cloudy: '#f0eef0',
  rainy: '#c8c8cc',
  'heavy-rain': '#aaaaaf',
  thunderstorm: '#888890',
  snow: '#e8eaee',
  windy: '#dde0e8',
}

export default function SkyWeather({ period, weather }) {
  const meta = PERIOD_META[period]
  const speedMult = CLOUD_SPEED[weather] ?? 1
  const cloudColor = CLOUD_COLOR[weather] ?? '#ffffff'

  const stars = useMemo(
    () =>
      Array.from({ length: 24 }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 70,
        opacity: 0.4 + Math.random() * 0.6,
      })),
    []
  )

  const fireflies = useMemo(
    () =>
      Array.from({ length: 8 }, () => ({
        left: Math.random() * 90 + 5,
        delay: Math.random() * 4,
      })),
    []
  )

  const hideClouds = ['heavy-rain', 'thunderstorm'].includes(weather)

  return (
    <div className={`sky ${meta.sky}`}>

      {/* Sun or moon — glides smoothly between morning / day / evening / night positions */}
      <motion.div
        className={`celestial ${meta.look}`}
        animate={{ left: meta.pos.left, top: meta.pos.top }}
        transition={{ duration: 3, ease: 'easeInOut' }}
      />

      {/* Stars — fade in at night only */}
      <motion.div
        className="stars"
        animate={{ opacity: period === 'night' ? 1 : 0 }}
        transition={{ duration: 2 }}
      >
        {stars.map((s, i) => (
          <div
            key={i}
            className="star"
            style={{ left: `${s.left}%`, top: `${s.top}%`, opacity: s.opacity }}
          />
        ))}
      </motion.div>

      {/* Fireflies — only at night, drift upward in a loop */}
      {period === 'night' &&
        fireflies.map((f, i) => (
          <motion.div
            key={i}
            className="firefly"
            style={{ left: `${f.left}%`, bottom: 70 }}
            animate={{ y: [0, -30, -50], opacity: [0, 0.9, 0] }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              delay: f.delay,
              ease: 'easeInOut',
            }}
          />
        ))}

      {/* Clouds — hidden on heavy rain / storm (covered by dark overlay instead)
          Speed and color react to weather type */}
      {!hideClouds && (
        <>
          <Cloud
            style={{ width: 56, height: 18, top: 26, left: '10%' }}
            duration={40 / speedMult}
            sway={14}
            color={cloudColor}
          />
          <Cloud
            style={{ width: 38, height: 14, top: 44, left: '40%' }}
            duration={55 / speedMult}
            sway={-10}
            color={cloudColor}
          />
          <Cloud
            style={{ width: 48, height: 16, top: 20, right: '10%' }}
            duration={32 / speedMult}
            sway={12}
            color={cloudColor}
          />
        </>
      )}

      {/* All weather particle effects live in WeatherEffects */}
      <WeatherEffects weather={weather} />
    </div>
  )
}

// Small reusable cloud — background color + sway speed react to weather
function Cloud({ style, duration, sway, color }) {
  return (
    <motion.div
      className="cloud-deco"
      style={{ ...style, background: color, transition: 'background 2s ease' }}
      animate={{ x: [0, sway, 0] }}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}
