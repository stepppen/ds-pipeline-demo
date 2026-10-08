import { useId } from 'react'
import { Icon } from '../../icons/Icon'
import styles from './Table.module.css'

type Flag = 'L' | 'H'

/** A plain value, or a value with a low/high flag shown after it (e.g. lab results). */
export type TableCell = string | number | { value: string | number; flag?: Flag }

export type TableColumn = {
  header: string
  /** Shows a sort icon. Visual only: the table does not sort. */
  sortable?: boolean
}

export type TableRow = {
  id: string
  cells: TableCell[]
}

type TableProps = {
  /** Names the table for assistive technology. */
  caption: string
  hideCaption?: boolean
  columns: TableColumn[]
  rows: TableRow[]
  /** Full words read out for the flag letters. */
  flagLabels?: Record<Flag, string>
}

function CellContent({ cell, flagLabels }: { cell: TableCell; flagLabels: Record<Flag, string> }) {
  if (typeof cell !== 'object') return <>{cell}</>
  return (
    <>
      {cell.value}
      {cell.flag && (
        <>
          {' '}
          <abbr className={styles.flag} title={flagLabels[cell.flag]}>
            {cell.flag}
          </abbr>
        </>
      )}
    </>
  )
}

export function Table({
  caption,
  hideCaption = false,
  columns,
  rows,
  flagLabels = { L: 'Low', H: 'High' },
}: TableProps) {
  const captionId = useId()
  return (
    // Scrolls sideways instead of spilling out of a narrow container; focusable so keyboard users can scroll it.
    <div className={styles.scroll} role="region" aria-labelledby={captionId} tabIndex={0}>
      <table className={styles.table}>
        <caption id={captionId} className={hideCaption ? styles.visuallyHidden : styles.caption}>{caption}</caption>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.header} scope="col" className={styles.header}>
                <span className={styles.headerContent}>
                  {column.header}
                  {column.sortable && <Icon name="sort" size="var(--size-icon-sm)" />}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {row.cells.map((cell, index) =>
                index === 0 ? (
                  <th key={index} scope="row" className={styles.cell}>
                    <CellContent cell={cell} flagLabels={flagLabels} />
                  </th>
                ) : (
                  <td key={index} className={styles.cell}>
                    <CellContent cell={cell} flagLabels={flagLabels} />
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
