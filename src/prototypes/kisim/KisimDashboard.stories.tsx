import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { KisimDashboard } from './KisimDashboard'

const meta = {
  title: 'Prototypes/KISIM/Dashboard',
  component: KisimDashboard,
  parameters: { layout: 'fullscreen', chromatic: { viewports: [1440] } },
  tags: ['!manifest'],
} satisfies Meta<typeof KisimDashboard>

export default meta
type Story = StoryObj<typeof meta>

export const Dashboard: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 1, name: 'Anna Muster' })).toBeVisible()
    await expect(canvas.getByRole('tab', { name: 'Dashboard' })).toHaveAttribute('aria-selected', 'true')
    for (const title of [
      'CAVE (2)',
      'Vitalparameter',
      'Aktuelle Verordnungen (2)',
      'Diagnosen (1)',
      'Laborwerte',
      'Verlaufseinträge Ärzte (1)',
      'Berichte-Checkliste Neurologie',
      'Bevorstehende Termine (3)',
    ]) {
      await expect(canvas.getByRole('heading', { level: 2, name: title })).toBeVisible()
    }
    await expect(canvas.getByRole('alert')).toHaveTextContent('Röntgenkontrastmittel, Heftpflaster')
    await expect(canvas.getByRole('img', { name: 'Sandra Vogt' })).toHaveTextContent('SV')
  },
}

export const LabValues: Story = {
  play: async ({ canvas }) => {
    const table = canvas.getByRole('table', { name: 'Laborwerte' })
    const natrium = within(table).getByRole('row', { name: /Natrium/ })
    await expect(natrium).toHaveTextContent('133 L')
    await expect(within(table).getAllByTitle('hoch')).toHaveLength(4)
    await expect(within(table).getAllByTitle('niedrig')).toHaveLength(2)
  },
}

export const SwitchTabs: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('tab', { name: 'Diagnosen' }))
    const panel = canvas.getByRole('tabpanel', { name: 'Diagnosen' })
    await expect(panel).toHaveTextContent('Für diesen Bereich gibt es im Prototyp noch keine Inhalte.')
    await expect(canvas.queryByRole('table')).toBeNull()

    await userEvent.keyboard('{ArrowRight}')
    await expect(canvas.getByRole('tab', { name: 'Kurve' })).toHaveFocus()
    await expect(canvas.getByRole('tabpanel', { name: 'Kurve' })).toBeVisible()

    await userEvent.keyboard('{Home}')
    await expect(canvas.getByRole('tabpanel', { name: 'Dashboard' })).toHaveTextContent('Laborwerte')
  },
}

export const EmptyTab: Story = {
  args: { initialTab: 'stammdaten' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 2, name: 'Stammdaten' })).toBeVisible()
  },
}
