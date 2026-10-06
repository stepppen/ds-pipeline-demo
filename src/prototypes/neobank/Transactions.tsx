import { useState } from 'react'
import { Avatar } from '../../components/Avatar/Avatar'
import { Badge } from '../../components/Badge/Badge'
import { Button } from '../../components/Button/Button'
import { Card } from '../../components/Card/Card'
import { Chip } from '../../components/Chip/Chip'
import { ChipGroup } from '../../components/Chip/ChipGroup'
import { Heading } from '../../components/Heading/Heading'
import { ListRow } from '../../components/ListRow/ListRow'
import { Text } from '../../components/Text/Text'
import { TextField } from '../../components/TextField/TextField'
import { amountNode } from './amount'
import { categoryTone, formatDate, formatSignedChf, subtitleFor } from './format'
import type { Transaction } from './mockData'
import styles from './neobank.module.css'

export type Filter = 'All' | 'In' | 'Out' | 'Pending'

const filters: Filter[] = ['All', 'In', 'Out', 'Pending']

const matchesFilter = (tx: Transaction, filter: Filter) =>
  filter === 'All' ||
  (filter === 'In' && tx.amount > 0) ||
  (filter === 'Out' && tx.amount < 0) ||
  (filter === 'Pending' && tx.status === 'Pending')

type TransactionsProps = {
  transactions: Transaction[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function Transactions({ transactions, selectedId, onSelect }: TransactionsProps) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('All')

  const searched = transactions.filter((tx) => tx.merchant.toLowerCase().includes(query.trim().toLowerCase()))
  const visible = searched.filter((tx) => matchesFilter(tx, filter))
  const selected = transactions.find((tx) => tx.id === selectedId)

  const clearFilters = () => {
    setQuery('')
    setFilter('All')
  }

  return (
    <div className={styles.masterDetail}>
      <div className={styles.master}>
        <Heading level={2}>Transactions</Heading>
        <TextField
          label="Search transactions"
          hideLabel
          type="search"
          placeholder="Search by merchant"
          value={query}
          onChange={setQuery}
        />
        <ChipGroup label="Filter transactions">
          {filters.map((option) => (
            <Chip
              key={option}
              selected={filter === option}
              count={searched.filter((tx) => matchesFilter(tx, option)).length}
              onClick={() => setFilter(option)}
            >
              {option}
            </Chip>
          ))}
        </ChipGroup>
        <Card padding="sm">
          {visible.length > 0 ? (
            visible.map((tx) => (
              <ListRow
                key={tx.id}
                leading={<Avatar name={tx.merchant} />}
                title={tx.merchant}
                subtitle={subtitleFor(tx)}
                trailing={amountNode(tx.amount)}
                selected={tx.id === selectedId}
                onClick={() => onSelect(tx.id)}
              />
            ))
          ) : (
            // EmptyState doesn't exist yet (known gap); approximated with Text and a Button.
            <div className={styles.stack}>
              <Text tone="muted">No transactions match your search.</Text>
              <div className={styles.actions}>
                <Button variant="secondary" size="sm" onClick={clearFilters}>
                  Clear filters
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      <section className={styles.detail} aria-label={selected ? `${selected.merchant} transaction` : 'Transaction details'}>
        {selected ? (
          <TransactionDetail tx={selected} />
        ) : (
          <Card>
            <Text tone="muted">Select a transaction to see its details.</Text>
          </Card>
        )}
      </section>
    </div>
  )
}

function TransactionDetail({ tx }: { tx: Transaction }) {
  return (
    <Card
      padding="lg"
      header={
        <div className={styles.cardHeader}>
          <div className={styles.inline}>
            <Avatar name={tx.merchant} />
            <Heading level={3}>{tx.merchant}</Heading>
          </div>
          {tx.status === 'Pending' && (
            <Badge tone="warning" variant="outline" size="sm">
              Pending
            </Badge>
          )}
        </div>
      }
    >
      <div className={styles.stack}>
        {/* Text has no display size for a hero amount, and a second heading would misrepresent it. */}
        <Text weight="medium">{formatSignedChf(tx.amount)}</Text>
        <dl className={styles.facts}>
          <dt><Text size="sm" tone="muted">Date</Text></dt>
          <dd><Text>{formatDate(tx.date)}</Text></dd>
          <dt><Text size="sm" tone="muted">Category</Text></dt>
          <dd>
            <Badge tone={categoryTone(tx.category)} variant="outline" size="sm">
              {tx.category}
            </Badge>
          </dd>
          <dt><Text size="sm" tone="muted">Status</Text></dt>
          <dd><Text>{tx.status}</Text></dd>
          {tx.message && (
            <>
              <dt><Text size="sm" tone="muted">Message</Text></dt>
              <dd><Text>{tx.message}</Text></dd>
            </>
          )}
          <dt><Text size="sm" tone="muted">Reference</Text></dt>
          <dd><Text>{tx.reference}</Text></dd>
        </dl>
      </div>
    </Card>
  )
}
