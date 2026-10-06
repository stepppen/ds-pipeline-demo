import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Badge } from '../../components/Badge/Badge'
import { Button } from '../../components/Button/Button'
import { TextField } from '../../components/TextField/TextField'
import type { ApprovalDocument } from './mockData'
import { badgeStyle, isApprovable } from './status'
import styles from './approval-v2.module.css'

type DocumentDetailProps = {
  document: ApprovalDocument | null
  onApprove: (id: string) => void
  onRequestChanges: (id: string, comment: string) => void
  onClose: () => void
}

export function DocumentDetail({ document, onApprove, onRequestChanges, onClose }: DocumentDetailProps) {
  const [commenting, setCommenting] = useState(false)
  const [comment, setComment] = useState('')
  const [showError, setShowError] = useState(false)
  const titleRef = useRef<HTMLHeadingElement>(null)

  // The panel remounts per document (keyed by id), so this runs each time one opens.
  // Moving focus scrolls it into view when it's stacked under the list.
  useEffect(() => {
    titleRef.current?.focus()
  }, [])

  if (!document) {
    return (
      <section className={styles.detailColumn} aria-labelledby="detail-empty-title">
        <div className={styles.empty}>
          <h2 id="detail-empty-title" className={styles.emptyTitle}>No document open</h2>
          <p className={styles.text}>Choose Open on a document to see its details here.</p>
        </div>
      </section>
    )
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (comment.trim() === '') {
      setShowError(true)
      return
    }
    onRequestChanges(document.id, comment.trim())
    setCommenting(false)
    setComment('')
  }

  const cancel = () => {
    setCommenting(false)
    setComment('')
    setShowError(false)
  }

  return (
    <section className={styles.detailColumn} aria-labelledby="detail-title">
      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <h2 id="detail-title" ref={titleRef} tabIndex={-1} className={styles.detailTitle}>{document.name}</h2>
          <Button variant="secondary" size="sm" onClick={onClose}>Close</Button>
        </div>

        <dl className={styles.facts}>
          <dt>Submitter</dt>
          <dd>{document.submitter}</dd>
          <dt>Submitted</dt>
          <dd><time dateTime={document.date}>{document.date}</time></dd>
          <dt>Status</dt>
          <dd><Badge size="sm" {...badgeStyle[document.status]}>{document.status}</Badge></dd>
        </dl>

        <p className={styles.text}>{document.description}</p>

        {document.comment && (
          <div className={styles.comment}>
            <h3 className={styles.commentTitle}>Requested changes</h3>
            <p className={styles.text}>{document.comment}</p>
          </div>
        )}

        {isApprovable(document.status) &&
          (commenting ? (
            <form className={styles.form} onSubmit={submit} noValidate>
              <TextField
                multiline
                rows={4}
                required
                maxLength={500}
                label="Comment for the submitter"
                helperText="Explain what needs to change before you can approve it."
                value={comment}
                invalid={showError}
                errorText="Add a comment"
                onChange={(value) => {
                  setComment(value)
                  if (value.trim() !== '') setShowError(false)
                }}
              />
              <div className={styles.actions}>
                <Button variant="primary" type="submit">Submit</Button>
                <Button variant="secondary" onClick={cancel}>Cancel</Button>
              </div>
            </form>
          ) : (
            <div className={styles.actions}>
              <Button variant="primary" onClick={() => onApprove(document.id)}>Approve</Button>
              <Button variant="secondary" onClick={() => setCommenting(true)}>Request changes</Button>
            </div>
          ))}
      </div>
    </section>
  )
}
