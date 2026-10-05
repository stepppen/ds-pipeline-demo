import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from './Badge'

const tones = ['neutral', 'success', 'warning', 'danger'] as const
const variants = ['solid', 'outline'] as const

const meta = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'inline-radio', options: variants },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    tone: { control: 'inline-radio', options: tones },
    children: { control: 'text' },
  },
  args: { children: 'In review', variant: 'solid', size: 'md', tone: 'neutral' },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Outline: Story = { args: { variant: 'outline' } }

export const Success: Story = { args: { tone: 'success', children: 'Approved' } }
export const Warning: Story = { args: { tone: 'warning', children: 'Changes requested' } }
export const Danger: Story = { args: { tone: 'danger', children: 'Rejected' } }

export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
      <Badge {...args} size="sm">Small</Badge>
      <Badge {...args} size="md">Medium</Badge>
      <Badge {...args} size="lg">Large</Badge>
    </div>
  ),
}

export const AllTones: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, max-content)', gap: 'var(--space-3)' }}>
      {variants.flatMap((variant) =>
        tones.map((tone) => (
          <Badge key={`${variant}-${tone}`} {...args} variant={variant} tone={tone}>
            {tone}
          </Badge>
        )),
      )}
    </div>
  ),
}
