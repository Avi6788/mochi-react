import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useEffect, useState } from 'react'

// WeatherEffects owns ONLY the particle/overlay visuals for each weather type.
// SkyWeather handles background sky color and clouds.
// This separation keeps both files small and focused.

export default function WeatherEffects({ weather }) {
  return (
    <>
      <DarknessOverlay weather={weather} />
      <RainEffect weather={weather} />
      <SnowEffect weather={weather} />
      <ThunderEffect weather={weather} />
      <WindLines weather={weather} />
    </>
  )
}

// ─── Darkness overlay — sky gets darker for storms ──────────────────────────
const DARKNESS = {
  clear: 0,
  cloudy: 0.12,
  rainy: 0.25,
  'heavy-rain': 0.38,
  thunderstorm: 0.52,
  snow: 0.08,
  windy: 0.06,
}

function DarknessOverlay({ weather }) {
  const opacity = DARKNESS[weather] ?? 0
  return (
    <motion.div
      className="weather-overlay"
      animate={{ opacity }}
      transition={{ duration: 2.5, ease: 'easeInOut' }}
    />
  )
}

// ─── Rain — light rain vs heavy rain, different density + speed ──────────────
const RAIN_TYPES = ['rainy', 'heavy-rain', 'thunderstorm']

function RainEffect({ weather }) {
  const isRaining = RAIN_TYPES.includes(weather)
  const isHeavy = weather === 'heavy-rain' || weather === 'thunderstorm'
  const count = isHeavy ? 55 : 26

  const drops = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        left: Math.random() * 100,
        // Heavy rain falls faster and is more angled
        duration: isHeavy
          ? 0.3 + Math.random() * 0.25
          : 0.5 + Math.random() * 0.4,
        delay: Math.random() * 0.8,
        angle: isHeavy ? -22 : -8, // degrees of slant
        opacity: isHeavy ? 0.65 + Math.random() * 0.25 : 0.55 + Math.random() * 0.2,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [weather]
  )

  return (
    <motion.div
      className="rain-layer"
      animate={{ opacity: isRaining ? 1 : 0 }}
      transition={{ duration: 1.2, ease: 'easeInOut' }}
    >
      {drops.map((d, i) => (
        <motion.div
          key={i}
          className={`drop ${isHeavy ? 'drop-heavy' : ''}`}
          style={{ left: `${d.left}%`, rotate: `${d.angle}deg`, opacity: d.opacity }}
          animate={{ y: [-20, 330] }}
          transition={{
            duration: d.duration,
            delay: d.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </motion.div>
  )
}

// ─── Snow — different sizes, slow gentle fall, slight sway ───────────────────
function SnowEffect({ weather }) {
  const flakes = useMemo(
    () =>
      Array.from({ length: 30 }, () => ({
        left: Math.random() * 100,
        size: 4 + Math.random() * 7,           // px — mixed sizes feel natural
        duration: 4 + Math.random() * 5,       // slow drift
        delay: Math.random() * 5,
        sway: (Math.random() - 0.5) * 40,      // horizontal drift while falling
        opacity: 0.6 + Math.random() * 0.35,
      })),
    []
  )

  return (
    <motion.div
      className="snow-layer"
      animate={{ opacity: weather === 'snow' ? 1 : 0 }}
      transition={{ duration: 1.5, ease: 'easeInOut' }}
    >
      {flakes.map((f, i) => (
        <motion.div
          key={i}
          className="snowflake"
          style={{ left: `${f.left}%`, width: f.size, height: f.size, opacity: f.opacity }}
          animate={{ y: [-10, 330], x: [0, f.sway, 0] }}
          transition={{
            duration: f.duration,
            delay: f.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </motion.div>
  )
}

// ─── Thunder — random white flash across the whole sky ───────────────────────
function ThunderEffect({ weather }) {
  const [flash, setFlash] = useState(false)

  useEffect(() => {
    if (weather !== 'thunderstorm') return
    let cancelled = false

    function scheduleFlash() {
      // Random gap between 3s and 9s between lightning strikes
      const delay = 3000 + Math.random() * 6000
      setTimeout(() => {
        if (cancelled) return
        // Flash on, then off quickly — two rapid flashes feel realistic
        setFlash(true)
        setTimeout(() => { setFlash(false)
          setTimeout(() => { setFlash(true)
            setTimeout(() => { setFlash(false); scheduleFlash() }, 80)
          }, 120)
        }, 80)
      }, delay)
    }
    scheduleFlash()
    return () => { cancelled = true }
  }, [weather])

  return (
    <AnimatePresence>
      {flash && (
        <motion.div
          className="thunder-flash"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.55 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.06 }}
        />
      )}
    </AnimatePresence>
  )
}

// ─── Wind lines — diagonal streaks that sweep across on windy/storm weather ──
const WIND_TYPES = ['windy', 'thunderstorm', 'heavy-rain']

function WindLines({ weather }) {
  const isWindy = WIND_TYPES.includes(weather)

  const lines = useMemo(
    () =>
      Array.from({ length: 12 }, () => ({
        top: Math.random() * 90,
        width: 30 + Math.random() * 60,
        duration: 0.6 + Math.random() * 0.5,
        delay: Math.random() * 1.2,
        opacity: 0.18 + Math.random() * 0.2,
      })),
    []
  )

  return (
    <motion.div
      className="wind-layer"
      animate={{ opacity: isWindy ? 1 : 0 }}
      transition={{ duration: 1, ease: 'easeInOut' }}
    >
      {lines.map((l, i) => (
        <motion.div
          key={i}
          className="wind-line"
          style={{ top: `${l.top}%`, width: l.width, opacity: l.opacity }}
          animate={{ x: [-l.width, 500] }}
          transition={{
            duration: l.duration,
            delay: l.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </motion.div>
  )
}
