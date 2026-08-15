export function clamp(n, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n))
}

export function pickDifferent(list, current) {
  let next
  do { next = list[Math.floor(Math.random() * list.length)] } while (next === current && list.length > 1)
  return next
}

export function nextInCycle(list, current) {
  return list[(list.indexOf(current) + 1) % list.length]
}

// green / yellow / red status for any 0-100 stat, used by StatBar
export function statusColor(value, thresholds) {
  if (value >= thresholds.good) return 'good'
  if (value >= thresholds.low) return 'warn'
  return 'bad'
}
