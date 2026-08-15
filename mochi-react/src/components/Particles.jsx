import { AnimatePresence, motion } from 'framer-motion'

// Renders a burst of emoji particles that fly up, spin, and fade.
// `bursts` is an array of { id, x, y, emoji, count } passed down from App.
export default function Particles({ bursts }) {
  return (
    <AnimatePresence>
      {bursts.flatMap((burst) =>
        Array.from({ length: burst.count }).map((_, i) => (
          <motion.span
            key={`${burst.id}-${i}`}
            className="particle"
            initial={{
              x: burst.x, y: burst.y, opacity: 1, scale: 0.6, rotate: 0
            }}
            animate={{
              x: burst.x + (Math.random() * 60 - 30),
              y: burst.y - (50 + Math.random() * 40),
              opacity: 0,
              scale: 1,
              rotate: Math.random() * 180 - 90
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 + Math.random() * 0.4, ease: 'easeOut' }}
          >
            {burst.emoji}
          </motion.span>
        ))
      )}
    </AnimatePresence>
  )
}
