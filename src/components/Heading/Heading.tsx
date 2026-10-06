import type { ReactNode } from 'react'
import styles from './Heading.module.css'

type HeadingProps = {
  children: ReactNode
  level?: 1 | 2 | 3
}

export function Heading({ children, level = 2 }: HeadingProps) {
  const Tag = `h${level}` as const
  return <Tag className={`${styles.heading} ${styles[`level${level}`]}`}>{children}</Tag>
}
