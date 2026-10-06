import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { Heading } from '../Heading/Heading'
import { Text } from '../Text/Text'
import { Card } from './Card'

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    padding: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    header: {
      control: 'inline-radio',
      options: ['none', 'heading'],
      mapping: { none: undefined, heading: <Heading level={3}>Q4 Marketing Budget</Heading> },
    },
    children: { control: false },
  },
  args: {
    padding: 'md',
    children: <Text tone="muted">Submitted by Lena Fischer on 2 October 2026.</Text>,
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithHeader: Story = {
  args: { header: 'heading' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: 'Q4 Marketing Budget' })).toBeVisible()
  },
}

export const AllPaddings: Story = {
  args: { header: 'heading' },
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
      <Card {...args} padding="sm" />
      <Card {...args} padding="md" />
      <Card {...args} padding="lg" />
    </div>
  ),
}
