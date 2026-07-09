import { useState } from 'react'
import RatioChart from './components/RatioChart.jsx'
import { calcRatio, calcWater } from './lib/ratio.js'

const PER_PERSON = 125
const EXTRA = 100
const PEOPLE_MIN = 1
const PEOPLE_MAX = 11
const CUP_FULL = 720
const CUP_MARKS = [540, 360, 180]

function measureText(ml) {
  const fullCups = Math.floor(ml / CUP_FULL)
  let rest = ml - fullCups * CUP_FULL
  const mark = CUP_MARKS.find((m) => rest >= m) ?? 0
  if (mark > 0) rest -= mark
  if (fullCups === 0 && mark === 0) return null

  const parts = []
  if (fullCups > 0) parts.push(`${fullCups}× voll`)
  if (mark > 0) parts.push(`bis ${mark}`)
  if (rest > 0) parts.push(`+${rest} ml`)
  return parts.join(' + ')
}

function riceForPeople(p) {
  return p * PER_PERSON + EXTRA
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

function CasserolePot({ water, className = '' }) {
  const FULL = 2500
  const level = Math.max(0, Math.min(1, water / FULL))
  const INNER_TOP = 42
  const INNER_BOTTOM = 112
  const INNER_HEIGHT = INNER_BOTTOM - INNER_TOP
  const offsetY = (1 - level) * INNER_HEIGHT

  const easing = 'cubic-bezier(0.4, 0, 0.2, 1)'
  const bodyPath =
    'M 24 42 H 96 V 98 Q 96 112 82 112 H 38 Q 24 112 24 98 Z'

  return (
    <svg viewBox="0 0 120 132" className={className} aria-hidden>
      <defs>
        <clipPath id="cp-interior">
          <path d={bodyPath} />
        </clipPath>
        <linearGradient id="cp-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.95" />
          <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#0369a1" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="cp-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>
        <linearGradient id="cp-rim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
        <linearGradient id="cp-shine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* drop shadow */}
      <ellipse cx="60" cy="122" rx="42" ry="3" fill="#000" opacity="0.4" />

      {/* animated steam wisps */}
      <g stroke="#94a3b8" strokeWidth="1.4" strokeLinecap="round" fill="none">
        <g opacity="0">
          <path d="M 46 30 Q 43 22 46 14 Q 49 6 46 2" />
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 8; 0 -14"
            dur="2.6s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0; 0.65; 0"
            keyTimes="0; 0.4; 1"
            dur="2.6s"
            repeatCount="indefinite"
          />
        </g>
        <g opacity="0">
          <path d="M 60 28 Q 57 20 60 12 Q 63 4 60 0" />
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 8; 0 -14"
            dur="2.6s"
            begin="0.9s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0; 0.7; 0"
            keyTimes="0; 0.4; 1"
            dur="2.6s"
            begin="0.9s"
            repeatCount="indefinite"
          />
        </g>
        <g opacity="0">
          <path d="M 74 30 Q 71 22 74 14 Q 77 6 74 2" />
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 8; 0 -14"
            dur="2.6s"
            begin="1.7s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0; 0.6; 0"
            keyTimes="0; 0.4; 1"
            dur="2.6s"
            begin="1.7s"
            repeatCount="indefinite"
          />
        </g>
      </g>

      {/* D-shape handles (behind body) */}
      <path
        d="M 24 64 Q 8 64 8 76 Q 8 88 24 88"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M 96 64 Q 112 64 112 76 Q 112 88 96 88"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* pot body */}
      <path d={bodyPath} fill="url(#cp-body)" />

      {/* water clipped to interior */}
      <g clipPath="url(#cp-interior)">
        <rect
          x="24"
          y={INNER_TOP}
          width="72"
          height={INNER_HEIGHT}
          fill="url(#cp-water)"
          style={{
            transform: `translateY(${offsetY}px)`,
            transition: `transform 700ms ${easing}`,
          }}
        />
        <ellipse
          cx="60"
          cy={INNER_TOP + 1.6}
          rx="30"
          ry="1.4"
          fill="#e0f2fe"
          opacity="0.65"
          style={{
            transform: `translateY(${offsetY}px)`,
            transition: `transform 700ms ${easing}`,
          }}
        />
      </g>

      {/* glossy side highlight inside pot */}
      <path
        d="M 28 46 Q 28 76 28 104"
        stroke="url(#cp-shine)"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />

      {/* pot outline */}
      <path
        d={bodyPath}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* rim — wider lip with gradient */}
      <rect x="18" y="38.5" width="84" height="5" rx="2.5" fill="url(#cp-rim)" />
      <line x1="20" y1="38.5" x2="100" y2="38.5" stroke="#f1f5f9" strokeWidth="0.8" opacity="0.6" />
    </svg>
  )
}

