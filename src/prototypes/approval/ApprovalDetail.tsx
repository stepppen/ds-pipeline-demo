import { Badge } from '../../components/Badge/Badge'
import { Button } from '../../components/Button/Button'
import type { ApprovalDocument } from './mockData'
import { statusVariant } from './status'
import styles from './approval.module.css'

type ApprovalDetailProps = {
  document: ApprovalDocument
  onApprove: () => void
  onRequestChanges: () => void
  onBack: () => void
}

export function ApprovalDetail({ document, onApprove, onRequestChanges, onBack }: ApprovalDetailProps) {
  return (
    <section className={styles.screen} aria-labelledby="approval-detail-title">
      <div className={styles.actions}>
        <Button variant="secondary" size="sm" onClick={onBack}>Back to list</Button>
      </div>
      <div className={styles.panel}>
        <h1 id="approval-detail-title" className={styles.title}>{document.name}</h1>
        <dl className={styles.facts}>
          <dt>Submitter</dt>
          <dd>{document.submitter}</dd>
          <dt>Date</dt>
          <dd><time dateTime={document.date}>{document.date}</time></dd>
          <dt>Status</dt>
          <dd><Badge variant={statusVariant(document.status)} size="sm">{document.status}</Badge></dd>
        </dl>
        <p className={styles.text}>{document.description}</p>
        <div className={styles.actions}>
          <Button variant="primary" onClick={onApprove}>Approve</Button>
          <Button variant="secondary" onClick={onRequestChanges}>Request changes</Button>
        </div>
      </div>
    </section>
  )
}
