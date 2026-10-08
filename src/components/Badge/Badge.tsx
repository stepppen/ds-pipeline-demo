import type { ReactNode } from 'react'
import styles from './Badge.module.css'

type BadgeProps = {
  children: ReactNode
  variant?: 'solid' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  tone?: 'brand' | 'success' | 'warning' | 'danger' | 'neutral'
}

export function Badge({ children, variant = 'solid', size = 'md', tone = 'brand' }: BadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[tone]} ${styles[variant]} ${styles[size]}`}>
      {children}
    </span>
  )
}
