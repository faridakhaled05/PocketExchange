import type { Conversion } from './types'

const HISTORY_KEY = 'pocket-exchange:history'

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
