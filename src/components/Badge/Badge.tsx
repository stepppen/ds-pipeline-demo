import type { ReactNode } from 'react'
import styles from './Badge.module.css'

type BadgeProps = {
  children: ReactNode
  variant?: 'solid' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

export function Badge({ children, variant = 'solid', size = 'md' }: BadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[variant]} ${styles[size]}`}>
      {children}
    </span>
  )
}