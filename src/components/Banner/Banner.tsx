import type { ReactNode } from 'react'
import { Button } from '../Button/Button'
import styles from './Banner.module.css'

type BannerProps = {
  tone?: 'info' | 'success' | 'warning' | 'danger'
  title?: string
  children?: ReactNode
  action?: ReactNode
  onDismiss?: () => void
}

export function Banner({ tone = 'info', title, children, action, onDismiss }: BannerProps) {
  return (
    <div role={tone === 'danger' ? 'alert' : 'status'} className={`${styles.banner} ${styles[tone]}`}>
      <div className={styles.content}>
        {title && <p className={styles.title}>{title}</p>}
        {children && <div>{children}</div>}
      </div>
      {action && <div className={styles.action}>{action}</div>}
      {onDismiss && (
        <Button variant="secondary" size="sm" aria-label="Dismiss" onClick={onDismiss}>
          ×
        </Button>
      )}
    </div>
  )
}
