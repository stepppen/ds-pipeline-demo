import { useState, type ReactNode } from 'react'
import { Avatar } from '../../components/Avatar/Avatar'
import { Badge } from '../../components/Badge/Badge'
import { Button } from '../../components/Button/Button'
import { Heading } from '../../components/Heading/Heading'
import { IconButton } from '../../components/IconButton/IconButton'
import { Tabs } from '../../components/Tabs/Tabs'
import { Text } from '../../components/Text/Text'
import { TextField } from '../../components/TextField/TextField'
import { Icon } from '../../icons/Icon'
import { inert } from './inert'
import { currentUser, patient, tabs } from './mockData'
import styles from './klinik.module.css'

const PANEL_ID = 'klinik-panel'
const TAB_PREFIX = 'klinik-tab'

type KlinikLayoutProps = {
  activeTab: string
  onTabChange: (id: string) => void
  children: ReactNode
}

/** App bar, patient bar and tabs shared by every screen of this prototype; the active tab's content goes in the panel. */
export function KlinikLayout({ activeTab, onTabChange, children }: KlinikLayoutProps) {
  const [query, setQuery] = useState('')

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
          value={activeTab}
          onChange={onTabChange}
          idPrefix={TAB_PREFIX}
        />
      </section>

      <main className={styles.content}>
        <div role="tabpanel" id={PANEL_ID} aria-labelledby={`${TAB_PREFIX}-${activeTab}`}>
          {children}
        </div>
      </main>
    </div>
  )
}
