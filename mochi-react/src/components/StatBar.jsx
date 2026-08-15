import { motion } from 'framer-motion'
import { STAT_THRESHOLDS } from '../utils/constants'
import { statusColor } from '../utils/helpers'

export default function StatBar({ icon, label, value, colorClass }) {
  const status = statusColor(value, STAT_THRESHOLDS) // 'good' | 'warn' | 'bad'

  return (
    <div className="stat">
      <div className="stat-label">
        <span>{icon} {label}</span>
        <span className={`status-dot dot-${status}`} />
      </div>
      <div className="bar">
        <motion.div
          className={`bar-fill ${colorClass}`}
          animate={{ width: `${value}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 18 }}
        />
      </div>
    </div>
  )
}
