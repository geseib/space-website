import { useState } from 'react'
import { SUN, PLANETS } from '../data/planets.js'

const SIZE_MODES = [
  { id: 'log',    label: 'Fair view (easy to see)' },
  { id: 'linear', label: 'True-size view' },
]

export default function SolarSystem() {
  const [mode, setMode] = useState('log')
  const [selected, setSelected] = useState('earth')

  const all = [SUN, ...PLANETS]

  // Size display: choose how big the biggest body draws on screen (px).
  const maxPx = 110
  const maxRadius = Math.max(...all.map(p => p.radiusKm))

  const renderPx = (r) => {
    if (mode === 'linear') {
      return Math.max(2, (r / maxRadius) * maxPx)
    }
    // log mode — compress the giant range so tiny planets are still visible.
    const minR = Math.min(...all.map(p => p.radiusKm))
    const t = (Math.log(r) - Math.log(minR)) / (Math.log(maxRadius) - Math.log(minR))
    return 10 + t * (maxPx - 10)
  }

  // Distance strip: place each planet by its actual orbit distance.
  const maxDist = Math.max(...PLANETS.map(p => p.distanceMkm))

  const sel = all.find(p => p.id === selected) ?? SUN

  return (
    <div className="panel">
      <h2>Meet the Solar System</h2>
      <p className="lead">
        Our Sun has eight planets. Some are tiny and rocky, some are huge and gassy,
        and they're all <em>super</em> far apart. Tap a planet to learn more, and try
        switching between a fair-to-see view and a true-to-size view.
      </p>

      <div className="toggle-row" role="radiogroup" aria-label="Size view">
        {SIZE_MODES.map(m => (
          <button
            key={m.id}
            className={mode === m.id ? 'on' : ''}
            role="radio"
            aria-checked={mode === m.id}
            onClick={() => setMode(m.id)}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="planet-row">
        {all.map(p => {
          const size = renderPx(p.radiusKm)
          const isSelected = selected === p.id
          return (
            <button
              key={p.id}
              className="planet-card"
              onClick={() => setSelected(p.id)}
              style={{
                borderColor: isSelected ? p.color : 'rgba(255,255,255,0.1)',
                outline: isSelected ? `2px solid ${p.color}` : 'none',
              }}
            >
              <div className="planet-sphere-wrap">
                <div
                  className="planet-sphere"
                  style={{
                    width: size,
                    height: size,
                    background: `radial-gradient(circle at 30% 30%, #ffffffbb 0%, ${p.color} 35%, #1a1a33 130%)`,
                    boxShadow: p.id === 'sun'
                      ? `0 0 40px ${p.color}, inset -10px -10px 20px rgba(0,0,0,0.25)`
                      : `inset -10px -10px 20px rgba(0,0,0,0.4), 0 0 20px rgba(255,255,255,0.1)`,
                  }}
                />
              </div>
              <div className="planet-name">{p.name}</div>
              <div className="planet-meta">
                {p.id === 'sun' ? 'Star' : `${p.distanceMkm.toLocaleString()}M km`}
              </div>
            </button>
          )
        })}
      </div>

      <div className="distance-strip">
        <h3>How far away are they, really?</h3>
        <div className="distance-track">
          {/* Sun marker on the far left */}
          <div
            className="sun-marker"
            style={{
              left: '0%',
              width: 22, height: 22,
              background: `radial-gradient(circle at 30% 30%, #fff 0%, ${SUN.color} 50%, #b25400 140%)`,
              boxShadow: `0 0 18px ${SUN.color}`,
            }}
            title="Sun"
          />
          <span className="distance-label" style={{ left: '0%' }}>Sun</span>

          {PLANETS.map(p => {
            const pct = (p.distanceMkm / maxDist) * 100
            return (
              <span key={p.id}>
                <button
                  className="planet-marker"
                  onClick={() => setSelected(p.id)}
                  style={{
                    left: pct + '%',
                    width: 14, height: 14,
                    background: `radial-gradient(circle at 30% 30%, #fff9 0%, ${p.color} 45%, #111 140%)`,
                    border: selected === p.id ? '2px solid #fff' : '1px solid rgba(255,255,255,0.3)',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                  aria-label={`${p.name}, ${p.distanceMkm} million km from Sun`}
                  title={`${p.name} — ${p.distanceMkm.toLocaleString()}M km`}
                />
                <span className="distance-label" style={{ left: pct + '%' }}>{p.name}</span>
              </span>
            )
          })}
        </div>
        <p style={{ color: 'var(--ink-dim)', fontSize: '0.9rem', marginTop: 30 }}>
          Notice the rocky planets crammed near the Sun and the gas giants spread
          waaaay out. Neptune is about 30 times farther from the Sun than Earth is!
        </p>
      </div>

      <FactCard planet={sel} />

      <p className="caption">
        Fun fact: if the Sun were the size of a basketball, Earth would be about the
        size of a peppercorn — and it would be <strong>26 meters</strong> away.
        Neptune? Nearly <strong>800 meters</strong> away. Space is mostly… space.
      </p>
    </div>
  )
}

function FactCard({ planet }) {
  return (
    <div
      style={{
        marginTop: 16,
        padding: '14px 18px',
        borderRadius: 14,
        background: `linear-gradient(135deg, ${planet.color}33, transparent)`,
        border: `2px solid ${planet.color}55`,
      }}
    >
      <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{planet.name}</div>
      <div style={{ color: 'var(--ink-dim)', fontSize: '0.95rem', marginTop: 4 }}>
        Radius: {planet.radiusKm.toLocaleString()} km
        {planet.distanceMkm > 0 && <>  ·  {planet.distanceMkm.toLocaleString()} million km from the Sun</>}
      </div>
      <div style={{ marginTop: 8 }}>{planet.funFact}</div>
    </div>
  )
}
