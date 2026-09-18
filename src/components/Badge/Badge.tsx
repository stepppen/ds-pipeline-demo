import styles from './Badge.module.css'

type BadgeProps = {
  children: React.ReactNode
  type?: 'solid' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

export function Badge({ children, type = 'solid', size = 'md' }: BadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[type]} ${styles[size]}`}>
      {children}
    </span>
  )
}