import styles from './Avatar.module.css'

type AvatarProps = {
  name: string
  size?: 'sm' | 'md'
  decorative?: boolean
}

function getInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return '?'
  const first = words[0][0]
  const last = words.length > 1 ? words[words.length - 1][0] : ''
  return (first + last).toUpperCase()
}

// Decorative by default: it usually sits next to the visible name it abbreviates.
export function Avatar({ name, size = 'md', decorative = true }: AvatarProps) {
  const a11y = decorative ? { 'aria-hidden': true } : { role: 'img', 'aria-label': name }
  return (
    <span className={`${styles.avatar} ${styles[size]}`} {...a11y}>
      {getInitials(name)}
    </span>
  )
}
