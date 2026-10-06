import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent } from 'storybook/test'
import { iconPaths } from '../../icons/paths'
import { IconButton } from './IconButton'

const meta = {
  title: 'Components/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  argTypes: {
    icon: { control: 'select', options: Object.keys(iconPaths) },
    'aria-label': { control: 'text' },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    disabled: { control: 'boolean' },
  },
  args: { icon: 'bell', 'aria-label': 'Notifications', size: 'md', disabled: false, onClick: fn() },
} satisfies Meta<typeof IconButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Notifications' }))
    await expect(args.onClick).toHaveBeenCalledOnce()
  },
}

export const Small: Story = { args: { size: 'sm', icon: 'plus', 'aria-label': 'Add entry' } }

export const Keyboard: Story = {
  play: async ({ args, canvas }) => {
    await userEvent.tab()
    await expect(canvas.getByRole('button')).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await expect(args.onClick).toHaveBeenCalledOnce()
  },
}

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ args, canvas }) => {
    await expect(canvas.getByRole('button')).toBeDisabled()
    await expect(args.onClick).not.toHaveBeenCalled()
  },
}

export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
      <IconButton {...args} size="sm" icon="plus" aria-label="Add (small)" />
      <IconButton {...args} size="md" icon="plus" aria-label="Add (medium)" />
      <IconButton {...args} size="md" icon="settings" aria-label="Settings" />
    </div>
  ),
}
