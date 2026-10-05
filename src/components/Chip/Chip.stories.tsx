import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState, type ComponentProps } from 'react'
import { expect, fn, userEvent } from 'storybook/test'
import { Chip } from './Chip'

function ToggleChip(args: ComponentProps<typeof Chip>) {
  const [selected, setSelected] = useState(args.selected)
  return (
    <Chip
      {...args}
      selected={selected}
      onClick={() => {
        args.onClick?.()
        setSelected((current) => !current)
      }}
    />
  )
}

const meta = {
  title: 'Components/Chip',
  component: Chip,
  tags: ['autodocs'],
  argTypes: {
    children: { control: 'text' },
    selected: { control: 'boolean' },
    count: { control: { type: 'number', min: 0 } },
    disabled: { control: 'boolean' },
  },
  args: { children: 'In review', selected: false, disabled: false, onClick: fn() },
  // Local state keyed on the arg, so clicking works in tests and the Controls panel still resets it.
  render: (args) => <ToggleChip key={String(args.selected)} {...args} />,
} satisfies Meta<typeof Chip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ args, canvas }) => {
    const chip = canvas.getByRole('button', { name: 'In review' })
    await expect(chip).toHaveAttribute('aria-pressed', 'false')
    await userEvent.click(chip)
    await expect(args.onClick).toHaveBeenCalledOnce()
    await expect(chip).toHaveAttribute('aria-pressed', 'true')
  },
}

export const Selected: Story = { args: { selected: true } }

export const WithCount: Story = {
  args: { count: 4 },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'In review 4' })).toBeVisible()
  },
}

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('button'))
    await expect(args.onClick).not.toHaveBeenCalled()
  },
}

export const SelectedDisabled: Story = { args: { selected: true, disabled: true } }
