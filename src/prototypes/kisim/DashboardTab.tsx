import { Banner } from '../../components/Banner/Banner'
import { Card } from '../../components/Card/Card'
import { IconButton } from '../../components/IconButton/IconButton'
import { ListRow } from '../../components/ListRow/ListRow'
import { Table } from '../../components/Table/Table'
import { Text } from '../../components/Text/Text'
import { Icon } from '../../icons/Icon'
import { appointments, diagnoses, labColumns, labRows, orders, progressNotes, reports, vitals } from './mockData'
import { inert } from './inert'
import styles from './kisim.module.css'


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

export function DashboardTab() {
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
