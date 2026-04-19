// Real data — radius in km, orbit distance from Sun in million km.
// The Sun is included for the size chart; it is not placed on the distance strip.
export const SUN = {
  id: 'sun',
  name: 'Sun',
  radiusKm: 696340,
  distanceMkm: 0,
  color: '#ffd166',
  glow: '#ffb74d',
  funFact: "A million Earths could fit inside the Sun.",
}

export const PLANETS = [
  {
    id: 'mercury',
    name: 'Mercury',
    radiusKm: 2440,
    distanceMkm: 57.9,
    color: '#b3b3b3',
    funFact: 'Closest to the Sun and has no atmosphere to trap heat.',
  },
  {
    id: 'venus',
    name: 'Venus',
    radiusKm: 6052,
    distanceMkm: 108.2,
    color: '#e8c07d',
    funFact: 'The hottest planet — even hotter than Mercury!',
  },
  {
    id: 'earth',
    name: 'Earth',
    radiusKm: 6371,
    distanceMkm: 149.6,
    color: '#4ba3ff',
    funFact: 'The only known planet with life. That means you!',
  },
  {
    id: 'mars',
    name: 'Mars',
    radiusKm: 3390,
    distanceMkm: 227.9,
    color: '#e06543',
    funFact: 'The Red Planet. Home to the biggest volcano in the solar system.',
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    radiusKm: 69911,
    distanceMkm: 778.5,
    color: '#d9a066',
    funFact: 'A giant ball of gas with a storm bigger than Earth.',
  },
  {
    id: 'saturn',
    name: 'Saturn',
    radiusKm: 58232,
    distanceMkm: 1433.5,
    color: '#e8d49c',
    funFact: 'Famous for its beautiful icy rings.',
  },
  {
    id: 'uranus',
    name: 'Uranus',
    radiusKm: 25362,
    distanceMkm: 2872.5,
    color: '#8ed6e0',
    funFact: 'Tipped on its side — it rolls around the Sun!',
  },
  {
    id: 'neptune',
    name: 'Neptune',
    radiusKm: 24622,
    distanceMkm: 4495.1,
    color: '#4062bb',
    funFact: 'Windiest planet, with storms over 2,000 km/h.',
  },
]
