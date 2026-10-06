import type { ReactNode } from 'react'
import styles from './ListRow.module.css'

type ListRowProps = {
  title: ReactNode
  subtitle?: ReactNode
  leading?: ReactNode
  trailing?: ReactNode
  onClick?: () => void
  selected?: boolean
}

export function ListRow({ title, subtitle, leading, trailing, onClick, selected = false }: ListRowProps) {
  const content = (
    <>
      {leading && <span className={styles.leading}>{leading}</span>}
      <span className={styles.text}>
        <span className={styles.title}>{title}</span>
        {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
      </span>
      {trailing && <span className={styles.trailing}>{trailing}</span>}
    </>
  )

  if (onClick) {
    return (
      <button
        type="button"
        className={`${styles.row} ${styles.interactive}`}
        aria-current={selected || undefined}
        onClick={onClick}
      >
        {content}
      </button>
    )
  }

  return (
    <div className={styles.row} aria-current={selected || undefined}>
      {content}
    </div>
  )
}
