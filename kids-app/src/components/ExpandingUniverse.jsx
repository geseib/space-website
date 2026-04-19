import { useMemo, useState } from 'react'

// A regular grid of galaxies so "distance in space units" is obvious.
const GRID = 5
const SPACING = 56 // pixels per "space unit" in the initial universe

function buildGrid() {
  const out = []
  for (let row = 0; row < GRID; row++) {
    for (let col = 0; col < GRID; col++) {
      const id = row * GRID + col
      out.push({
        id,
        col, row,
        x: (col - (GRID - 1) / 2) * SPACING,
        y: (row - (GRID - 1) / 2) * SPACING,
        hue: (col * 47 + row * 83) % 360,
      })
    }
  }
  return out
}

export default function ExpandingUniverse() {
  const [scale, setScale] = useState(1)
  const [refId, setRefId] = useState(12) // center galaxy of 5x5 grid
  const galaxies = useMemo(buildGrid, [])
  const ref = galaxies.find(g => g.id === refId) ?? galaxies[12]

  // Uniform expansion from the chosen reference galaxy:
  //   P'  =  R  +  (P - R) * scale
  // means every distance from R is multiplied by `scale`, no matter which
  // galaxy you stand on — this is exactly what Hubble's Law describes.
  const positioned = galaxies.map(g => ({
    ...g,
    x: ref.x + (g.x - ref.x) * scale,
    y: ref.y + (g.y - ref.y) * scale,
    origX: g.x,
    origY: g.y,
    unitsFromRef: Math.round(
      Math.hypot(g.col - ref.col, g.row - ref.row) * 10,
    ) / 10,
  }))

  // Pick two galaxies to highlight with a numeric "before → after" label:
  // the nearest non-reference neighbor and a far one.
  const others = positioned
    .filter(g => g.id !== ref.id)
    .sort((a, b) => a.unitsFromRef - b.unitsFromRef)
  const near = others[0]
  const far = others[others.length - 1]

  return (
    <div className="panel">
      <h2>The Universe Is Stretching!</h2>
      <p className="lead">
        Pick any galaxy to stand on. Then press <strong>Double the universe</strong>.
        Every galaxy's distance from you <em>doubles</em>. A galaxy that was 1 space away
        is now 2 (it moved 1 space). A galaxy that was 3 spaces away is now 6
        (it moved 3!). Same time, bigger trip — so far galaxies look faster. That's
        Hubble's Law.
      </p>

      <div className="stage-svg-wrap">
        <svg viewBox="-260 -260 520 520" className="stage-svg" aria-label="Expanding universe grid">
          <defs>
            <radialGradient id="bgGrad2" cx="50%" cy="50%" r="75%">
              <stop offset="0%" stopColor="#1a1a55" />
              <stop offset="100%" stopColor="#05050f" />
            </radialGradient>
            <marker id="arrow2" viewBox="0 0 10 10" refX="9" refY="5"
                    markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="#ffe6a8" />
            </marker>
          </defs>
          <rect x="-260" y="-260" width="520" height="520" fill="url(#bgGrad2)" rx="20" />

          {/* Dashed trail from original position to current position. */}
          {positioned.map(g => {
            if (g.id === ref.id) return null
            return (
              <line
                key={'trail-' + g.id}
                className="galaxy-trail"
                x1={g.origX} y1={g.origY}
                x2={g.x} y2={g.y}
                stroke={`hsl(${g.hue},90%,75%)`}
                strokeWidth="1.5"
              />
            )
          })}

          {/* Velocity arrows on the two highlighted galaxies. */}
          {scale > 1 && [near, far].map(g => (
            <line
              key={'arr-' + g.id}
              x1={g.origX} y1={g.origY}
              x2={g.x} y2={g.y}
              stroke="#ffe6a8" strokeWidth="2.5"
              markerEnd="url(#arrow2)"
            />
          ))}

          {/* Galaxies (buttons so kids can tap to choose). */}
          {positioned.map(g => {
            const isRef = g.id === ref.id
            const size = isRef ? 14 : 9
            return (
              <g key={g.id} style={{ cursor: 'pointer' }} onClick={() => setRefId(g.id)}>
                <circle cx={g.x} cy={g.y} r={size + 8} fill="transparent" />
                <circle
                  cx={g.x} cy={g.y} r={size}
                  fill={isRef ? '#ffe66d' : `hsl(${g.hue},75%,65%)`}
                  stroke="#fff"
                  strokeOpacity={isRef ? 1 : 0.35}
                  strokeWidth={isRef ? 2.5 : 1}
                />
              </g>
            )
          })}

          {/* Label on the reference galaxy. */}
          <text x={ref.x} y={ref.y - 22} textAnchor="middle"
                fill="#fff" fontSize="13" fontWeight="800">
            YOU
          </text>

          {/* before → after distance labels on near & far galaxies. */}
          {[near, far].map(g => (
            <g key={'lab-' + g.id}>
              <rect
                x={g.x - 28} y={g.y + 14}
                width="56" height="20" rx="10"
                fill="#0b0b2a" stroke="#ffe6a8" strokeWidth="1"
              />
              <text
                x={g.x} y={g.y + 28}
                textAnchor="middle" fill="#ffe6a8"
                fontSize="11" fontWeight="700"
              >
                {g.unitsFromRef} → {(g.unitsFromRef * scale).toFixed(1)}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="controls">
        <button onClick={() => setScale(s => Math.min(4, +(s * 2).toFixed(2)))}>
          Double the universe!
        </button>
        <label>
          Or slide to stretch (scale: {scale.toFixed(2)}×)
          <input
            type="range" min="1" max="3" step="0.01"
            value={scale}
            onChange={e => setScale(parseFloat(e.target.value))}
          />
        </label>
        <button onClick={() => setScale(1)}>Reset</button>
      </div>

      <p className="caption">
        Try it: click the <strong>closest</strong> galaxy to YOU, then click a galaxy in
        the far corner. Watch the yellow numbers. Same amount of time passes, but the
        far galaxy moved way more space — so to anyone watching from YOU, it looks like
        it's running away faster. And here's the wild part: every galaxy sees the
        universe this way. Tap a different galaxy and it looks like the center too!
      </p>
    </div>
  )
}
