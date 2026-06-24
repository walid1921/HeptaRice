# HeptaRice 🍚

A Rice Water Calculator. Drag the slider, get the right amount of water.

## The ratio

- Anchor: **600g rice → 1180g water** (1:1.967)
- Rice ≤ 700g → flat **1.967**
- Rice 700g–1400g → linearly tapers from **1.967 → 1.5**
- Rice ≥ 1400g → flat **1.5**
- `water = round(ratio × rice)`

## Stack

- React 18 + Vite
- Tailwind CSS v3
- Chart.js + react-chartjs-2

## Local dev

```bash
pnpm install   # or npm / yarn
pnpm dev
```

Open http://localhost:5173.

## Build

```bash
pnpm build
```

Outputs static files to `dist/`.

## Deploy to Vercel

Zero config — Vercel auto-detects Vite.

### Option A — Vercel CLI

```bash
npm i -g vercel
vercel        # first-time link; defaults are correct
vercel --prod # deploy to production
```

### Option B — Drag-and-drop

1. `pnpm build`
2. Go to https://vercel.com/new
3. Drag the `dist/` folder onto the upload area

### Option C — Git push

Push the repo to GitHub and import it on https://vercel.com/new. Vercel detects Vite and uses:

- Build command: `vite build`
- Output directory: `dist`
- Install command: auto

No environment variables or backend required.
