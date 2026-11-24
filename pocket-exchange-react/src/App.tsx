import { useEffect, useRef, useState } from 'react'
import './App.css'
import { formatMoney } from './format'
import { HistoryList } from './HistoryList'
import { CURRENCIES, loadRates } from './rates'
import {
  loadHistory,
  loadLastConversion,
  saveHistory,
  saveLastConversion,
} from './storage'
import type { Conversion, Status, Currency } from './types'

const MAX_HISTORY = 20

function App() {
  const [history, setHistory] = useState<Conversion[]>(loadHistory)
  const [amount, setAmount] = useState('100')
  const [from, setFrom] = useState<Currency>('EUR')
  const [to, setTo] = useState<Currency>('EGP')
  const [lastConversion, setLastConversion] = useState<Conversion | null>(loadLastConversion)
  const [filter, setFilter] = useState<Currency | 'all'>('all')
  const [rates, setRates] = useState<Record<Currency, number> | null>(null)
  const [message, setMessage] = useState('')
  // Next unique id; continues after the highest id loaded from storage.
  const nextId = useRef(history.reduce((max, c) => Math.max(max, c.id), 0) + 1)

  useEffect(() => {
    let ignore = false
    loadRates().then((loaded) => {
      if (!ignore) setRates(loaded)
    })
    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    saveHistory(history)
  }, [history])

  useEffect(() => {
    saveLastConversion(lastConversion)
  }, [lastConversion])

  // Derived during render, not stored in state.
  const status: Status = rates === null ? 'loading' : 'ready'
  const currencies = rates === null ? [] : CURRENCIES

  const visibleHistory =
    filter === 'all'
      ? history
      : history.filter((c) => c.from === filter || c.to === filter)

  const totalsByCurrency: Record<string, number> = {}
  for (const c of visibleHistory) {
    totalsByCurrency[c.to] = (totalsByCurrency[c.to] ?? 0) + c.result
  }
  const totalsText =
    Object.entries(totalsByCurrency)
      .map(([currency, total]) => `${formatMoney(total)} ${currency}`)
      .join(' | ') || 'none'

  const handleConvert = () => {
    if (rates === null) return
    const amt = Number(amount)
    if (amount.trim() === '' || !Number.isFinite(amt) || amt <= 0) {
      setMessage('Enter an amount greater than 0.')
      return
    }
    setMessage('')
    const computed = from === to ? amt : (amt / rates[from]) * rates[to]

    const conversion: Conversion = {
      id: nextId.current++,
      date: new Date().toISOString(),
      from,
      to,
      amount: amt,
      result: computed,
    }
    setLastConversion(conversion)
    // Newest first, keep only the latest 20 (slice copies; it doesn't mutate)
    setHistory((prev) => [conversion, ...prev].slice(0, MAX_HISTORY))
  }

  const handleClear = () => setHistory([])

  const handleDelete = (id: number) => {
    setHistory((prev) => prev.filter((conversion) => conversion.id !== id))
  }
  
  const swapCurrencies = () => {
    setFrom(to)
    setTo(from)
  }

  return (
    <main>
      <h1>Pocket Exchange</h1>

      {status === 'loading' && <p>Loading rates...</p>}

      <section id="converter">
        <div>
          <label htmlFor="amount">Amount</label>{' '}
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="from">From</label>{' '}
          <select id="from" value={from} onChange={(e) => setFrom(e.target.value as Currency)}>
            {currencies.map((code) => (
              <option key={code} value={code}>{code}</option>
            ))}
          </select>{' '}
          <button
            id="swap"
            type="button"
            aria-label="Swap currencies"
            onClick={swapCurrencies}
          >
            &harr;
          </button>{' '}
          <label htmlFor="to">To</label>{' '}
          <select id="to" value={to} onChange={(e) => setTo(e.target.value as Currency)}>
            {currencies.map((code) => (
              <option key={code} value={code}>{code}</option>
            ))}
          </select>
        </div>
        <button id="convert" type="button" onClick={handleConvert} disabled={status === 'loading'}>
          Convert
        </button>
        
        <p id="message" role="alert">{message}</p>
        <p id="result">
          {lastConversion !== null
            ? `${lastConversion.amount.toLocaleString('en-US')} ${lastConversion.from} -> ${formatMoney(lastConversion.result)} ${lastConversion.to}`
            : 'No conversion yet'}
        </p>
        
      </section>

      <section id="history">
        <div>
          <h2>History</h2>
          <label htmlFor="filter">Filter</label>{' '}
          <select id="filter" value={filter} onChange={(e) => setFilter(e.target.value as Currency | 'all')}>
            <option value="all">All</option>
            {currencies.map((code) => (
              <option key={code} value={code}>{code}</option>
            ))}
          </select>
        </div>

        <HistoryList items={visibleHistory} onDelete={handleDelete} />

        <p id="totals">Totals: {totalsText}</p>
        <button id="clear" type="button" onClick={handleClear}>Clear all</button>
      </section>
    </main>
  )
}

export default App

