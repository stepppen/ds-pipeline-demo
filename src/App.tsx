import { useEffect, useState } from 'react'
import { Button } from './components/Button/Button'
import { Card } from './components/Card/Card'
import { Heading } from './components/Heading/Heading'
import { ListRow } from './components/ListRow/ListRow'
import { Text } from './components/Text/Text'
import { prototypes } from './prototypes/registry'
import { Showcase } from './Showcase'
import styles from './App.module.css'

const SHOWCASE_ROUTE = '/showcase'

const currentRoute = () => window.location.hash.replace(/^#/, '') || '/'

const navigate = (route: string) => {
  window.location.hash = route
}

function Gallery() {
  return (
    <main className={styles.gallery}>
      <div className={styles.intro}>
        <Heading level={1}>Prototypes</Heading>
        <Text tone="muted">Throwaway screens built only from the design system in src/components.</Text>
      </div>
      <Card padding="sm">
        {prototypes.map((prototype) => (
          <ListRow
            key={prototype.route}
            title={prototype.name}
            subtitle={prototype.description}
            trailing={`#${prototype.route}`}
            onClick={() => navigate(prototype.route)}
          />
        ))}
        <ListRow
          title="Component showcase"
          subtitle="The original release dashboard showcase."
          trailing={`#${SHOWCASE_ROUTE}`}
          onClick={() => navigate(SHOWCASE_ROUTE)}
        />
      </Card>
    </main>
  )
}

function App() {
  const [route, setRoute] = useState(currentRoute)

  useEffect(() => {
    const onHashChange = () => setRoute(currentRoute())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const prototype = prototypes.find((entry) => entry.route === route)
  const page = prototype ? <prototype.component /> : route === SHOWCASE_ROUTE ? <Showcase /> : null
  if (!page) return <Gallery />

  return (
    <>
      <div className={styles.back}>
        <Button variant="secondary" size="sm" onClick={() => navigate('/')}>
          ← All prototypes
        </Button>
      </div>
      {page}
    </>
  )
}

export default App
