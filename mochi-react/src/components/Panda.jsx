import { motion, useAnimation } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

// This component owns ONLY panda visuals + its own idle animations.
// App.jsx tells it where to stand (spot) and what mood it's in (mood).
export default function Panda({ spot, mood, blush, onPet }) {
  const controls = useAnimation()
  const [blinking, setBlinking] = useState(false)
  const [chewing, setChewing] = useState(false)
  const [yawning, setYawning] = useState(false)
  const chewTimeout = useRef(null)
  const prevMood = useRef(mood)

  // --- Idle blink: fires on a random interval, independent of everything else ---
  useEffect(() => {
    let cancelled = false
    function scheduleBlink() {
      const delay = 2500 + Math.random() * 3000
      setTimeout(() => {
        if (cancelled) return
        setBlinking(true)
        setTimeout(() => !cancelled && setBlinking(false), 140)
        scheduleBlink()
      }, delay)
    }
    scheduleBlink()
    return () => { cancelled = true }
  }, [])

  // --- Yawn just before falling asleep, stretch just after waking ---
  useEffect(() => {
    if (prevMood.current !== 'asleep' && mood === 'asleep') {
      setYawning(true)
      setTimeout(() => setYawning(false), 700)
    }
    if (prevMood.current === 'asleep' && mood !== 'asleep') {
      controls.start({
        scaleY: [1, 1.08, 1],
        scaleX: [1, 0.95, 1],
        transition: { duration: 0.6, ease: 'easeInOut' }
      })
    }
    prevMood.current = mood
  }, [mood, controls])

  // --- Squash-and-stretch bounce, triggered externally via imperative animate ---
  function bounce() {
    controls.start({
      scale: [1, 1.08, 0.92, 1.03, 1],
      y: [0, -14, 2, -4, 0],
      transition: { duration: 0.55, ease: [0.36, 1.9, 0.4, 1] }
    })
  }

  function handleClick() {
    bounce()
    setChewing(true)
    clearTimeout(chewTimeout.current)
    chewTimeout.current = setTimeout(() => setChewing(false), 400)
    onPet?.()
  }

  const eyeState = yawning ? 'sleepy'
    : mood === 'asleep' ? 'sleepy'
    : blinking ? 'blink'
    : mood === 'happy' ? 'sparkle'
    : mood === 'angry' ? 'angry'
    : mood === 'hungry' ? 'sad'
    : 'normal'

  return (
    <motion.div
      className={`panda ${mood === 'asleep' ? 'breathing' : ''}`}
      style={{ left: `${spot}%` }}
      animate={controls}
      // Smooth glide when spot changes (the "walk")
      transition={{ left: { duration: 2.2, ease: 'linear' } }}
      onClick={handleClick}
      whileTap={{ scale: 0.95 }}
    >
      <div className="ear left" /><div className="ear right" />
      <div className="head">
        <div className="patch left" /><div className="patch right" />
        <motion.div
          className="blush left"
          animate={{ opacity: blush ? 1 : 0 }}
        />
        <motion.div
          className="blush right"
          animate={{ opacity: blush ? 1 : 0 }}
        />
        <Eye side="left" state={eyeState} />
        <Eye side="right" state={eyeState} />
        <div className="nose" />
        <div className={`mouth ${chewing ? 'chew' : ''} ${yawning ? 'yawn' : ''}`} />
      </div>
      <div className="body">
        <div className="armpatch left" /><div className="armpatch right" />
      </div>
    </motion.div>
  )
}

function Eye({ side, state }) {
  // Each mood maps to a different height/shape — animated smoothly by Framer Motion
  const variants = {
    normal:  { height: 7,  borderRadius: '50%', y: 0, rotate: 0 },
    blink:   { height: 1.5, borderRadius: 2, y: 0, rotate: 0 },
    sleepy:  { height: 1.5, borderRadius: 2, y: 0, rotate: 0 },
    sparkle: { height: 3, borderRadius: '0 0 8px 8px', y: 2, rotate: 0 },
    sad:     { height: 7, borderRadius: '50%', y: 3, rotate: 0 },
    angry:   { height: 3, borderRadius: 1, y: 0, rotate: side === 'left' ? -18 : 18 },
  }
  return (
    <motion.div
      className={`eye ${side}`}
      animate={variants[state]}
      transition={{ duration: 0.15 }}
    />
  )
}

