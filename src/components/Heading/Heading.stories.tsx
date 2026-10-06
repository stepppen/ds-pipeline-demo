import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { Heading } from './Heading'

const meta = {
  title: 'Components/Heading',
  component: Heading,
  tags: ['autodocs'],
  argTypes: {
    level: { control: 'inline-radio', options: [1, 2, 3] },
    children: { control: 'text' },
  },
  args: { children: 'Approvals', level: 2 },
} satisfies Meta<typeof Heading>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 2, name: 'Approvals' })).toBeVisible()
  },
}

export const Level1: Story = {
  args: { level: 1 },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 1 })).toBeVisible()
  },
}

export const Level3: Story = { args: { level: 3, children: 'Q4 Marketing Budget' } }

export const AllLevels: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
      <Heading {...args} level={1}>Level 1 — Approvals</Heading>
      <Heading {...args} level={2}>Level 2 — Pending review</Heading>
      <Heading {...args} level={3}>Level 3 — Q4 Marketing Budget</Heading>
    </div>
  ),
}
