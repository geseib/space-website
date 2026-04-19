import { useState } from 'react'

// Speeds in km/h. Values are approximate real-world figures.
const LAYERS = [
  {
    id: 'stand',
    name: 'Standing still on the ground',
    desc: "You're not moving, right? Keep reading...",
    kmh: 0,
    color: '#7cc4ff',
  },
  {
    id: 'spin',
    name: 'Spinning with Earth (at the equator)',
    desc: 'Earth turns all the way around once every day.',
    kmh: 1670,
    color: '#4ecdc4',
  },
  {
    id: 'orbit',
    name: 'Orbiting the Sun with Earth',
    desc: 'Earth loops around the Sun once every year.',
    kmh: 107000,
    color: '#ffd166',
  },
  {
    id: 'galaxy',
    name: 'Riding the Sun around the Milky Way',
    desc: 'Our Sun circles the galaxy once every ~230 million years.',
    kmh: 828000,
    color: '#ff6b9d',
  },
  {
    id: 'universe',
    name: 'Flying with the galaxy through the universe',
    desc: 'The Milky Way is drifting relative to the cosmic microwave background.',
    kmh: 2160000,
    color: '#c287ff',
  },
]

function formatNumber(n) {
  return n.toLocaleString('en-US')
}

export default function CosmicSpeed() {
  const [upTo, setUpTo] = useState(1)

  const total = LAYERS.slice(0, upTo + 1).reduce((s, l) => s + l.kmh, 0)
  const totalMps = Math.round((total * 1000) / 3600)

  return (
    <div className="panel">
      <h2>How Fast Are You <em>Really</em> Moving?</h2>
      <p className="lead">
        When you're sitting perfectly still, you're actually flying through space at
        incredible speeds! Tap the button to add another kind of motion and see your
        cosmic speed grow.
      </p>

      <div className="controls">
        <button onClick={() => setUpTo(Math.max(0, upTo - 1))}>← Slow down</button>
        <div style={{ flex: 1, textAlign: 'center', fontWeight: 700 }}>
          Layer {upTo + 1} of {LAYERS.length}
        </div>
        <button onClick={() => setUpTo(Math.min(LAYERS.length - 1, upTo + 1))}>
          Speed up →
        </button>
      </div>

      <div className="speed-layers">
        {LAYERS.map((layer, i) => {
          const active = i <= upTo
          return (
            <div key={layer.id} className={'speed-layer' + (active ? ' active' : '')}>
              <div
                className="speed-icon"
                style={{
                  background: `radial-gradient(circle at 30% 30%, #ffffff55 0%, transparent 60%),
                               linear-gradient(135deg, ${layer.color}, #3a1a66)`,
                }}
                aria-hidden="true"
              >
                <SpeedIcon id={layer.id} />
              </div>
              <div>
                <div className="speed-name">{layer.name}</div>
                <div className="speed-desc">{layer.desc}</div>
              </div>
              <div className="speed-value">
                {formatNumber(layer.kmh)}
                <span className="unit">km/h</span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="total-card">
        <div>Your total speed through the universe right now:</div>
        <div className="big">{formatNumber(total)} km/h</div>
        <div style={{ color: 'var(--ink-dim)' }}>
          That's about {formatNumber(totalMps)} meters every second.
        </div>
      </div>

      <p className="caption">
        So next time someone tells you to sit still, tell them you're already traveling
        faster than a bullet, an airplane, and a rocket combined! Space is wild.
      </p>
    </div>
  )
}

function SpeedIcon({ id }) {
  // Simple SVG glyphs per layer — kid-friendly silhouettes.
  const common = { width: 36, height: 36, viewBox: '0 0 40 40', fill: 'none', stroke: '#fff', strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round' }
  switch (id) {
    case 'stand':
      return (
        <svg {...common}>
          <circle cx="20" cy="10" r="4" fill="#fff" />
          <path d="M20 14 V26 M14 32 L20 26 L26 32 M14 20 L20 22 L26 20" />
        </svg>
      )
    case 'spin':
      return (
        <svg {...common}>
          <circle cx="20" cy="20" r="10" fill="#4ecdc433" />
          <path d="M20 10 A10 10 0 0 1 30 20" />
          <path d="M28 10 L30 20 L20 22" />
        </svg>
      )
    case 'orbit':
      return (
        <svg {...common}>
          <circle cx="20" cy="20" r="4" fill="#ffd166" />
          <ellipse cx="20" cy="20" rx="14" ry="7" />
          <circle cx="34" cy="20" r="2.5" fill="#7cc4ff" />
        </svg>
      )
    case 'galaxy':
      return (
        <svg {...common}>
          <path d="M8 20 C 8 8, 32 8, 32 20 C 32 32, 8 32, 8 20 Z" />
          <path d="M12 20 C 14 14, 26 14, 28 20 C 26 26, 14 26, 12 20 Z" />
          <circle cx="20" cy="20" r="2" fill="#fff" />
        </svg>
      )
    case 'universe':
      return (
        <svg {...common}>
          <circle cx="10" cy="10" r="2" fill="#fff" />
          <circle cx="30" cy="14" r="2" fill="#fff" />
          <circle cx="22" cy="28" r="2" fill="#fff" />
          <circle cx="12" cy="26" r="2" fill="#fff" />
          <path d="M6 6 L34 34" strokeDasharray="3 3" />
        </svg>
      )
    default:
      return null
  }
}
