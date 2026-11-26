export const RATES = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  SAR: 3.75,
  AED: 3.67,
  EGP: 48.5,
} as const

export type Currency = keyof typeof RATES

export const CURRENCIES = Object.keys(RATES) as Currency[]

export function loadRates(): Promise<Record<Currency, number>> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(RATES), 1000)
  })
}
