import { useState, type FormEvent } from 'react'
import { Avatar } from '../../components/Avatar/Avatar'
import { Banner } from '../../components/Banner/Banner'
import { Button } from '../../components/Button/Button'
import { Card } from '../../components/Card/Card'
import { Heading } from '../../components/Heading/Heading'
import { ListRow } from '../../components/ListRow/ListRow'
import { TextField } from '../../components/TextField/TextField'
import { balanceOf, formatChf, formatDate, parseChf } from './format'
import { account, OPENING_BALANCE, TODAY, type Transaction } from './mockData'
import styles from './neobank.module.css'

type Step = 'form' | 'confirm' | 'sent'

type TransferProps = {
  transactions: Transaction[]
  onSend: (tx: Transaction) => void
  onUndo: (id: string) => void
  onViewTransaction: (id: string) => void
}

export function Transfer({ transactions, onSend, onUndo, onViewTransaction }: TransferProps) {
  const [step, setStep] = useState<Step>('form')
  const [recipient, setRecipient] = useState('')
  const [amountInput, setAmountInput] = useState('')
  const [message, setMessage] = useState('')
  const [showErrors, setShowErrors] = useState(false)
  const [sent, setSent] = useState<Transaction | null>(null)
  const [cancelled, setCancelled] = useState(false)

  const balance = balanceOf(OPENING_BALANCE, transactions)
  const amount = parseChf(amountInput)
  const recipientError = recipient.trim() ? undefined : 'Enter who you’re sending money to.'
  const amountError =
    amount === null
      ? 'Enter an amount in CHF, for example 120.50.'
      : amount > balance
        ? `That’s more than your balance of ${formatChf(balance)}.`
        : undefined

  const resetForm = () => {
    setRecipient('')
    setAmountInput('')
    setMessage('')
    setShowErrors(false)
  }

  const continueToConfirm = (event: FormEvent) => {
    event.preventDefault()
    setCancelled(false)
    if (recipientError || amountError) {
      setShowErrors(true)
      return
    }
    setStep('confirm')
  }

  const confirm = () => {
    if (amount === null) return
    const sequence = String(transactions.length + 1).padStart(4, '0')
    const tx: Transaction = {
      id: `transfer-${sequence}`,
      merchant: recipient.trim(),
      date: TODAY,
      amount: -amount,
      status: 'Pending',
      category: 'Transfer',
      reference: `ALP-${TODAY.replaceAll('-', '')}-${sequence}`,
      message: message.trim() || undefined,
    }
    onSend(tx)
    setSent(tx)
    setStep('sent')
  }

  const undo = () => {
    if (sent) onUndo(sent.id)
    setSent(null)
    setCancelled(true)
    setStep('form')
  }

  const startAnother = () => {
    resetForm()
    setSent(null)
    setStep('form')
  }

  if (step === 'sent' && sent) {
    return (
      <div className={`${styles.stack} ${styles.narrow}`}>
        <Heading level={2}>Transfer</Heading>
        <Banner
          tone="success"
          title={`${formatChf(-sent.amount)} sent to ${sent.merchant}`}
          action={
            <Button variant="secondary" size="sm" onClick={undo}>
              Undo
            </Button>
          }
        >
          It shows as pending until it’s booked, usually within one working day.
        </Banner>
        <div className={styles.actions}>
          <Button onClick={() => onViewTransaction(sent.id)}>View transaction</Button>
          <Button variant="secondary" onClick={startAnother}>
            New transfer
          </Button>
        </div>
      </div>
    )
  }

  if (step === 'confirm' && amount !== null) {
    return (
      <div className={`${styles.stack} ${styles.narrow}`}>
        <Heading level={2}>Transfer</Heading>
        <Card padding="sm" header={<Heading level={3}>Check and confirm</Heading>}>
          <ListRow leading={<Avatar name={recipient} />} title={recipient.trim()} subtitle="Recipient" />
          <ListRow title={formatChf(amount)} subtitle="Amount" />
          <ListRow title={account.name} subtitle={`From · ${account.iban}`} />
          <ListRow title={`Today, ${formatDate(TODAY)}`} subtitle="Execution date" />
          {message.trim() && <ListRow title={message.trim()} subtitle="Message" />}
        </Card>
        <div className={styles.actions}>
          <Button onClick={confirm}>Confirm and send</Button>
          <Button variant="secondary" onClick={() => setStep('form')}>
            Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={`${styles.stack} ${styles.narrow}`}>
      <Heading level={2}>Transfer</Heading>
      {cancelled && (
        <Banner tone="info" title="Transfer cancelled" onDismiss={() => setCancelled(false)}>
          Nothing was sent. Your details are still filled in below.
        </Banner>
      )}
      <Card header={<Heading level={3}>Send money</Heading>}>
        <form className={styles.stack} onSubmit={continueToConfirm} noValidate>
          <TextField
            label="Recipient"
            placeholder="Name or IBAN"
            value={recipient}
            onChange={setRecipient}
            required
            invalid={showErrors && Boolean(recipientError)}
            errorText={recipientError}
          />
          <TextField
            label="Amount (CHF)"
            placeholder="0.00"
            value={amountInput}
            onChange={setAmountInput}
            required
            helperText={`Available: ${formatChf(balance)}`}
            invalid={showErrors && Boolean(amountError)}
            errorText={amountError}
          />
          <TextField label="Message (optional)" value={message} onChange={setMessage} multiline rows={2} maxLength={140} />
          <div className={styles.actions}>
            <Button type="submit">Continue</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
