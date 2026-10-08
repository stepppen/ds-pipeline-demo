import { useRef, type KeyboardEvent } from 'react'
import styles from './Tabs.module.css'

export type TabItem = {
  id: string
  label: string
  /** id of the tabpanel this tab controls, if the caller renders one. */
  panelId?: string
}

type TabsProps = {
  /** Accessible name for the tab list. */
  label: string
  items: TabItem[]
  value: string
  onChange: (id: string) => void
  /** Prefix for each tab's DOM id (`${idPrefix}-${item.id}`), so a tabpanel can point back with aria-labelledby. */
  idPrefix?: string
}

export function Tabs({ label, items, value, onChange, idPrefix = 'tab' }: TabsProps) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  // Automatic activation: arrow keys move focus and select, with wrap-around.
  const onKeyDown = (event: KeyboardEvent, index: number) => {
    const last = items.length - 1
    const next = {
      ArrowRight: index === last ? 0 : index + 1,
      ArrowLeft: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    }[event.key]
    if (next === undefined) return
    event.preventDefault()
    refs.current[next]?.focus()
    onChange(items[next].id)
  }

  return (
    <div role="tablist" aria-label={label} className={styles.tablist}>
      {items.map((item, index) => {
        const selected = item.id === value
        return (
          <button
            key={item.id}
            ref={(node) => {
              refs.current[index] = node
            }}
            type="button"
            role="tab"
            id={`${idPrefix}-${item.id}`}
            aria-selected={selected}
            aria-controls={item.panelId}
            tabIndex={selected ? 0 : -1}
            className={styles.tab}
            onClick={() => onChange(item.id)}
            onKeyDown={(event) => onKeyDown(event, index)}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
