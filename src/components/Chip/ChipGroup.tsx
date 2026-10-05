import type { ReactNode } from 'react'
import styles from './Chip.module.css'

type ChipGroupProps = {
  label: string
  children: ReactNode
}

export function ChipGroup({ label, children }: ChipGroupProps) {
  return (
    <div role="group" aria-label={label} className={styles.group}>
      {children}
    </div>
  )
}
