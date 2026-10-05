import { Badge } from '../../components/Badge/Badge'
import { Button } from '../../components/Button/Button'
import type { ApprovalDocument } from './mockData'
import { statusVariant } from './status'
import styles from './approval.module.css'

type ApprovalListProps = {
  documents: ApprovalDocument[]
  onOpen: (id: string) => void
}

export function ApprovalList({ documents, onOpen }: ApprovalListProps) {
  return (
    <section className={styles.screen} aria-labelledby="approval-list-title">
      <h1 id="approval-list-title" className={styles.title}>Awaiting your review</h1>
      <ul className={styles.list}>
        {documents.map((doc) => (
          <li key={doc.id} className={styles.row}>
            <span>{doc.name}</span>
            <span className={styles.meta}>{doc.submitter}</span>
            <time className={styles.meta} dateTime={doc.date}>{doc.date}</time>
            <Badge variant={statusVariant(doc.status)} size="sm">{doc.status}</Badge>
            <Button variant="primary" size="sm" onClick={() => onOpen(doc.id)}>Open</Button>
          </li>
        ))}
      </ul>
    </section>
  )
}
