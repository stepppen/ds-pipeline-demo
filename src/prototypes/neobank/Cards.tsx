import { Badge } from '../../components/Badge/Badge'
import { Banner } from '../../components/Banner/Banner'
import { Card } from '../../components/Card/Card'
import { Checkbox } from '../../components/Checkbox/Checkbox'
import { Heading } from '../../components/Heading/Heading'
import { ListRow } from '../../components/ListRow/ListRow'
import { Text } from '../../components/Text/Text'
import { formatChf } from './format'
import { account, card } from './mockData'
import styles from './neobank.module.css'

type CardsProps = {
  frozen: boolean
  onFrozenChange: (frozen: boolean) => void
}

export function Cards({ frozen, onFrozenChange }: CardsProps) {
  return (
    <div className={`${styles.stack} ${styles.narrow}`}>
      <Heading level={2}>Cards</Heading>

      {frozen && (
        <Banner tone="warning" title="Card frozen">
          Payments, withdrawals and contactless are blocked until you unfreeze it.
        </Banner>
      )}

      {/* Card has no brand surface or tone (gap), so the bank card is a plain surface with a brand Badge. */}
      <Card padding="lg">
        <div className={styles.bankCard}>
          <div className={styles.spread}>
            <Badge tone="brand">Alpin</Badge>
            {frozen ? <Badge tone="danger">Frozen</Badge> : <Badge tone="success" variant="outline">Active</Badge>}
          </div>
          <Text weight="medium">•••• •••• •••• {card.lastFour}</Text>
          <div className={styles.spread}>
            <div className={styles.tightStack}>
              <Text size="sm" tone="muted">Card holder</Text>
              <Text>{account.holder}</Text>
            </div>
            <div className={styles.tightStack}>
              <Text size="sm" tone="muted">Valid until</Text>
              <Text>{card.expiry}</Text>
            </div>
          </div>
        </div>
      </Card>

      <Card header={<Heading level={3}>Card controls</Heading>}>
        <div className={styles.stack}>
          <Checkbox label="Freeze card" checked={frozen} onChange={onFrozenChange} />
          <Text size="sm" tone="muted">
            Freezing is instant and you can undo it any time. Standing orders keep running.
          </Text>
        </div>
      </Card>

      <Card padding="sm" header={<Heading level={3}>{card.name}</Heading>}>
        <ListRow title={formatChf(card.monthlyLimit)} subtitle="Monthly spending limit" />
        <ListRow title={formatChf(card.spentThisMonth)} subtitle="Spent this month" />
        <ListRow title={account.name} subtitle="Linked account" />
      </Card>
    </div>
  )
}
