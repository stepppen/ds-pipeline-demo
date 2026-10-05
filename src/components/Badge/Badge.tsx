import type { ReactNode } from 'react'
import styles from './Badge.module.css'

type BadgeProps = {
  children: ReactNode
  variant?: 'solid' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  tone?: 'neutral' | 'success' | 'warning' | 'danger'
}

export function Badge({ children, variant = 'solid', size = 'md', tone = 'neutral' }: BadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[tone]} ${styles[variant]} ${styles[size]}`}>
      {children}
    </span>
  )
}
