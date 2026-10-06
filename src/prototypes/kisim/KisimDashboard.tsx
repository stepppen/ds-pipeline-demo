import { useState } from 'react'
import { Card } from '../../components/Card/Card'
import { Text } from '../../components/Text/Text'
import { DashboardTab } from './DashboardTab'
import { KisimLayout } from './KisimLayout'
import { LeistungenTab } from './LeistungenTab'
import { moreServices, seedServices } from './leistungen'
import { tabs } from './mockData'

type KisimDashboardProps = {
  initialTab?: string
  /** Current time for new Leistungen; stories pin it so snapshots don't drift. */
  clock?: () => Date
}

const systemClock = () => new Date()

export function KisimDashboard({ initialTab = 'dashboard', clock = systemClock }: KisimDashboardProps) {
  const [tab, setTab] = useState(initialTab)
  // Lifted here so captured Leistungen survive switching tabs.
  const [services, setServices] = useState(seedServices)
  const [moreLoaded, setMoreLoaded] = useState(false)
  const activeTab = tabs.find((item) => item.id === tab) ?? tabs[0]

  return (
    <KisimLayout activeTab={activeTab.id} onTabChange={setTab}>
      {activeTab.id === 'dashboard' ? (
        <DashboardTab />
      ) : activeTab.id === 'leistungen' ? (
        <LeistungenTab
          services={services}
          canLoadMore={!moreLoaded}
          onAdd={(service) => setServices((list) => [service, ...list])}
          onLoadMore={() => {
            setServices((list) => [...list, ...moreServices])
            setMoreLoaded(true)
          }}
          clock={clock}
        />
      ) : (
        // EmptyState doesn't exist yet (known gap); approximated with a Card and muted Text.
        <Card title={activeTab.label}>
          <Text tone="muted">Für diesen Bereich gibt es im Prototyp noch keine Inhalte.</Text>
        </Card>
      )}
    </KisimLayout>
  )
}
