import { useState } from 'react'
import { DocumentDetail } from './DocumentDetail'
import { DocumentList, type Filter } from './DocumentList'
import { documents as defaultDocuments, type ApprovalDocument, type Status } from './mockData'
import { isApprovable } from './status'
import styles from './approval-v2.module.css'

export type BannerState = {
  title: string
  body: string
  // Statuses before the action, so Undo can restore every document it touched.
  previous: Record<string, Status>
}

type ApprovalV2Props = {
  initialDocuments?: ApprovalDocument[]
}

export function ApprovalV2({ initialDocuments = defaultDocuments }: ApprovalV2Props) {
  const [documents, setDocuments] = useState(initialDocuments)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('All')
  const [checkedIds, setCheckedIds] = useState<string[]>([])
  const [openId, setOpenId] = useState<string | null>(null)
  const [banner, setBanner] = useState<BannerState | null>(null)

  const updateStatuses = (changes: Record<string, Status>, comment?: { id: string; text: string }) =>
    setDocuments((docs) =>
      docs.map((doc) => {
        if (!(doc.id in changes)) return doc
        const next = { ...doc, status: changes[doc.id] }
        return comment?.id === doc.id ? { ...next, comment: comment.text } : next
      }),
    )

  const changeQuery = (value: string) => {
    setQuery(value)
    setCheckedIds([])
  }

  const changeFilter = (value: Filter) => {
    setFilter(value)
    setCheckedIds([])
  }

  const clearFilters = () => {
    changeQuery('')
    changeFilter('All')
  }

  const approve = (ids: string[], skipped = 0) => {
    const targets = documents.filter((doc) => ids.includes(doc.id) && isApprovable(doc.status))
    if (targets.length === 0) return
    updateStatuses(Object.fromEntries(targets.map((doc) => [doc.id, 'Approved'])))
    const single = targets.length === 1 && skipped === 0
    setBanner({
      title: single ? 'Document approved' : `${targets.length} documents approved`,
      body: single
        ? `“${targets[0].name}” was approved.`
        : skipped > 0
          ? `${skipped} skipped because ${skipped === 1 ? 'it was' : 'they were'} already approved or sent back for changes.`
          : 'All selected documents were approved.',
      previous: Object.fromEntries(targets.map((doc) => [doc.id, doc.status])),
    })
  }

  const approveChecked = () => {
    const checked = documents.filter((doc) => checkedIds.includes(doc.id))
    const approvable = checked.filter((doc) => isApprovable(doc.status))
    approve(
      approvable.map((doc) => doc.id),
      checked.length - approvable.length,
    )
    setCheckedIds([])
  }

  const undo = () => {
    if (banner) updateStatuses(banner.previous)
    setBanner(null)
  }

  const requestChanges = (id: string, comment: string) => {
    updateStatuses({ [id]: 'Changes requested' }, { id, text: comment })
    setBanner(null)
  }

  const openDocument = documents.find((doc) => doc.id === openId) ?? null

  return (
    <div className={styles.page}>
      <DocumentList
        documents={documents}
        query={query}
        filter={filter}
        checkedIds={checkedIds}
        openId={openId}
        banner={banner}
        onQueryChange={changeQuery}
        onFilterChange={changeFilter}
        onClearFilters={clearFilters}
        onCheckedChange={(id, checked) =>
          setCheckedIds((ids) => (checked ? [...ids, id] : ids.filter((other) => other !== id)))
        }
        onClearChecked={() => setCheckedIds([])}
        onApproveChecked={approveChecked}
        onToggleOpen={(id) => setOpenId((current) => (current === id ? null : id))}
        onUndo={undo}
        onDismissBanner={() => setBanner(null)}
      />
      <DocumentDetail
        key={openDocument?.id ?? 'none'}
        document={openDocument}
        onApprove={(id) => approve([id])}
        onRequestChanges={requestChanges}
        onClose={() => setOpenId(null)}
      />
    </div>
  )
}
