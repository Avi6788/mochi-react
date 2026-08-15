import { PandaProvider, usePanda } from './context/PandaContext'
import Panda from './components/Panda'
import BambooPatch from './components/BambooPatch'
import Particles from './components/Particles'
import SkyWeather from './components/SkyWeather'
import StatBar from './components/StatBar'
import Controls from './components/Controls'
import DialogueBubble from './components/DialogueBubble'
import { SPOTS, PERIODS, WEATHERS } from './utils/constants'
import { nextInCycle, pickDifferent } from './utils/helpers'
import './styles.css'

// App.jsx only connects components together — all logic lives in PandaContext + hooks.
export default function App() {
  return (
    <PandaProvider>
      <Scene />
    </PandaProvider>
  )
}

function Scene() {
  const { state, mood, blushing, bursts, feedAt, pet } = usePanda()

  return (
    <div className="scene">
      <h1>🐼 Mochi's Bamboo Forest</h1>
      <DialogueBubble />

      <div className="stats">
        <StatBar icon="🎋" label="Hunger" value={state.hunger} colorClass="fill-hunger" />
        <StatBar icon="💛" label="Joy" value={state.joy} colorClass="fill-joy" />
        <StatBar icon="🌙" label="Energy" value={state.energy} colorClass="fill-energy" />
      </div>

      <div className="stage">
        <StageControls />
        <SkyWeather period={state.period} weather={state.weather} />
        <div className="ground" />

        {SPOTS.map((spot) => (
          <BambooPatch key={spot} spot={spot} onFeed={feedAt} />
        ))}

        <Panda spot={state.spot} mood={mood} blush={blushing} onPet={pet} />
        <Particles bursts={bursts} />
      </div>

      <Controls />
      <p className="footer-note">Mochi's world is saved on this device</p>
    </div>
  )
}

function StageControls() {
  const { state, setState } = usePanda()
  return (
    <div className="stage-controls">
      <button
        className="pill"
        onClick={() => setState((s) => ({ ...s, period: nextInCycle(PERIODS, s.period) }))}
      >
        {state.period}
      </button>
      <button
        className="pill"
        onClick={() => setState((s) => ({ ...s, weather: pickDifferent(WEATHERS, s.weather) }))}
      >
        {state.weather}
      </button>
    </div>
  )
}
