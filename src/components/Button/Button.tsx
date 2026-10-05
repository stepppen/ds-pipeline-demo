import type { ButtonHTMLAttributes, MouseEventHandler, ReactNode } from 'react'
import styles from './Button.module.css'

type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'style'> & {
  children: ReactNode
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  'aria-label'?: string
  'aria-pressed'?: boolean | 'mixed'
  onClick?: MouseEventHandler<HTMLButtonElement>
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      type={type}
      className={`${styles.button} ${styles[variant]} ${styles[size]}`}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
