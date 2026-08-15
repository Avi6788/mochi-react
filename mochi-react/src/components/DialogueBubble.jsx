import { AnimatePresence, motion } from 'framer-motion'
import { usePanda } from '../context/PandaContext'

export default function DialogueBubble() {
  const { message } = usePanda()
  return (
    <div className="bubble-slot">
      <AnimatePresence>
        {message && (
          <motion.div
            className="bubble"
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.9 }}
            transition={{ duration: 0.25 }}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
