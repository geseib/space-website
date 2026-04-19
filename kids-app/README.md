# Space Explorer — Kids App

A React + Vite single-page app with bright, kid-friendly space lessons.

## Tabs

- **Expanding Universe** — Drag the slider to "blow up" the universe. Dashed
  trails show that galaxies which started farther from YOU travel farther in
  the same amount of time, which is why far galaxies look like they're zooming
  away fastest (Hubble's Law).
- **How Fast Are You?** — A stacked list of motions, each adding more speed:
  spinning with Earth → orbiting the Sun → riding the Sun around the Milky Way
  → drifting through the universe. A running total shows kids they're moving
  millions of km/h even while sitting still.
- **Solar System Scale** — Size comparison (with a "fair view" and a "true-size
  view") plus a true-distance strip placing planets on an accurate timeline of
  how far they sit from the Sun. Click any planet for a fun fact.
- **More Soon…** — Placeholder tab to hint at future lessons.

## Dev

```bash
npm install
npm run dev      # starts Vite dev server
npm run build    # produces dist/
npm run preview  # serve the built app locally
```

## Adding another tab

Open `src/App.jsx`, add a new entry to the `TABS` array with an `id`, `label`,
and `color`, then render the component for your new `id` in the `<main>`
section. The tab bar and styling handle themselves.
