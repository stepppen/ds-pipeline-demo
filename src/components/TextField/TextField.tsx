import { useId } from 'react'
import styles from './TextField.module.css'

type TextFieldProps = {
  label: string
  hideLabel?: boolean
  value: string
  onChange?: (value: string) => void
  placeholder?: string
  type?: 'text' | 'search'
  size?: 'sm' | 'md'
  disabled?: boolean
  invalid?: boolean
  helperText?: string
  errorText?: string
  multiline?: boolean
  rows?: number
  required?: boolean
  maxLength?: number
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
    className: `${styles.control} ${styles[size]}`,
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
      {multiline ? <textarea {...controlProps} rows={rows} /> : <input {...controlProps} type={type} />}
      {helperText && <p id={helperId} className={styles.helper}>{helperText}</p>}
      {showError && <p id={errorId} className={styles.error}>{errorText}</p>}
    </div>
  )
}
