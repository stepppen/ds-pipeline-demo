import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { Table } from './Table'

const columns = [
  { header: 'Parameter', sortable: true },
  { header: 'Unit', sortable: true },
  { header: '30.05 07:15', sortable: true },
  { header: '28.05 07:45', sortable: true },
  { header: 'Reference', sortable: true },
]

const rows = [
  { id: 'na', cells: ['Sodium', 'mmol/l', { value: 133, flag: 'L' as const }, { value: 134, flag: 'L' as const }, '136–145'] },
  { id: 'k', cells: ['Potassium', 'mmol/l', 4.3, '4.0', '3.5–5.1'] },
  { id: 'crp', cells: ['CRP', 'mg/l', { value: 40, flag: 'H' as const }, { value: 71, flag: 'H' as const }, '< 5'] },
]

const meta = {
  title: 'Components/Table',
  component: Table,
  tags: ['autodocs'],
  argTypes: {
    caption: { control: 'text' },
    hideCaption: { control: 'boolean' },
  },
  args: { caption: 'Lab results', hideCaption: false, columns, rows },
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    const table = canvas.getByRole('table', { name: 'Lab results' })
    await expect(table).toBeVisible()
    await expect(canvas.getAllByRole('columnheader')).toHaveLength(5)
    await expect(canvas.getByRole('rowheader', { name: 'Sodium' })).toBeVisible()
  },
}

export const Flags: Story = {
  play: async ({ canvas }) => {
    const low = canvas.getAllByTitle('Low')
    await expect(low).toHaveLength(2)
    await expect(low[0]).toHaveTextContent('L')
    await expect(canvas.getAllByTitle('High')).toHaveLength(2)
  },
}

export const CustomFlagLabels: Story = {
  args: { flagLabels: { L: 'niedrig', H: 'hoch' } },
  play: async ({ canvas }) => {
    await expect(canvas.getAllByTitle('niedrig')).toHaveLength(2)
  },
}

export const HiddenCaption: Story = {
  args: { hideCaption: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('table', { name: 'Lab results' })).toBeVisible()
  },
}

export const NotSortable: Story = {
  args: { columns: columns.map(({ header }) => ({ header })) },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll('th svg')).toHaveLength(0)
  },
}
