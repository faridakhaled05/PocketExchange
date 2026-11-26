import { HistoryItem } from './HistoryItem'
import type { Conversion } from './types'

interface HistoryListProps {
  items: Conversion[]
  onDelete: (id: number) => void
}

export function HistoryList({ items, onDelete }: HistoryListProps) {

  if (items.length === 0) {
    return <p>No conversions yet.</p>
  }

  return (
    <ul id="history-list">
      {items.map((item) => (
        <HistoryItem key={item.id} item={item} onDelete={onDelete} />
      ))} 
    </ul>
  )
}
