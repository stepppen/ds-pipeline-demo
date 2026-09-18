import './App.css'
import { Badge } from './components/Badge/Badge'

function App() {
  return (
    <div style={{ padding: 40, display: 'flex', gap: 12 }}>
      <Badge size="sm">Draft</Badge>
      <Badge>In review</Badge>
      <Badge type="outline" size="lg">Approved</Badge>
    </div>
  )
}

export default App
