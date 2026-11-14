import type { AppState, Conversion } from "./types";
export function convert(amount: number, from: string, to: string, rates: Record<string, number>): number {
  if (from === to) return amount;
  const fromRate = rates[from];
  const toRate = rates[to];
  
  return (amount / fromRate) * toRate;
}
// Four cases to reject, each with its own message: empty, non-number, zero, negative.
export function validateAmount(raw: string): string | null{
    if (raw.trim() === '') return 'Amount is required';
    const amount = Number(raw);
    if (!Number.isFinite(amount)) return 'Amount must be a finite number';
    if (amount === 0 || amount < 0) return 'Amount must be a positive number';
    return null;

}

export function swapCurrencies(state: AppState): AppState {
    return {
        ...state,
        from: state.to,
        to: state.from,
    };
}
// new item at the top, keep only the latest 20.
export function addConversion(state: AppState, conversion: Conversion): AppState { 
  return {
    ...state,
    history: [conversion, ...state.history].slice(0, 20),
  };
} 
export function removeConversion(state: AppState, id: number): AppState {
  return {
    ...state,
    history: state.history.filter(c => c.id !== id),
  };
}

export  function clearHistory(state: AppState): AppState {
  return {
    ...state,
    history: [],
  };
}

export function getVisibleHistory(state: AppState): Conversion[] {
  if (state.filter === null) return state.history;
  return state.history.filter(c => c.from === state.filter || c.to === state.filter);
}   

// an object with the total converted into each currency, for example { EGP: 7696.74, USD: 25.32 }..
export function getTotals(state: AppState): Record<string, number> {
  return getVisibleHistory(state).
  reduce<Record<string, number>>((totals, conversion) => {
  totals[conversion.to] = (totals[conversion.to] ?? 0) + conversion.result;
  return totals;
}, {});
}
export function createIdGenerator(start: number): () => number {
  // let: the counter must advance on every call
  let current = start;
  return () => current++;
}