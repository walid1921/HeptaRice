import { useEffect, useState } from 'react'
import RatioChart from './components/RatioChart.jsx'
import { calcRatio, calcWater } from './lib/ratio.js'

const MIN = 100
const MAX = 1500
const STEP = 10

function clamp(n) {
  if (Number.isNaN(n)) return MIN
  return Math.min(MAX, Math.max(MIN, Math.round(n)))
}

function WheatIcon({ className = '' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M2 22 16 8" />
      <path d="M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z" />
      <path d="M7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z" />
      <path d="M11.47 4.53 13 3l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 11l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z" />
      <path d="M11.47 17.47 13 19l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L5 19l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z" />
      <path d="M15.47 13.47 17 15l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L9 15l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z" />
      <path d="M19.47 9.47 21 11l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L13 11l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z" />
    </svg>
  )
}

function DropletIcon({ className = '' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
    </svg>
  )
}

export default function App() {
  const [rice, setRice] = useState(600)
  const [draft, setDraft] = useState('600')

  useEffect(() => {
    setDraft(String(rice))
  }, [rice])

  const water = calcWater(rice)
  const ratio = calcRatio(rice)
  const progress = ((rice - MIN) / (MAX - MIN)) * 100

  const commitDraft = () => {
    const parsed = parseInt(draft, 10)
    setRice(clamp(parsed))
  }

  return (
    <div className="min-h-full">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-10">
        <header className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">HeptaRice</h1>
        </header>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex items-baseline justify-between mb-3 gap-3">
            <label htmlFor="rice-input" className="flex items-center gap-2 text-sm text-slate-300">
              <WheatIcon className="w-4 h-4 text-amber-300/80" />
              Rice amount
            </label>
            <div className="text-xs sm:text-sm text-slate-400 tabular-nums">
              {MIN}g – {MAX}g
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <input
              id="rice-slider"
              aria-label="Rice amount slider"
              type="range"
              min={MIN}
              max={MAX}
              step={STEP}
              value={rice}
              onChange={(e) => setRice(Number(e.target.value))}
              style={{ '--range-progress': `${progress}%` }}
              className="w-full sm:flex-1"
            />

            <div className="flex items-center self-end sm:self-auto shrink-0 rounded-lg border border-slate-700 bg-slate-950/60 focus-within:border-sky-500/60 focus-within:ring-2 focus-within:ring-sky-500/20 transition">
              <input
                id="rice-input"
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                min={MIN}
                max={MAX}
                step={STEP}
                value={draft}
                onChange={(e) => setDraft(e.target.value.replace(/[^\d]/g, ''))}
                onBlur={commitDraft}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.currentTarget.blur()
                  }
                }}
                onFocus={(e) => e.currentTarget.select()}
                className="w-16 sm:w-20 bg-transparent text-right text-lg sm:text-xl font-semibold tabular-nums py-1.5 pl-2 pr-1 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="pr-2 text-sm sm:text-base text-slate-400 select-none">g</span>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-sky-500/30 bg-slate-900/60 backdrop-blur p-4 sm:p-5 mb-4 sm:mb-6 text-sky-400">
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs uppercase tracking-wider text-slate-400">
            <DropletIcon className="w-3.5 h-3.5 text-sky-400" />
            Water
          </div>
          <div className="mt-1 sm:mt-2 text-2xl sm:text-4xl font-semibold tabular-nums">
            {water}g
          </div>
          <div className="mt-1 text-xs sm:text-sm text-slate-400 tabular-nums">
            Ratio 1:{ratio.toFixed(3)}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur p-2 sm:p-6">
          <div className="h-[280px] sm:h-[360px] lg:h-[420px]">
            <RatioChart rice={rice} />
          </div>
        </section>
      </div>
    </div>
  )
}
