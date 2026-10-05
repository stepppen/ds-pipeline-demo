import { useEffect, useRef } from 'react'
import styles from './Checkbox.module.css'

type CheckboxProps = {
  label: string
  hideLabel?: boolean
  checked: boolean
  indeterminate?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  invalid?: boolean
}

export function Checkbox({
  label,
  hideLabel = false,
  checked,
  indeterminate = false,
  onChange,
  disabled = false,
  invalid = false,
}: CheckboxProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate
  }, [indeterminate])

  return (
    <label className={styles.checkbox}>
      <span className={styles.control}>
        <input
          ref={inputRef}
          type="checkbox"
          className={styles.input}
          checked={checked}
          disabled={disabled}
          aria-label={hideLabel ? label : undefined}
          aria-invalid={invalid || undefined}
          onChange={(event) => onChange?.(event.target.checked)}
        />
        <svg className={styles.check} viewBox="0 0 16 16" aria-hidden="true">
          <path d="M4 8.5 6.5 11 12 5.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <svg className={styles.dash} viewBox="0 0 16 16" aria-hidden="true">
          <path d="M4.5 8h7" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>
      {!hideLabel && <span>{label}</span>}
    </label>
  )
}
