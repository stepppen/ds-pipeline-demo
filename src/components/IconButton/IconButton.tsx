import type { MouseEventHandler } from 'react'
import { Icon, type IconName } from '../../icons/Icon'
import styles from './IconButton.module.css'

type IconButtonProps = {
  icon: IconName
  /** Required: an icon-only button has no visible text to name it. */
  'aria-label': string
  size?: 'sm' | 'md'
  disabled?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement>
}

export function IconButton({ icon, 'aria-label': ariaLabel, size = 'md', disabled = false, onClick }: IconButtonProps) {
  return (
    <button
      type="button"
      className={`${styles.iconButton} ${styles[size]}`}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
    >
      <Icon name={icon} size={size === 'sm' ? 'var(--size-icon-sm)' : 'var(--size-icon-md)'} />
    </button>
  )
}
