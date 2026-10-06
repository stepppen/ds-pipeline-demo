import { useId } from 'react'
import { Icon } from '../../icons/Icon'
import styles from './Select.module.css'

export type SelectOption = {
  value: string
  label: string
}

type SelectProps = {
  label: string
  hideLabel?: boolean
  value: string
  onChange?: (value: string) => void
  options: SelectOption[]
  /** Shown as an empty first option (value ""). Not selectable again once required. */
  placeholder?: string
  size?: 'sm' | 'md'
  disabled?: boolean
  invalid?: boolean
  helperText?: string
  errorText?: string
  required?: boolean
}

export function Select({
  label,
  hideLabel = false,
  value,
  onChange,
  options,
  placeholder,
  size = 'md',
  disabled = false,
  invalid = false,
  helperText,
  errorText,
  required = false,
}: SelectProps) {
  const id = useId()
  const helperId = `${id}-helper`
  const errorId = `${id}-error`
  const showError = invalid && Boolean(errorText)
  const describedBy = [helperText && helperId, showError && errorId].filter(Boolean).join(' ') || undefined
  const showingPlaceholder = placeholder !== undefined && value === ''

  return (
    <div className={styles.field}>
      {!hideLabel && (
        <label htmlFor={id} className={styles.label}>
          {label}
          {required && <span aria-hidden="true"> *</span>}
        </label>
      )}
      <div className={`${styles.wrap} ${styles[`${size}Wrap`]}`}>
        <select
          id={id}
          value={value}
          disabled={disabled}
          required={required}
          aria-label={hideLabel ? label : undefined}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          className={`${styles.select} ${styles[size]}${showingPlaceholder ? ` ${styles.placeholder}` : ''}`}
          onChange={(event) => onChange?.(event.target.value)}
        >
          {placeholder !== undefined && (
            <option value="" disabled={required}>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span className={styles.chevron} aria-hidden="true">
          <Icon name="chevron-down" />
        </span>
      </div>
      {helperText && <p id={helperId} className={styles.helper}>{helperText}</p>}
      {showError && <p id={errorId} className={styles.error}>{errorText}</p>}
    </div>
  )
}
