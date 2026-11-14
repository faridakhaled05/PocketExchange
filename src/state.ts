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