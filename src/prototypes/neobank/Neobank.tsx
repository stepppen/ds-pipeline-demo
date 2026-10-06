import { useState } from 'react'
import { Chip } from '../../components/Chip/Chip'
import { ChipGroup } from '../../components/Chip/ChipGroup'
import { Heading } from '../../components/Heading/Heading'
import { Cards } from './Cards'
import { Dashboard } from './Dashboard'
import { Transactions } from './Transactions'
import { Transfer } from './Transfer'
import { transactions as defaultTransactions, type Transaction } from './mockData'
import styles from './neobank.module.css'

export type Screen = 'dashboard' | 'transactions' | 'transfer' | 'cards'

const screens: { id: Screen; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'transactions', label: 'Transactions' },
  { id: 'transfer', label: 'Transfer' },
  { id: 'cards', label: 'Cards' },
]

type NeobankProps = {
  initialScreen?: Screen
  initialTransactions?: Transaction[]
  initialFrozen?: boolean
}

export function Neobank({
  initialScreen = 'dashboard',
  initialTransactions = defaultTransactions,
  initialFrozen = false,
}: NeobankProps) {
  const [screen, setScreen] = useState<Screen>(initialScreen)
  const [transactions, setTransactions] = useState(initialTransactions)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [frozen, setFrozen] = useState(initialFrozen)

  const openTransaction = (id: string) => {
    setSelectedId(id)
    setScreen('transactions')
  }

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <Heading level={1}>Alpin</Heading>
        <nav aria-label="Main">
          <ChipGroup label="Screens">
            {screens.map(({ id, label }) => (
              <Chip key={id} selected={screen === id} onClick={() => setScreen(id)}>
                {label}
              </Chip>
            ))}
          </ChipGroup>
        </nav>
      </header>
      <main className={styles.main}>
        {screen === 'dashboard' && (
          <Dashboard transactions={transactions} onNavigate={setScreen} onOpenTransaction={openTransaction} />
        )}
        {screen === 'transactions' && (
          <Transactions transactions={transactions} selectedId={selectedId} onSelect={setSelectedId} />
        )}
        {screen === 'transfer' && (
          <Transfer
            transactions={transactions}
            onSend={(tx) => setTransactions((list) => [tx, ...list])}
            onUndo={(id) => setTransactions((list) => list.filter((tx) => tx.id !== id))}
            onViewTransaction={openTransaction}
          />
        )}
        {screen === 'cards' && <Cards frozen={frozen} onFrozenChange={setFrozen} />}
      </main>
    </div>
  )
}
