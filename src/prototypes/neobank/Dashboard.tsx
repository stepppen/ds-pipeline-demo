import { useState } from 'react'
import { Avatar } from '../../components/Avatar/Avatar'
import { Banner } from '../../components/Banner/Banner'
import { Button } from '../../components/Button/Button'
import { Card } from '../../components/Card/Card'
import { Heading } from '../../components/Heading/Heading'
import { ListRow } from '../../components/ListRow/ListRow'
import { Text } from '../../components/Text/Text'
import { amountNode } from './amount'
import { balanceOf, formatChf, formatDate, monthTotals, subtitleFor } from './format'
import { account, OPENING_BALANCE, TODAY, type Transaction } from './mockData'
import type { Screen } from './Neobank'
import styles from './neobank.module.css'

type DashboardProps = {
  transactions: Transaction[]
  onNavigate: (screen: Screen) => void
  onOpenTransaction: (id: string) => void
}

export function Dashboard({ transactions, onNavigate, onOpenTransaction }: DashboardProps) {
  const [notice, setNotice] = useState<string | null>(null)
  const balance = balanceOf(OPENING_BALANCE, transactions)
  const month = monthTotals(transactions, TODAY.slice(0, 7))

  return (
    <>
      <Card padding="lg">
        <div className={styles.stack}>
          <div className={styles.tightStack}>
            <Text size="sm" tone="muted">
              Total balance · {account.name}
            </Text>
            <Heading level={2}>{formatChf(balance)}</Heading>
            <Text size="sm" tone="muted">
              As of {formatDate(TODAY)}
            </Text>
          </div>
          <div className={styles.actions}>
            <Button onClick={() => onNavigate('transfer')}>Send</Button>
            <Button variant="secondary" onClick={() => setNotice('Request money')}>
              Request
            </Button>
            <Button variant="secondary" onClick={() => setNotice('Top up')}>
              Top up
            </Button>
          </div>
        </div>
      </Card>

      {notice && (
        <Banner tone="info" title={`${notice} isn’t part of this demo`} onDismiss={() => setNotice(null)}>
          Try Send instead — it walks through the full transfer flow.
        </Banner>
      )}

      <Card header={<Heading level={2}>This month</Heading>}>
        <div className={styles.stats}>
          <div className={styles.tightStack}>
            <Text size="sm" tone="muted">Money in</Text>
            <Text weight="medium">{formatChf(month.incoming)}</Text>
          </div>
          <div className={styles.tightStack}>
            <Text size="sm" tone="muted">Money out</Text>
            <Text weight="medium">{formatChf(month.outgoing)}</Text>
          </div>
          <div className={styles.tightStack}>
            <Text size="sm" tone="muted">Saved</Text>
            <Text weight="medium">{formatChf(month.saved)}</Text>
          </div>
        </div>
      </Card>

      <Card
        padding="sm"
        header={
          <div className={styles.cardHeader}>
            <Heading level={2}>Recent transactions</Heading>
            <Button variant="secondary" size="sm" onClick={() => onNavigate('transactions')}>
              See all
            </Button>
          </div>
        }
      >
        {transactions.slice(0, 5).map((tx) => (
          <ListRow
            key={tx.id}
            leading={<Avatar name={tx.merchant} />}
            title={tx.merchant}
            subtitle={subtitleFor(tx)}
            trailing={amountNode(tx.amount)}
            onClick={() => onOpenTransaction(tx.id)}
          />
        ))}
      </Card>
    </>
  )
}
