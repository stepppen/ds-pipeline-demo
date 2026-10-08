import type { ReactNode } from 'react'
import styles from './Card.module.css'

type CardProps = {
  children: ReactNode
  padding?: 'sm' | 'md' | 'lg'
  /** Free-form header above a divider. For a plain title, prefer `title`. */
  header?: ReactNode
  /** Title shown as a heading, without a divider. */
  title?: string
  /** Shown after the title in brackets, e.g. "CAVE (2)". */
  count?: number
  /** Heading level for `title`; it's styled the same at either level. */
  titleLevel?: 2 | 3
  /** Right-aligned next to the title, e.g. an IconButton. */
  action?: ReactNode
}

export function Card({ children, padding = 'md', header, title, count, titleLevel = 2, action }: CardProps) {
  const TitleTag = `h${titleLevel}` as const
  return (
    <div className={`${styles.card} ${styles[padding]}`}>
      {(title || action) && (
        <div className={styles.titleRow}>
          {title && (
            <TitleTag className={styles.title}>
              {title}
              {count !== undefined && ` (${count})`}
            </TitleTag>
          )}
          {action && <div className={styles.action}>{action}</div>}
        </div>
      )}
      {header && <div className={styles.header}>{header}</div>}
      <div className={styles.body}>{children}</div>
    </div>
  )
}
