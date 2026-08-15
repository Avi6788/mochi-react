import { motion } from 'framer-motion'
import { useState } from 'react'

export default function BambooPatch({ spot, onFeed }) {
  const [eaten, setEaten] = useState(false)

  function handleClick() {
    onFeed(spot)
    setEaten(true)
    setTimeout(() => setEaten(false), 9000) // regrow after 9s
  }

  return (
    <motion.div
      className="clump"
      style={{ left: `${spot}%` }}
      onClick={handleClick}
      whileHover={{ y: -4, scale: 1.05 }}
    >
      {[50, 62, 44].map((h, i) => (
        <motion.span
          key={i}
          className="stalk"
          animate={{ height: eaten ? 16 : h, opacity: eaten ? 0.35 : 1 }}
          transition={{ duration: 0.4 }}
        />
      ))}
    </motion.div>
  )
}
