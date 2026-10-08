import { useState, type FormEvent } from 'react'
import { Badge } from '../../components/Badge/Badge'
import { Banner } from '../../components/Banner/Banner'
import { Button } from '../../components/Button/Button'
import { Card } from '../../components/Card/Card'
import { Heading } from '../../components/Heading/Heading'
import { Select } from '../../components/Select/Select'
import { Table, type TableColumn } from '../../components/Table/Table'
import { Text } from '../../components/Text/Text'
import { TextField } from '../../components/TextField/TextField'
import { Icon } from '../../icons/Icon'
import {
  catalog,
  clockTime,
  DEFAULT_PROVIDER,
  formatDate,
  formatTaxpoints,
  isoDate,
  providers,
  serviceTypes,
  statusTone,
  summarize,
  type Service,
} from './leistungen'
import styles from './klinik.module.css'

const ALL = 'alle'

const typeOptions = [{ value: ALL, label: 'Alle' }, ...serviceTypes.map((type) => ({ value: type, label: type }))]
const providerOptions = [{ value: ALL, label: 'Alle' }, ...providers.map((name) => ({ value: name, label: name }))]

const columns: TableColumn[] = ['Datum/Zeit', 'Tarifposition', 'Bezeichnung', 'Menge', 'Status'].map((header) => ({
  header,
}))

type LeistungenTabProps = {
  services: Service[]
  canLoadMore: boolean
  onAdd: (service: Service) => void
  onLoadMore: () => void
  /** Injectable so stories render a fixed date and time. */
  clock: () => Date
}

