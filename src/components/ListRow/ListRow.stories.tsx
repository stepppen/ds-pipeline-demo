import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent } from 'storybook/test'
import { Avatar } from '../Avatar/Avatar'
import { Badge } from '../Badge/Badge'
import { ListRow } from './ListRow'

const meta = {
  title: 'Components/ListRow',
  component: ListRow,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    subtitle: { control: 'text' },
    leading: {
      control: 'inline-radio',
      options: ['none', 'avatar'],
      mapping: { none: undefined, avatar: <Avatar name="Lena Fischer" /> },
    },
    trailing: {
      control: 'inline-radio',
      options: ['none', 'badge', 'amount'],
      mapping: {
        none: undefined,
        badge: <Badge size="sm" tone="warning" variant="outline">Pending</Badge>,
        amount: 'CHF 12,400',
      },
    },
    selected: { control: 'boolean' },
    onClick: { control: 'inline-radio', options: ['none', 'clickable'], mapping: { none: undefined, clickable: fn() } },
  },
  args: {
    title: 'Q4 Marketing Budget',
    subtitle: 'Lena Fischer · 2 Oct',
    leading: 'avatar',
    trailing: 'badge',
    selected: false,
  },
} satisfies Meta<typeof ListRow>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('button')).toBeNull()
    await expect(canvas.getByText('Q4 Marketing Budget')).toBeVisible()
  },
}

export const TitleOnly: Story = { args: { subtitle: undefined, leading: 'none', trailing: 'none' } }

export const WithAmount: Story = { args: { trailing: 'amount' } }

export const Clickable: Story = {
  args: { onClick: fn() },
  play: async ({ args, canvas }) => {
    const row = canvas.getByRole('button', { name: /Q4 Marketing Budget/ })
    await userEvent.click(row)
    await expect(args.onClick).toHaveBeenCalledOnce()
  },
}

export const KeyboardActivation: Story = {
  args: { onClick: fn() },
  play: async ({ args, canvas }) => {
    await userEvent.tab()
    await expect(canvas.getByRole('button')).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await userEvent.keyboard(' ')
    await expect(args.onClick).toHaveBeenCalledTimes(2)
  },
}

export const Selected: Story = {
  args: { onClick: fn(), selected: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button')).toHaveAttribute('aria-current', 'true')
  },
}

const items = [
  { id: 'q4', title: 'Q4 Marketing Budget', who: 'Lena Fischer', amount: 'CHF 12,400' },
  { id: 'travel', title: 'Team offsite travel', who: 'Marco Rossi', amount: 'CHF 3,250' },
  { id: 'laptops', title: 'Laptop refresh', who: 'Aiko Tanaka', amount: 'CHF 18,900' },
]

function SelectableList() {
  const [selectedId, setSelectedId] = useState('q4')
  return (
    <div>
      {items.map((item) => (
        <ListRow
          key={item.id}
          title={item.title}
          subtitle={item.who}
          leading={<Avatar name={item.who} />}
          trailing={item.amount}
          selected={item.id === selectedId}
          onClick={() => setSelectedId(item.id)}
        />
      ))}
    </div>
  )
}

export const List: Story = {
  render: () => <SelectableList />,
  play: async ({ canvas }) => {
    const travel = canvas.getByRole('button', { name: /Team offsite travel/ })
    await userEvent.click(travel)
    await expect(travel).toHaveAttribute('aria-current', 'true')
    await expect(canvas.getByRole('button', { name: /Q4 Marketing Budget/ })).not.toHaveAttribute('aria-current')
  },
}

export const InSemanticList: Story = {
  render: (args) => (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      {items.map((item) => (
        <li key={item.id}>
          <ListRow {...args} title={item.title} subtitle={item.who} leading={<Avatar name={item.who} />} trailing={item.amount} />
        </li>
      ))}
    </ul>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('listitem')).toHaveLength(3)
  },
}
