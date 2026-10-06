import type { ReactNode } from 'react'
import styles from './Text.module.css'

type TextProps = {
  children: ReactNode
  size?: 'sm' | 'md'
  tone?: 'default' | 'muted'
  weight?: 'regular' | 'medium'
}

export function Text({ children, size = 'md', tone = 'default', weight = 'regular' }: TextProps) {
  return <p className={`${styles.text} ${styles[size]} ${styles[tone]} ${styles[weight]}`}>{children}</p>
}
