import { useState } from 'react'
import TabBar from './components/TabBar.jsx'
import ExpandingUniverse from './components/ExpandingUniverse.jsx'
import CosmicSpeed from './components/CosmicSpeed.jsx'
import SolarSystem from './components/SolarSystem.jsx'
import './App.css'

const TABS = [
  { id: 'expanding', label: 'Expanding Universe', color: '#ff6b9d' },
  { id: 'speed',     label: 'How Fast Are You?',  color: '#4ecdc4' },
  { id: 'solar',     label: 'Solar System Scale', color: '#ffd166' },
  { id: 'more',      label: 'More Soon…',         color: '#c287ff', coming: true },
]

export default function App() {
  const [active, setActive] = useState('expanding')

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="title">Space Explorer</h1>
        <p className="subtitle">A cosmic adventure for curious kids</p>
      </header>

      <TabBar tabs={TABS} active={active} onSelect={setActive} />

      <main className="stage">
        {active === 'expanding' && <ExpandingUniverse />}
        {active === 'speed'     && <CosmicSpeed />}
        {active === 'solar'     && <SolarSystem />}
        {active === 'more'      && <ComingSoon />}
      </main>

      <footer className="app-footer">Keep looking up — the universe is made of wonders.</footer>
    </div>
  )
}

function ComingSoon() {
  return (
    <div className="panel">
      <h2>New adventures coming soon!</h2>
      <p className="lead">
        Black holes, shooting stars, how rockets fly, what makes the Moon glow, and more.
        Tell a grown-up what you'd like to learn about next!
      </p>
    </div>
  )
}
