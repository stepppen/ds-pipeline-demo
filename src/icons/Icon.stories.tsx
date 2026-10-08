import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { Icon, type IconName } from './Icon'
import { iconPaths } from './paths'

const names = Object.keys(iconPaths) as IconName[]

const meta = {
  title: 'Components/Icon',
  component: Icon,
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'select', options: names },
    size: { control: 'inline-radio', options: ['1em', 'var(--size-icon-sm)', 'var(--size-icon-md)'] },
    label: { control: 'text' },
  },
  args: { name: 'bell', size: 'var(--size-icon-md)' },
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  },
}

export const WithLabel: Story = {
  args: { label: 'Notifications' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('img', { name: 'Notifications' })).toBeVisible()
  },
}

export const InheritsTextSize: Story = {
  args: { size: undefined },
  render: (args) => (
    <span style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--surface-action)' }}>
      <Icon {...args} /> 1em follows font size and colour
    </span>
  ),
}

export const AllIcons: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, max-content)', gap: 'var(--space-4)' }}>
      {names.map((name) => (
        <span key={name} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Icon {...args} name={name} />
          {name}
        </span>
      ))}
    </div>
  ),
}
