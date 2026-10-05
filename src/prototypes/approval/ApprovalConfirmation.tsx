import { Badge } from '../../components/Badge/Badge'
import { Button } from '../../components/Button/Button'
import type { ApprovalDocument } from './mockData'
import styles from './approval.module.css'

type ApprovalConfirmationProps = {
  document: ApprovalDocument
  onBackToList: () => void
}

export function ApprovalConfirmation({ document, onBackToList }: ApprovalConfirmationProps) {
  return (
    <section className={styles.screen} aria-labelledby="approval-confirmation-title">
      <div className={styles.panel} role="status">
        <Badge variant="solid" size="md">Approved</Badge>
        <h1 id="approval-confirmation-title" className={styles.title}>Document approved</h1>
        <p className={styles.text}>“{document.name}” has been approved and the submitter has been notified.</p>
        <div className={styles.actions}>
          <Button variant="primary" onClick={onBackToList}>Back to list</Button>
        </div>
      </div>
    </section>
  )
}
