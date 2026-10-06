import { Badge } from '../../components/Badge/Badge'
import { Banner } from '../../components/Banner/Banner'
import { Button } from '../../components/Button/Button'
import { Checkbox } from '../../components/Checkbox/Checkbox'
import { Chip } from '../../components/Chip/Chip'
import { ChipGroup } from '../../components/Chip/ChipGroup'
import { TextField } from '../../components/TextField/TextField'
import type { BannerState } from './ApprovalV2'
import { statuses, type ApprovalDocument, type Status } from './mockData'
import { badgeStyle, isApprovable } from './status'
import styles from './approval-v2.module.css'

export type Filter = 'All' | Status

type DocumentListProps = {
  documents: ApprovalDocument[]
  query: string
  filter: Filter
  checkedIds: string[]
  openId: string | null
  banner: BannerState | null
  onQueryChange: (query: string) => void
  onFilterChange: (filter: Filter) => void
  onClearFilters: () => void
  onCheckedChange: (id: string, checked: boolean) => void
  onClearChecked: () => void
  onApproveChecked: () => void
  onToggleOpen: (id: string) => void
  onUndo: () => void
  onDismissBanner: () => void
}

const matches = (doc: ApprovalDocument, query: string) => {
  const q = query.trim().toLowerCase()
  return q === '' || doc.name.toLowerCase().includes(q) || doc.submitter.toLowerCase().includes(q)
}

export function DocumentList({
  documents,
  query,
  filter,
  checkedIds,
  openId,
  banner,
  onQueryChange,
  onFilterChange,
  onClearFilters,
  onCheckedChange,
  onClearChecked,
  onApproveChecked,
  onToggleOpen,
  onUndo,
  onDismissBanner,
}: DocumentListProps) {
  const searched = documents.filter((doc) => matches(doc, query))
  const visible = filter === 'All' ? searched : searched.filter((doc) => doc.status === filter)
  const countFor = (value: Filter) =>
    value === 'All' ? searched.length : searched.filter((doc) => doc.status === value).length

  const checked = documents.filter((doc) => checkedIds.includes(doc.id))
  const approvableCount = checked.filter((doc) => isApprovable(doc.status)).length
  const approveLabel =
    approvableCount === checked.length ? 'Approve all' : `Approve ${approvableCount} of ${checked.length}`

  return (
    <section className={styles.listColumn} aria-labelledby="documents-title">
      <h1 id="documents-title" className={styles.pageTitle}>Documents</h1>

      {banner && (
        <Banner
          tone="success"
          title={banner.title}
          action={<Button variant="secondary" size="sm" onClick={onUndo}>Undo</Button>}
          onDismiss={onDismissBanner}
        >
          {banner.body}
        </Banner>
      )}

      <TextField
        type="search"
        label="Search documents"
        hideLabel
        placeholder="Search by name or submitter"
        value={query}
        onChange={onQueryChange}
      />

      <ChipGroup label="Filter by status">
        {(['All', ...statuses] as Filter[]).map((value) => (
          <Chip key={value} count={countFor(value)} selected={filter === value} onClick={() => onFilterChange(value)}>
            {value}
          </Chip>
        ))}
      </ChipGroup>

      {checked.length > 0 && (
        <div className={styles.bulkBar}>
          <p className={styles.bulkCount} role="status">{checked.length} selected</p>
          <div className={styles.actions}>
            <Button variant="primary" size="sm" disabled={approvableCount === 0} onClick={onApproveChecked}>
              {approveLabel}
            </Button>
            <Button variant="secondary" size="sm" onClick={onClearChecked}>Clear selection</Button>
          </div>
        </div>
      )}

      {visible.length === 0 ? (
        <div className={styles.empty}>
          <h2 className={styles.emptyTitle}>No documents match your filters</h2>
          <p className={styles.text}>Try a different search term or status.</p>
          <div className={styles.actions}>
            <Button variant="secondary" size="sm" onClick={onClearFilters}>Clear filters</Button>
          </div>
        </div>
      ) : (
        <ul className={styles.list} aria-label="Documents">
          {visible.map((doc) => {
            const isOpen = doc.id === openId
            return (
              <li key={doc.id} className={isOpen ? `${styles.row} ${styles.rowOpen}` : styles.row}>
                <Checkbox
                  label={`Select ${doc.name}`}
                  hideLabel
                  checked={checkedIds.includes(doc.id)}
                  onChange={(next) => onCheckedChange(doc.id, next)}
                />
                <div className={styles.rowBody}>
                  <span className={styles.rowName}>{doc.name}</span>
                  <span className={styles.meta}>
                    {doc.submitter} · <time dateTime={doc.date}>{doc.date}</time>
                  </span>
                  <span>
                    <Badge size="sm" {...badgeStyle[doc.status]}>{doc.status}</Badge>
                  </span>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  aria-label={`Open ${doc.name}`}
                  aria-pressed={isOpen}
                  onClick={() => onToggleOpen(doc.id)}
                >
                  Open
                </Button>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
