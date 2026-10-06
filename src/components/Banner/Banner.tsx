import type { ReactNode } from 'react'
import { Button } from '../Button/Button'
import styles from './Banner.module.css'

type BannerProps = {
  tone?: 'info' | 'success' | 'warning' | 'danger'
  title?: string
  /** Leading icon, tinted with the tone colour, e.g. <Icon name="alert-circle" />. */
  icon?: ReactNode
  children?: ReactNode
  action?: ReactNode
  onDismiss?: () => void
}

export function Banner({ tone = 'info', title, icon, children, action, onDismiss }: BannerProps) {
  return (
    <div role={tone === 'danger' ? 'alert' : 'status'} className={`${styles.banner} ${styles[tone]}`}>
      {icon && <span className={styles.icon}>{icon}</span>}
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