export function LeistungenTab({ services, canLoadMore, onAdd, onLoadMore, clock }: LeistungenTabProps) {
  // Filters
  const [query, setQuery] = useState('')
  const [type, setType] = useState(ALL)
  const [provider, setProvider] = useState(ALL)

  // New entry form
  const [date, setDate] = useState(() => isoDate(clock()))
  const [code, setCode] = useState('')
  const [description, setDescription] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [showErrors, setShowErrors] = useState(false)
  const [added, setAdded] = useState<Service | null>(null)

  const needle = query.trim().toLowerCase()
  const visible = services.filter(
    (s) =>
      (!needle || s.code.toLowerCase().includes(needle) || s.description.toLowerCase().includes(needle)) &&
      (type === ALL || s.type === type) &&
      (provider === ALL || s.provider === provider),
  )
  const summary = summarize(services)

  const errors = {
    date: date ? undefined : 'Datum angeben.',
    code: code.trim() ? undefined : 'Tarifposition angeben.',
    description: description.trim() ? undefined : 'Bezeichnung angeben.',
    quantity: /^[1-9]\d*$/.test(quantity.trim()) ? undefined : 'Ganze Zahl ab 1 angeben.',
  }
  const invalid = Object.values(errors).some(Boolean)

  const resetFilters = () => {
    setQuery('')
    setType(ALL)
    setProvider(ALL)
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (invalid) {
      setShowErrors(true)
      return
    }
    const trimmedCode = code.trim()
    const known = catalog[trimmedCode] as (typeof catalog)[string] | undefined
    const service: Service = {
      id: `new-${services.length + 1}`,
      date,
      time: clockTime(clock()),
      code: trimmedCode,
      description: description.trim(),
      quantity: Number(quantity),
      status: 'Erfasst',
      type: known?.type,
      provider: DEFAULT_PROVIDER,
      taxpoints: known?.taxpoints ?? 0,
    }
    onAdd(service)
    setAdded(service)
    setDate(isoDate(clock()))
    setCode('')
    setDescription('')
    setQuantity('1')
    setShowErrors(false)
  }

  return (
    <div className={styles.twoColumns}>
      <div className={styles.column}>
        <Card title="Filter">
          <div className={styles.stack}>
            <TextField
              label="Suche"
              type="search"
              placeholder="Code oder Bezeichnung …"
              leadingIcon={<Icon name="search" />}
              value={query}
              onChange={setQuery}
            />
            <Select label="Leistungsart" options={typeOptions} value={type} onChange={setType} />
            <Select label="Erbringer" options={providerOptions} value={provider} onChange={setProvider} />
            <div>
              <Button variant="secondary" onClick={resetFilters}>
                Filter zurücksetzen
              </Button>
            </div>
          </div>
        </Card>

        <Card title="Zusammenfassung">
          <dl className={styles.summary}>
            <div className={styles.summaryRow}>
              <dt><Text>Leistungen</Text></dt>
              <dd><Text weight="medium">{summary.count}</Text></dd>
            </div>
            <div className={styles.summaryRow}>
              <dt><Text>Taxpunkte</Text></dt>
              <dd><Text weight="medium">{formatTaxpoints(summary.taxpoints)}</Text></dd>
            </div>
            <div className={styles.summaryRow}>
              <dt><Text>Zu prüfen</Text></dt>
              <dd>
                <Badge tone="warning" variant="outline" size="sm">
                  {summary.toReview}
                </Badge>
              </dd>
            </div>
            <div className={styles.summaryRow}>
              <dt><Text>Nicht verrechenbar</Text></dt>
              <dd>
                {summary.notBillable > 0 ? (
                  <Badge tone="danger" variant="outline" size="sm">
                    {summary.notBillable}
                  </Badge>
                ) : (
                  <Text weight="medium">0</Text>
                )}
              </dd>
            </div>
          </dl>
        </Card>
      </div>

      <Card title="Leistungen">
        <div className={styles.sections}>
          {/* Tinted panel: no subtle Card/Panel variant exists (known gap), so a native div uses --surface-subtle. */}
          <form className={styles.entryPanel} aria-label="Neue Leistung erfassen" onSubmit={submit} noValidate>
            <Heading level={3}>Neue Leistung erfassen</Heading>
            <div className={styles.entryFields}>
              <TextField
                label="Datum"
                type="date"
                value={date}
                onChange={setDate}
                required
                invalid={showErrors && Boolean(errors.date)}
                errorText={errors.date}
              />
              <TextField
                label="Tarifposition"
                placeholder="z. B. 00.0010"
                leadingIcon={<Icon name="search" />}
                value={code}
                onChange={setCode}
                required
                invalid={showErrors && Boolean(errors.code)}
                errorText={errors.code}
              />
              <TextField
                label="Bezeichnung"
                value={description}
                onChange={setDescription}
                required
                invalid={showErrors && Boolean(errors.description)}
                errorText={errors.description}
              />
              <TextField
                label="Menge"
                type="number"
                min={1}
                step={1}
                value={quantity}
                onChange={setQuantity}
                required
                invalid={showErrors && Boolean(errors.quantity)}
                errorText={errors.quantity}
              />
              <div className={styles.submitCell}>
                <Button type="submit">Erfassen</Button>
              </div>
            </div>
          </form>

          {added && (
            <Banner tone="success" title="Leistung erfasst" onDismiss={() => setAdded(null)}>
              {added.code} · {added.description} steht jetzt zuoberst in der Liste.
            </Banner>
          )}

          <div className={styles.stack}>
            <Table
              caption="Erfasste Leistungen"
              hideCaption
              columns={columns}
              rows={visible.map((s) => ({
                id: s.id,
                cells: [
                  `${formatDate(s.date)} ${s.time}`,
                  s.code,
                  s.description,
                  s.quantity,
                  <Badge tone={statusTone[s.status]} variant="outline" size="sm">
                    {s.status}
                  </Badge>,
                ],
              }))}
            />
            {visible.length === 0 && (
              // EmptyState doesn't exist yet (known gap).
              <Text tone="muted">Keine Leistungen entsprechen den Filtern.</Text>
            )}
          </div>

          <div>
            <Button variant="secondary" onClick={onLoadMore} disabled={!canLoadMore}>
              {canLoadMore ? 'Weitere laden' : 'Keine weiteren Leistungen'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
