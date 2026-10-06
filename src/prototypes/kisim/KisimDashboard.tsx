import { useState } from 'react'
import { Avatar } from '../../components/Avatar/Avatar'
import { Badge } from '../../components/Badge/Badge'
import { Banner } from '../../components/Banner/Banner'
import { Button } from '../../components/Button/Button'
import { Card } from '../../components/Card/Card'
import { Heading } from '../../components/Heading/Heading'
import { IconButton } from '../../components/IconButton/IconButton'
import { ListRow } from '../../components/ListRow/ListRow'
import { Table } from '../../components/Table/Table'
import { Tabs } from '../../components/Tabs/Tabs'
import { Text } from '../../components/Text/Text'
import { TextField } from '../../components/TextField/TextField'
import { Icon } from '../../icons/Icon'
import {
  appointments,
  currentUser,
  diagnoses,
  labColumns,
  labRows,
  orders,
  patient,
  progressNotes,
  reports,
  tabs,
  vitals,
} from './mockData'
import styles from './kisim.module.css'

const PANEL_ID = 'kisim-panel'
const TAB_PREFIX = 'kisim-tab'

// Rows are inert in this prototype, but clickable so they get hover and focus states.
const inert = () => {}

type Entry = (typeof orders)[number]

function EntryRows({ entries }: { entries: Entry[] }) {
  return entries.map((entry) => (
    <ListRow
      key={entry.title}
      leading={<Icon name={entry.icon} size="var(--size-icon-md)" />}
      title={entry.title}
      subtitle={entry.meta}
      trailing={<Icon name="chevron-right" size="var(--size-icon-sm)" />}
      onClick={inert}
      divider={false}
    />
  ))
}

function DashboardColumns() {
  return (
    <div className={styles.columns}>
      <div className={styles.column}>
        <Card title="CAVE" count={2}>
          <div className={styles.stack}>
            <Banner tone="danger" icon={<Icon name="cross-circle" />} title="Allergien">
              Röntgenkontrastmittel, Heftpflaster
            </Banner>
            <Banner tone="warning" icon={<Icon name="alert-circle" />} title="Patientenverfügung">
              Status unbekannt – bitte erfassen
            </Banner>
          </div>
        </Card>

        <Card title="Vitalparameter">
          <dl className={styles.vitals}>
            {vitals.map((vital) => (
              <div key={vital.label} className={styles.vitalRow}>
                <dt>
                  <Text>{vital.label}</Text>
                </dt>
                <dd>
                  <Text weight="medium">{vital.value}</Text>
                </dd>
                <dd className={styles.timestamp}>
                  <Text size="sm" tone="muted">
                    {vital.time}
                  </Text>
                </dd>
              </div>
            ))}
          </dl>
        </Card>

        <Card title="Aktuelle Verordnungen" count={orders.length}>
          <EntryRows entries={orders} />
        </Card>
      </div>

      <div className={styles.column}>
        <Card title="Diagnosen" count={diagnoses.length}>
          <EntryRows entries={diagnoses} />
        </Card>

        <Card title="Laborwerte">
          <Table
            caption="Laborwerte"
            hideCaption
            columns={labColumns}
            rows={labRows}
            flagLabels={{ L: 'niedrig', H: 'hoch' }}
          />
        </Card>
      </div>

      <div className={styles.column}>
        <Card
          title="Verlaufseinträge Ärzte"
          count={progressNotes.length}
          action={<IconButton icon="plus" size="sm" aria-label="Verlaufseintrag hinzufügen" onClick={inert} />}
        >
          <div className={styles.stack}>
            <div>
              <EntryRows entries={progressNotes} />
            </div>
            <Text tone="muted">Pflege: Keine Einträge in den letzten 2 Tagen.</Text>
          </div>
        </Card>

        <Card
          title="Berichte-Checkliste Neurologie"
          action={<IconButton icon="plus" size="sm" aria-label="Bericht hinzufügen" onClick={inert} />}
        >
          <EntryRows entries={reports} />
        </Card>

        <Card
          title="Bevorstehende Termine"
          count={appointments.length}
          action={<IconButton icon="plus" size="sm" aria-label="Termin hinzufügen" onClick={inert} />}
        >
          <EntryRows entries={appointments} />
        </Card>
      </div>
    </div>
  )
}

type KisimDashboardProps = {
  initialTab?: string
}

export function KisimDashboard({ initialTab = 'dashboard' }: KisimDashboardProps) {
  const [tab, setTab] = useState(initialTab)
  const [query, setQuery] = useState('')
  const activeTab = tabs.find((item) => item.id === tab) ?? tabs[0]

  return (
    <div className={styles.app}>
      <header className={styles.appBar}>
        <Text weight="medium">Klinik Lindenhof · KIS</Text>
        <div className={styles.search}>
          <TextField
            label="Suchen"
            hideLabel
            type="search"
            size="sm"
            placeholder="Suchen (Patient, Fall, Bericht) …"
            leadingIcon={<Icon name="search" />}
            value={query}
            onChange={setQuery}
          />
        </div>
        <div className={styles.trailing}>
          <IconButton icon="bell" aria-label="Benachrichtigungen" onClick={inert} />
          <IconButton icon="settings" aria-label="Einstellungen" onClick={inert} />
          <Avatar name={currentUser} size="sm" decorative={false} />
        </div>
      </header>

      <section className={styles.patient} aria-label="Patient">
        <div className={styles.patientBar}>
          <Avatar name={patient.name} />
          <div className={styles.identity}>
            <Heading level={1}>{patient.name}</Heading>
            <Text tone="muted">{patient.meta}</Text>
          </div>
          <div className={styles.badges}>
            {patient.status.map((status) => (
              <Badge key={status} tone="neutral" size="lg">
                {status}
              </Badge>
            ))}
          </div>
          <div className={styles.trailing}>
            <Button variant="secondary" onClick={inert}>
              <Icon name="calendar" size="var(--size-icon-md)" />
              Termin planen
            </Button>
            <Button onClick={inert}>
              <Icon name="plus" size="var(--size-icon-md)" />
              Eintrag erstellen
            </Button>
          </div>
        </div>
        <Tabs
          label="Patientenakte"
          items={tabs.map((item) => ({ ...item, panelId: PANEL_ID }))}
          value={activeTab.id}
          onChange={setTab}
          idPrefix={TAB_PREFIX}
        />
      </section>

      <main className={styles.content}>
        <div role="tabpanel" id={PANEL_ID} aria-labelledby={`${TAB_PREFIX}-${activeTab.id}`}>
          {activeTab.id === 'dashboard' ? (
            <DashboardColumns />
          ) : (
            // EmptyState doesn't exist yet (known gap); approximated with a Card and muted Text.
            <Card title={activeTab.label}>
              <Text tone="muted">Für diesen Bereich gibt es im Prototyp noch keine Inhalte.</Text>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
