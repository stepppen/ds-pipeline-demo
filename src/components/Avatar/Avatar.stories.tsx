import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { Avatar } from './Avatar'

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'text' },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    decorative: { control: 'boolean' },
  },
  args: { name: 'Lena Fischer', size: 'md', decorative: true },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const avatar = canvasElement.querySelector('[aria-hidden="true"]')
    await expect(avatar).toHaveTextContent('LF')
  },
}

export const Small: Story = { args: { size: 'sm' } }

export const SingleName: Story = {
  args: { name: 'Madonna' },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('[aria-hidden="true"]')).toHaveTextContent('M')
  },
}

export const MultipleNames: Story = {
  args: { name: 'Anna Maria von Berg' },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('[aria-hidden="true"]')).toHaveTextContent('AB')
  },
}

export const NotDecorative: Story = {
  args: { decorative: false },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('img', { name: 'Lena Fischer' })).toHaveTextContent('LF')
  },
}

export const NextToName: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
      <Avatar {...args} size="sm" />
      <span>{args.name}</span>
    </div>
  ),
}
