import { useId, type ReactNode } from 'react'
import styles from './TextField.module.css'

type TextFieldProps = {
  label: string
  hideLabel?: boolean
  value: string
  onChange?: (value: string) => void
  placeholder?: string
  type?: 'text' | 'search' | 'date' | 'number'
  size?: 'sm' | 'md'
  disabled?: boolean
  invalid?: boolean
  helperText?: string
  errorText?: string
  multiline?: boolean
  rows?: number
  required?: boolean
  maxLength?: number
  /** Lower bound for type="number" (a number) or type="date" (YYYY-MM-DD). */
  min?: number | string
  /** Upper bound for type="number" or type="date". */
  max?: number | string
  /** Step for type="number". */
  step?: number
  /** Decorative icon inside the input, e.g. <Icon name="search" />. Single-line only. */
  leadingIcon?: ReactNode
}

export function TextField({
  label,
  hideLabel = false,
  value,
  onChange,
  placeholder,
  type = 'text',
  size = 'md',
  disabled = false,
  invalid = false,
  helperText,
  errorText,
  multiline = false,
  rows = 3,
  required = false,
  maxLength,
  min,
  max,
  step,
  leadingIcon,
}: TextFieldProps) {
  const id = useId()
  const helperId = `${id}-helper`
  const errorId = `${id}-error`
  const showError = invalid && Boolean(errorText)
  const describedBy = [helperText && helperId, showError && errorId].filter(Boolean).join(' ') || undefined

  const controlProps = {
    id,
    value,
    placeholder,
    disabled,
    required,
    maxLength,
    'aria-label': hideLabel ? label : undefined,
    'aria-invalid': invalid || undefined,
    'aria-describedby': describedBy,
    className: `${styles.control} ${styles[size]}${leadingIcon && !multiline ? ` ${styles.withLeadingIcon}` : ''}`,
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange?.(event.target.value),
  }

  return (
    <div className={styles.field}>
      {!hideLabel && (
        <label htmlFor={id} className={styles.label}>
          {label}
          {required && <span aria-hidden="true"> *</span>}
        </label>
      )}
      {multiline ? (
        <textarea {...controlProps} rows={rows} />
      ) : leadingIcon ? (
        <div className={`${styles.controlWrap} ${size === 'sm' ? styles.iconSm : styles.iconMd}`}>
          <span className={styles.leadingIcon} aria-hidden="true">
            {leadingIcon}
          </span>
          <input {...controlProps} type={type} min={min} max={max} step={step} />
        </div>
      ) : (
        <input {...controlProps} type={type} min={min} max={max} step={step} />
      )}
      {helperText && <p id={helperId} className={styles.helper}>{helperText}</p>}
      {showError && <p id={errorId} className={styles.error}>{errorText}</p>}
    </div>
  )
}
