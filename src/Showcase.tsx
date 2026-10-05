import type { ReactNode } from 'react'
import { Badge } from './components/Badge/Badge'
import { Button } from './components/Button/Button'

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--space-3) 0',
        borderBottom: '1px solid var(--border-default)',
      }}
    >
      <span>{label}</span>
      <span style={{ display: 'flex', gap: 'var(--space-2)' }}>{children}</span>
    </div>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ marginBottom: 'var(--space-5)' }}>
      <h2
        style={{
          fontSize: 'var(--font-size-lg)',
          marginBottom: 'var(--space-2)',
          color: 'var(--text-default)',
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  )
}

export function Showcase() {
  return (
    <div
      style={{
        maxWidth: 720,
        margin: '0 auto',
        padding: 'var(--space-5)',
        fontFamily: 'system-ui, sans-serif',
        color: 'var(--text-default)',
      }}
    >
      <h1 style={{ marginBottom: 'var(--space-5)' }}>Release dashboard</h1>

      <Section title="Documents">
        <Row label="Onboarding guide">
          <Badge variant="solid">Published</Badge>
        </Row>
        <Row label="Security policy">
          <Badge variant="outline">Draft</Badge>
        </Row>
        <Row label="Data retention">
          <Badge variant="solid" size="sm">In review</Badge>
        </Row>
        <Row label="Incident runbook">
          <Badge variant="outline" size="sm">Archived</Badge>
        </Row>
        <Row label="Release notes 4.2">
          <Badge variant="solid">Approved</Badge>
        </Row>
        <Row label="Migration plan">
          <Badge variant="outline">Blocked</Badge>
        </Row>
      </Section>

      <Section title="Releases">
        <Row label="4.3.0">
          <Badge variant="solid" size="sm">Shipped</Badge>
        </Row>
        <Row label="4.4.0">
          <Badge variant="outline" size="sm">Staging</Badge>
        </Row>
        <Row label="4.5.0">
          <Badge variant="outline" size="sm">Planned</Badge>
        </Row>
        <Row label="5.0.0">
          <Badge variant="outline" size="sm">Proposal</Badge>
        </Row>
        <Row label="Hotfix 4.3.1">
          <Badge variant="solid" size="sm">Urgent</Badge>
        </Row>
      </Section>

      <Section title="Sizes">
        <Row label="All three">
          <Badge variant="solid" size="sm">Small</Badge>
          <Badge variant="solid" size="md">Medium</Badge>
          <Badge variant="solid" size="lg">Large</Badge>
        </Row>
      </Section>

      <Section title="Environments">
        <Row label="Production">
          <Badge variant="solid">Healthy</Badge>
        </Row>
        <Row label="Staging">
          <Badge variant="outline">Degraded</Badge>
        </Row>
        <Row label="Integration">
          <Badge variant="outline">Offline</Badge>
        </Row>
        <Row label="Local">
          <Badge variant="solid" size="sm">Running</Badge>
        </Row>
      </Section>

      <Section title="Approvals">
        <Row label="Legal review">
          <Badge variant="outline" size="sm">Pending</Badge>
        </Row>
        <Row label="Security sign-off">
          <Badge variant="solid" size="sm">Complete</Badge>
        </Row>
      </Section>

      <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-5)' }}>
        <Button variant="primary">Publish release</Button>
        <Button variant="secondary">Export report</Button>
      </div>
    </div>
  );
}