import { formatMoney } from './format'
import type { Conversion } from './types'

interface HistoryItemProps {
  item: Conversion
  onDelete: (id: number) => void
}

export function HistoryItem({ item, onDelete }: HistoryItemProps) {
  return (
    <li className="history-item">
      <span>
        {item.amount.toLocaleString('en-US')} {item.from} {'->'}{' '}
        {formatMoney(item.result)} {item.to}
      </span>
      <button type="button" data-id={item.id} onClick={() => onDelete(item.id)}>
        Delete
      </button>
    </li>
  )
}
