// Smart data extractors for AI-generated structured_data JSON.
// Each function scans all values in the object for the target shape,
// so it works regardless of the AI's chosen field names.

export interface NameValue { name: string; value: number }
export interface BarItem   { label: string; value: number; max?: number }

const NAME_KEYS  = ['name', 'segment', 'group', 'type', 'label', 'category', 'tier', 'level', 'feature', 'aspect', 'dimension', 'axis', 'capability', 'item', 'pain', 'need', 'city', 'region', 'channel']
const PCT_KEYS   = ['proportion', 'percent', 'ratio', 'share', 'percentage', 'pct', 'rate', 'weight', 'distribution']
const SCORE_KEYS = ['score', 'value', 'rating', 'level', 'point', 'index', 'severity', 'priority', 'importance', 'strength', 'weakness']

function matchKey(k: string, candidates: string[]): boolean {
  const lower = k.toLowerCase()
  return candidates.some(c => lower.includes(c))
}

function parseNumber(v: unknown): number {
  if (typeof v === 'number') return v
  const s = String(v).replace(/[%约~≈]/g, '').trim()
  return parseFloat(s) || 0
}

/** Find an array of objects with a name + percentage field → donut chart */
export function extractSegments(data: Record<string, unknown>): NameValue[] | null {
  for (const val of Object.values(data)) {
    if (!Array.isArray(val) || val.length < 2) continue
    const items = val as Record<string, unknown>[]
    if (typeof items[0] !== 'object' || items[0] === null) continue

    const keys = Object.keys(items[0] as object)
    const nameKey  = keys.find(k => matchKey(k, NAME_KEYS))
    const pctKey   = keys.find(k => matchKey(k, PCT_KEYS))
    if (!nameKey || !pctKey) continue

    const result = items.map(item => ({
      name:  String((item as Record<string, unknown>)[nameKey]),
      value: parseNumber((item as Record<string, unknown>)[pctKey]),
    })).filter(i => i.value > 0)

    if (result.length >= 2) return result
  }
  return null
}

/** Find an array of objects with a name + numeric score field → radar / bar chart */
export function extractScores(data: Record<string, unknown>): NameValue[] | null {
  for (const val of Object.values(data)) {
    if (!Array.isArray(val) || val.length < 3) continue
    const items = val as Record<string, unknown>[]
    if (typeof items[0] !== 'object' || items[0] === null) continue

    const keys = Object.keys(items[0] as object)
    const nameKey  = keys.find(k => matchKey(k, NAME_KEYS))
    const scoreKey = keys.find(k => matchKey(k, SCORE_KEYS))
    if (!nameKey || !scoreKey) continue

    const result = items.map(item => ({
      name:  String((item as Record<string, unknown>)[nameKey]),
      value: parseNumber((item as Record<string, unknown>)[scoreKey]),
    })).filter(i => i.value > 0)

    if (result.length >= 3) return result
  }
  return null
}

/** Find an array of objects with a name field (+ optional severity/value) → ranked list */
export function extractRankedItems(data: Record<string, unknown>): BarItem[] | null {
  // First try with score
  const withScore = extractScores(data)
  if (withScore) return withScore.map(i => ({ label: i.name, value: i.value }))

  // Then try any array of objects with at least a name key
  for (const val of Object.values(data)) {
    if (!Array.isArray(val) || val.length < 2) continue
    const items = val as Record<string, unknown>[]
    if (typeof items[0] !== 'object' || items[0] === null) continue

    const keys = Object.keys(items[0] as object)
    const nameKey = keys.find(k => matchKey(k, NAME_KEYS))
    if (!nameKey) continue

    return items.slice(0, 8).map((item, i) => ({
      label: String((item as Record<string, unknown>)[nameKey]),
      value: 10 - i, // descending order proxy
    }))
  }
  return null
}

/** Try to find a scalar value by scanning for total_users / scale / mau etc. */
export function extractScalarStat(data: Record<string, unknown>): { label: string; value: string } | null {
  const STAT_KEYS = ['total_users', 'mau', 'dau', 'scale', 'user_count', 'users', 'total', 'count']
  for (const [k, v] of Object.entries(data)) {
    if (matchKey(k, STAT_KEYS) && typeof v === 'object' && v !== null) {
      const obj = v as Record<string, unknown>
      for (const [ik, iv] of Object.entries(obj)) {
        if (matchKey(ik, ['total', 'count', 'mau', 'dau', 'users', 'size', 'number'])) {
          return { label: ik.replace(/_/g, ' ').toUpperCase(), value: String(iv) }
        }
      }
    }
    if (matchKey(k, STAT_KEYS) && (typeof v === 'string' || typeof v === 'number')) {
      return { label: k.replace(/_/g, ' ').toUpperCase(), value: String(v) }
    }
  }
  return null
}

/** Extract a city / geographic distribution array → progress bars */
export function extractDistribution(data: Record<string, unknown>): NameValue[] | null {
  const GEO_KEYS = ['city', 'region', 'geo', 'location', 'area', 'distribution', 'channel', 'platform', 'tier']
  for (const [k, v] of Object.entries(data)) {
    if (!matchKey(k, GEO_KEYS)) continue
    if (Array.isArray(v) && v.length >= 2) {
      const items = v as Record<string, unknown>[]
      if (typeof items[0] !== 'object' || items[0] === null) continue
      const keys = Object.keys(items[0] as object)
      const nameKey = keys.find(kk => matchKey(kk, NAME_KEYS))
      const pctKey  = keys.find(kk => matchKey(kk, [...PCT_KEYS, ...SCORE_KEYS]))
      if (nameKey && pctKey) {
        return items.map(item => ({
          name:  String((item as Record<string, unknown>)[nameKey]),
          value: parseNumber((item as Record<string, unknown>)[pctKey]),
        }))
      }
    }
  }
  return null
}

export const CHART_COLORS = ['#5E5CE6', '#A5A3F5', '#D4D3FC', '#E0E0F0', '#C8C8E0']
