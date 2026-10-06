import type { ReactNode } from 'react'
import styles from './Card.module.css'

type CardProps = {
  children: ReactNode
  padding?: 'sm' | 'md' | 'lg'
  header?: ReactNode
}

export function Card({ children, padding = 'md', header }: CardProps) {
  return (
    <div className={`${styles.card} ${styles[padding]}`}>
      {header && <div className={styles.header}>{header}</div>}
      <div className={styles.body}>{children}</div>
    </div>
  )
}