function UsersIcon({ className = '' }) {
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
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

export default function App() {
  const [people, setPeople] = useState(4)
  const [floats, setFloats] = useState([])

  const rice = riceForPeople(people)
  const water = calcWater(rice)
  const ratio = calcRatio(rice)
  const basmatiWater = Math.round(water / 2)
  const waterCups = measureText(water)
  const basmatiCups = measureText(basmatiWater)

  const updatePeople = (p) => {
    const next = Math.max(PEOPLE_MIN, Math.min(PEOPLE_MAX, p))
    if (next === people) return
    const isAdd = next > people
    setPeople(next)
    if (isAdd) {
      const id = `${Date.now()}-${Math.random()}`
      setFloats((arr) => [...arr, id])
      setTimeout(() => {
        setFloats((arr) => arr.filter((x) => x !== id))
      }, 900)
    }
  }

  return (
    <div className="min-h-full">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-10">
        <header className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">HeptaRice</h1>
        </header>

        <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/70 to-slate-900/30 backdrop-blur p-5 sm:p-7 mb-4 sm:mb-6">
          <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-48 bg-rose-500/10 blur-3xl rounded-full" />

          <div className="relative">
            <div className="flex items-center justify-between mb-5 sm:mb-6 gap-3">
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <UsersIcon className="w-4 h-4 text-rose-300/80" />
                Portionen
              </label>
              <div className="text-[11px] sm:text-xs text-slate-500 tabular-nums">
                {PEOPLE_MIN}–{PEOPLE_MAX}
              </div>
            </div>

            <div className="flex items-center justify-center gap-5 sm:gap-8">
              <button
                type="button"
                aria-label="Portionen verringern"
                onClick={() => updatePeople(people - 1)}
                disabled={people <= PEOPLE_MIN}
                className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-slate-700 bg-gradient-to-b from-slate-800 to-slate-900 text-2xl text-slate-300 shadow-inner shadow-black/40 hover:border-rose-400/50 hover:text-white hover:shadow-[0_0_24px_-6px_rgba(244,114,182,0.5)] active:scale-95 disabled:opacity-30 disabled:hover:border-slate-700 disabled:hover:shadow-inner disabled:hover:shadow-black/40 disabled:hover:text-slate-300 disabled:cursor-not-allowed transition-all duration-150"
              >
                −
              </button>

              <div className="flex flex-col items-center min-w-[5rem]">
                <span className="text-6xl sm:text-7xl font-semibold leading-none tabular-nums bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
                  {people}
                </span>
                <span className="mt-1.5 text-[10px] sm:text-xs text-slate-400 uppercase tracking-[0.18em]">
                  {people === 1 ? 'Person' : 'Personen'}
                </span>
              </div>

              <div className="relative">
                <button
                  type="button"
                  aria-label="Portionen erhöhen"
                  onClick={() => updatePeople(people + 1)}
                  disabled={people >= PEOPLE_MAX}
                  className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-slate-700 bg-gradient-to-b from-slate-800 to-slate-900 text-2xl text-slate-300 shadow-inner shadow-black/40 hover:border-rose-400/50 hover:text-white hover:shadow-[0_0_24px_-6px_rgba(244,114,182,0.5)] active:scale-95 disabled:opacity-30 disabled:hover:border-slate-700 disabled:hover:shadow-inner disabled:hover:shadow-black/40 disabled:hover:text-slate-300 disabled:cursor-not-allowed transition-all duration-150"
                >
                  +
                </button>
                {floats.map((id) => (
                  <span
                    key={id}
                    className="rice-floater pointer-events-none absolute left-1/2 top-0"
                  >
                    <WheatIcon className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300 drop-shadow-[0_0_6px_rgba(252,211,77,0.5)]" />
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-800/80">
              <div className="flex items-baseline justify-center gap-2 tabular-nums">
                <WheatIcon className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300 self-center" />
                <span className="text-2xl sm:text-3xl font-semibold text-slate-100">{rice}</span>
                <span className="text-base sm:text-lg font-medium text-slate-400 -ml-1">g</span>
                <span className="ml-1 text-sm sm:text-base text-slate-500">Reis</span>
              </div>

              <p className="mt-2.5 text-center text-[11px] sm:text-xs text-slate-500">
                {PER_PERSON}g pro Person
                <span className="mx-1.5 text-slate-700">·</span>
                +{EXTRA}g für das Angebrannte am Boden
              </p>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden rounded-2xl border border-sky-500/30 bg-gradient-to-br from-slate-900/70 to-slate-900/30 backdrop-blur p-5 sm:p-7 mb-4 sm:mb-6">
          <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-48 bg-sky-500/15 blur-3xl rounded-full" />

          <div className="relative">
            <div className="grid grid-cols-[1fr_auto] gap-4 sm:gap-6 items-start">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-[11px] sm:text-xs uppercase tracking-[0.18em] text-slate-400">
                  <DropletIcon className="w-3.5 h-3.5 text-sky-400" />
                  Wasser
                </div>
                <div className="mt-2 sm:mt-3 flex items-baseline gap-1.5 tabular-nums">
                  <span className="text-5xl sm:text-6xl font-semibold leading-none bg-gradient-to-b from-sky-200 to-sky-500 bg-clip-text text-transparent">
                    {water}
                  </span>
                  <span className="text-2xl sm:text-3xl font-medium text-sky-400/70">ml</span>
                </div>
                {waterCups && (
                  <div className="mt-1 text-xs sm:text-sm text-sky-300/80 tabular-nums">
                    {waterCups}
                  </div>
                )}
                <div className="mt-3 text-xs sm:text-sm text-slate-400 tabular-nums">
                  Basmati:{' '}
                  <span className="text-slate-200 font-medium">{basmatiWater} ml</span>
                  {basmatiCups && (
                    <span className="text-slate-500"> · {basmatiCups}</span>
                  )}
                </div>
              </div>

              <CasserolePot
                water={water}
                className="w-28 sm:w-40 text-slate-400 shrink-0"
              />
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-baseline justify-between gap-3 text-xs sm:text-sm text-slate-400 tabular-nums">
              <span>
                Verhältnis{' '}
                <span className="text-slate-100 font-medium">1:{ratio.toFixed(3)}</span>
              </span>
              <span className="text-slate-500">Tasse: 180·360·540·720 ml</span>
            </div>
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
