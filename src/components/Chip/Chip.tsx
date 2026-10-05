import type { ReactNode } from 'react'
import styles from './Chip.module.css'

type ChipProps = {
  children: ReactNode
  selected?: boolean
  onClick?: () => void
  count?: number
  disabled?: boolean
}

export function Chip({ children, selected = false, onClick, count, disabled = false }: ChipProps) {
  return (
    <button type="button" className={styles.chip} aria-pressed={selected} disabled={disabled} onClick={onClick}>
      <span>{children}</span>
      {count !== undefined && <span className={styles.count}>{count}</span>}
    </button>
  )
}
