import { useEffect, useMemo, useRef, useState } from 'react'

const GRID = 5
const SPACING = 56

function buildGrid() {
  const out = []
  for (let row = 0; row < GRID; row++) {
    for (let col = 0; col < GRID; col++) {
      out.push({
        id: row * GRID + col,
        col, row,
        x: (col - (GRID - 1) / 2) * SPACING,
        y: (row - (GRID - 1) / 2) * SPACING,
        hue: (col * 47 + row * 83) % 360,
      })
    }
  }
  return out
}

const ANIM_MS = 2200

export default function ExpandingUniverse() {
  const [scale, setScale] = useState(1)
  const [animating, setAnimating] = useState(false)
  const [refId, setRefId] = useState(12)

  const scaleRef = useRef(1)
  const rafRef = useRef(null)

  const galaxies = useMemo(buildGrid, [])
  const ref = galaxies.find(g => g.id === refId) ?? galaxies[12]

  // Animate smoothly to a target scale so kids literally see far galaxies
  // zoom away while close ones crawl.
  function animateTo(target) {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    const from = scaleRef.current
    const start = performance.now()
    setAnimating(true)
    const tick = now => {
      const t = Math.min(1, (now - start) / ANIM_MS)
      const next = from + (target - from) * t
      scaleRef.current = next
      setScale(next)
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setAnimating(false)
      }
    }
    rafRef.current = requestAnimationFrame(tick)
  }

  function handleSlider(v) {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    setAnimating(false)
    scaleRef.current = v
    setScale(v)
  }

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }, [])

  const maxUnits = Math.hypot(GRID - 1, GRID - 1)

  const positioned = galaxies.map(g => {
    const du = Math.hypot(g.col - ref.col, g.row - ref.row)
    return {
      ...g,
      x: ref.x + (g.x - ref.x) * scale,
      y: ref.y + (g.y - ref.y) * scale,
      origX: g.x,
      origY: g.y,
      unitsFromRef: du,
    }
  })

  // For labels: pick one close, one middle, one far.
  const sorted = positioned.filter(g => g.id !== ref.id)
                           .sort((a, b) => a.unitsFromRef - b.unitsFromRef)
  const labelGalaxies = [
    sorted[0],
    sorted[Math.floor(sorted.length / 2)],
    sorted[sorted.length - 1],
  ].filter(Boolean)

  return (
    <div className="panel">
      <h2>The Universe Is Stretching!</h2>
      <p className="lead">
        Pick any galaxy to stand on. Then press <strong>Double the universe</strong> and
        <em> watch carefully</em>. The galaxies in the far corners <em>zoom</em> away
        while nearby ones barely drift. Same amount of time passes for all of them —
        but far galaxies had to travel farther, so they look faster. That's Hubble's
        Law.
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

          {/* Dashed trail from start position to current position. */}
          {positioned.map(g => {
            if (g.id === ref.id) return null
            return (
              <line
                key={'trail-' + g.id}
                className="galaxy-trail"
                x1={g.origX} y1={g.origY}
                x2={g.x} y2={g.y}
                stroke={`hsl(${g.hue},90%,75%)`}
                strokeWidth={1.5}
              />
            )
          })}

          {/* Velocity arrows on ALL galaxies — length ∝ distance from ref.
              Thicker for labeled ones so the comparison pops. */}
          {scale > 1.02 && positioned.map(g => {
            if (g.id === ref.id) return null
            const dx = g.x - g.origX
            const dy = g.y - g.origY
            // Draw arrow from current pos in direction of motion, length = step.
            const len = Math.hypot(dx, dy)
            if (len < 2) return null
            const isLabeled = labelGalaxies.some(l => l.id === g.id)
            return (
              <line
                key={'vel-' + g.id}
                x1={g.x} y1={g.y}
                x2={g.x + dx * 0.45}
                y2={g.y + dy * 0.45}
                stroke="#ffe6a8"
                strokeWidth={isLabeled ? 3 : 1.4}
                strokeOpacity={isLabeled ? 1 : 0.55}
                markerEnd="url(#arrow2)"
              />
            )
          })}

          {/* Galaxies */}
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

          <text x={ref.x} y={ref.y - 22} textAnchor="middle"
                fill="#fff" fontSize="13" fontWeight="800">
            YOU
          </text>

          {/* Before → After distance labels on the three sample galaxies. */}
          {labelGalaxies.map(g => {
            const before = g.unitsFromRef.toFixed(1)
            const after = (g.unitsFromRef * scale).toFixed(1)
            return (
              <g key={'lab-' + g.id}>
                <rect
                  x={g.x - 32} y={g.y + 14}
                  width="64" height="20" rx="10"
                  fill="#0b0b2a" stroke="#ffe6a8" strokeWidth="1"
                />
                <text
                  x={g.x} y={g.y + 28}
                  textAnchor="middle" fill="#ffe6a8"
                  fontSize="11" fontWeight="700"
                >
                  {before} → {after}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      <div className="controls">
        <button
          disabled={animating}
          onClick={() => animateTo(Math.min(3, +(scaleRef.current * 2).toFixed(2)))}
        >
          {animating ? 'Expanding…' : 'Double the universe!'}
        </button>
        <label>
          Or drag to stretch (scale: {scale.toFixed(2)}×)
          <input
            type="range" min="1" max="3" step="0.01"
            value={scale}
            onChange={e => handleSlider(parseFloat(e.target.value))}
          />
        </label>
        <button onClick={() => { handleSlider(1) }}>Reset</button>
      </div>

      <p className="caption">
        Watch the <strong>yellow arrows</strong>: the far galaxy's arrow is huge, the
        near galaxy's arrow is tiny. Each one shows how much space the galaxy covered
        in the <em>same</em> amount of time. Bigger arrow = faster, and the arrow gets
        bigger the farther away the galaxy started. Try clicking a galaxy in the
        corner — from <em>its</em> point of view, YOU are the one zooming away!
      </p>
    </div>
  )
}
