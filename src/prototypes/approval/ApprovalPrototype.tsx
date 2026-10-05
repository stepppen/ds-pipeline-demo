import { useState } from 'react'
import { ApprovalConfirmation } from './ApprovalConfirmation'
import { ApprovalDetail } from './ApprovalDetail'
import { ApprovalList } from './ApprovalList'
import { documents as initialDocuments, type Status } from './mockData'

type Screen = { name: 'list' } | { name: 'detail'; id: string } | { name: 'confirmation'; id: string }

export function ApprovalPrototype() {
  const [documents, setDocuments] = useState(initialDocuments)
  const [screen, setScreen] = useState<Screen>({ name: 'list' })

  const setStatus = (id: string, status: Status) =>
    setDocuments((docs) => docs.map((doc) => (doc.id === id ? { ...doc, status } : doc)))

  if (screen.name === 'list') {
    return <ApprovalList documents={documents} onOpen={(id) => setScreen({ name: 'detail', id })} />
  }

  const current = documents.find((doc) => doc.id === screen.id)!
  const backToList = () => setScreen({ name: 'list' })

  if (screen.name === 'detail') {
    return (
      <ApprovalDetail
        document={current}
        onBack={backToList}
        onApprove={() => {
          setStatus(current.id, 'Approved')
          setScreen({ name: 'confirmation', id: current.id })
        }}
        onRequestChanges={() => {
          setStatus(current.id, 'Changes requested')
          backToList()
        }}
      />
    )
  }

  return <ApprovalConfirmation document={current} onBackToList={backToList} />
}
