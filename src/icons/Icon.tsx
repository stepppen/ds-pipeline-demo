import { iconPaths, type IconName } from './paths'
import styles from './Icon.module.css'

export type { IconName }

type IconProps = {
  name: IconName
  /** Any CSS length, ideally a token such as var(--size-icon-md). Defaults to the surrounding font size. */
  size?: string
  /** Gives the icon an accessible name. Omit when it sits next to visible text (decorative). */
  label?: string
}

export function Icon({ name, size = '1em', label }: IconProps) {
  const a11y = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true }
  return (
    <svg
      {...a11y}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
      className={styles.icon}
    >
      {iconPaths[name]}
    </svg>
  )
}
