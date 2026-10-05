import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, userEvent } from 'storybook/test'
import { Chip } from './Chip'
import { ChipGroup } from './ChipGroup'

const statuses = [
  { label: 'All', count: 8 },
  { label: 'New', count: 4 },
  { label: 'In review', count: 3 },
  { label: 'Changes requested', count: 1 },
  { label: 'Approved', count: 0 },
]

function StatusFilter({ label }: { label: string }) {
  const [selected, setSelected] = useState('All')
  return (
    <ChipGroup label={label}>
      {statuses.map((status) => (
        <Chip
          key={status.label}
          count={status.count}
          selected={selected === status.label}
          onClick={() => setSelected(status.label)}
        >
          {status.label}
        </Chip>
      ))}
    </ChipGroup>
  )
}

const meta = {
  title: 'Components/ChipGroup',
  component: ChipGroup,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
  },
  args: { label: 'Filter by status', children: null },
  render: (args) => <StatusFilter label={args.label} />,
} satisfies Meta<typeof ChipGroup>

export default meta
type Story = StoryObj<typeof meta>

export const SingleSelectFilter: Story = {
  play: async ({ canvas }) => {
    const group = canvas.getByRole('group', { name: 'Filter by status' })
    await expect(group).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'New 4' }))
    await expect(canvas.getByRole('button', { name: 'New 4' })).toHaveAttribute('aria-pressed', 'true')
    await expect(canvas.getByRole('button', { name: 'All 8' })).toHaveAttribute('aria-pressed', 'false')
  },
}
