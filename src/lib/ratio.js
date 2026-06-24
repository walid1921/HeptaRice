export const ANCHOR_RATIO = 1180 / 600
export const TAIL_RATIO = 1.5
export const TAPER_START = 700
export const TAPER_END = 1400

export function calcRatio(rice) {
  if (rice <= TAPER_START) return ANCHOR_RATIO
  if (rice >= TAPER_END) return TAIL_RATIO
  const t = (rice - TAPER_START) / (TAPER_END - TAPER_START)
  return ANCHOR_RATIO + t * (TAIL_RATIO - ANCHOR_RATIO)
}

export function calcWater(rice) {
  return Math.round(calcRatio(rice) * rice)
}
