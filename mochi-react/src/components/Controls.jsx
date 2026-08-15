import { usePanda } from '../context/PandaContext'

export default function Controls() {
  const { state, feedAt, pet, toggleSleep } = usePanda()

  return (
    <div className="controls">
      <button className="action btn-feed" onClick={() => feedAt(state.spot)} disabled={state.asleep}>
        Feed 🎋
      </button>
      <button className="action btn-pet" onClick={pet} disabled={state.asleep}>
        Pet 🤍
      </button>
      <button className="action btn-sleep" onClick={toggleSleep}>
        {state.asleep ? 'Wake up ☀️' : 'Sleep 🌙'}
      </button>
    </div>
  )
}
