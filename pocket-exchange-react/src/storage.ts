import type { Conversion } from './types'

const HISTORY_KEY = 'pocket-exchange:history'
const LAST_KEY = 'pocket-exchange:last'

export function saveHistory(history: Conversion[]): void {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
}

export function loadHistory(): Conversion[] {
  const raw = localStorage.getItem(HISTORY_KEY)
  if (raw === null) return []
  try {
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as Conversion[]) : []
  } catch {
    return []
  }
}

export function saveLastConversion(conversion: Conversion | null): void {
  if (conversion === null) {
    localStorage.removeItem(LAST_KEY)
  } else {
    localStorage.setItem(LAST_KEY, JSON.stringify(conversion))
  }
}

export function loadLastConversion(): Conversion | null {
  const raw = localStorage.getItem(LAST_KEY)
  if (raw === null) return null
  try {
    const parsed: unknown = JSON.parse(raw)
    return typeof parsed === 'object' && parsed !== null
      ? (parsed as Conversion)
      : null
  } catch {
    return null
  }
}
