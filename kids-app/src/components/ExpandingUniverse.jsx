import { useMemo, useState } from 'react'

// Deterministic pseudo-random number generator so galaxies stay in the
// same spot between renders.
function mulberry32(seed) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export default function ExpandingUniverse() {
  const [scale, setScale] = useState(1)

  const galaxies = useMemo(() => {
    const rng = mulberry32(17)
    return Array.from({ length: 12 }, (_, i) => {
      const angle = rng() * Math.PI * 2
      const r = 35 + rng() * 160
      return {
        id: i,
        x: Math.cos(angle) * r,
        y: Math.sin(angle) * r,
        hue: Math.floor(rng() * 360),
        size: 5 + rng() * 7,
        r,
      }
    })
  }, [])

  return (
    <div className="panel">
      <h2>The Universe Is Stretching!</h2>
      <p className="lead">
        Imagine sprinkles stuck on a balloon. When you blow it up, every sprinkle moves
        away from every other sprinkle — and sprinkles that start <em>far apart</em> pull
        apart faster than sprinkles that are close. Space stretches the same way, so
        galaxies that are far away look like they're zooming away much faster than
        the nearby ones.
      </p>

      <div className="stage-svg-wrap">
        <svg viewBox="-220 -220 440 440" className="stage-svg" aria-label="Expanding universe visualization">
          <defs>
            <radialGradient id="bgGrad" cx="50%" cy="50%" r="75%">
              <stop offset="0%" stopColor="#1a1a55" />
              <stop offset="100%" stopColor="#05050f" />
            </radialGradient>
            <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5"
                    markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="#ffe6a8" />
            </marker>
          </defs>
          <rect x="-220" y="-220" width="440" height="440" fill="url(#bgGrad)" rx="20" />

          {/* faint grid that stretches with scale */}
          <g opacity="0.12" stroke="#aac">
            {[-3, -2, -1, 0, 1, 2, 3].map(i => (
              <g key={i}>
                <line x1={i * 50 * scale} y1={-210} x2={i * 50 * scale} y2={210} />
                <line x1={-210} y1={i * 50 * scale} x2={210} y2={i * 50 * scale} />
              </g>
            ))}
          </g>

          {galaxies.map(g => {
            const x = g.x * scale
            const y = g.y * scale
            const hue = g.hue
            return (
              <g key={g.id}>
                {/* trail from starting position to current position */}
                <line
                  className="galaxy-trail"
                  x1={g.x} y1={g.y} x2={x} y2={y}
                  stroke={`hsl(${hue},90%,75%)`} strokeWidth="1.5"
                />
                {/* velocity arrow: longer for galaxies that are farther */}
                {scale > 1 && (
                  <line
                    x1={x} y1={y}
                    x2={x + (g.x * 0.35)}
                    y2={y + (g.y * 0.35)}
                    stroke="#ffe6a8" strokeWidth="2"
                    markerEnd="url(#arrow)"
                  />
                )}
                <circle cx={x} cy={y} r={g.size}
                        fill={`hsl(${hue},75%,65%)`}
                        stroke="#fff" strokeOpacity="0.35" strokeWidth="1" />
              </g>
            )
          })}

          {/* YOU at the center */}
          <g>
            <circle cx="0" cy="0" r="13" fill="#ffe66d" stroke="#fff" strokeWidth="2" />
            <circle cx="0" cy="0" r="22" fill="none" stroke="#ffe66d" strokeOpacity="0.4" strokeWidth="2" />
            <text x="0" y="-28" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="800">YOU</text>
          </g>
        </svg>
      </div>

      <div className="controls">
        <label>
          Blow up the universe (scale factor: {scale.toFixed(2)}×)
          <input
            type="range" min="1" max="2.8" step="0.01"
            value={scale}
            onChange={e => setScale(parseFloat(e.target.value))}
          />
        </label>
        <button onClick={() => setScale(1)}>Reset</button>
      </div>

      <p className="caption">
        Look at the dashed trails. A galaxy that started far from YOU has a longer trail
        than one that started close. Because they all travel in the same amount of time,
        the far galaxy has to go faster — that's <strong>Hubble's Law</strong>. Space itself
        is stretching, not the galaxies flying through it!
      </p>
    </div>
  )
}
