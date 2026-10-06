import type { Meta, StoryObj } from '@storybook/react-vite'
import { Text } from './Text'

const meta = {
  title: 'Components/Text',
  component: Text,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    tone: { control: 'inline-radio', options: ['default', 'muted'] },
    weight: { control: 'inline-radio', options: ['regular', 'medium'] },
    children: { control: 'text' },
  },
  args: {
    children: 'Lena Fischer asked you to review “Q4 Marketing Budget”.',
    size: 'md',
    tone: 'default',
    weight: 'regular',
  },
} satisfies Meta<typeof Text>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Muted: Story = { args: { tone: 'muted', size: 'sm', children: 'Submitted 2 October 2026' } }

export const Medium: Story = { args: { weight: 'medium' } }

export const AllCombinations: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
      {(['md', 'sm'] as const).flatMap((size) =>
        (['default', 'muted'] as const).flatMap((tone) =>
          (['regular', 'medium'] as const).map((weight) => (
            <Text key={`${size}-${tone}-${weight}`} {...args} size={size} tone={tone} weight={weight}>
              {size} · {tone} · {weight}
            </Text>
          )),
        ),
      )}
    </div>
  ),
}
