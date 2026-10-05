import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState, type ComponentProps } from 'react'
import { expect, fn, userEvent } from 'storybook/test'
import { Checkbox } from './Checkbox'

function ControlledCheckbox(args: ComponentProps<typeof Checkbox>) {
  const [checked, setChecked] = useState(args.checked)
  const [indeterminate, setIndeterminate] = useState(args.indeterminate)
  return (
    <Checkbox
      {...args}
      checked={checked}
      indeterminate={indeterminate}
      onChange={(next) => {
        args.onChange?.(next)
        setChecked(next)
        setIndeterminate(false)
      }}
    />
  )
}

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    hideLabel: { control: 'boolean' },
    checked: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    label: 'Select Q4 Marketing Budget',
    hideLabel: false,
    checked: false,
    indeterminate: false,
    disabled: false,
    onChange: fn(),
  },
  // Local state keyed on the args, so clicking works in tests and the Controls panel still resets it.
  render: (args) => <ControlledCheckbox key={`${args.checked}-${args.indeterminate}`} {...args} />,
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Unchecked: Story = {
  play: async ({ args, canvas }) => {
    const checkbox = canvas.getByRole('checkbox', { name: 'Select Q4 Marketing Budget' })
    await userEvent.click(checkbox)
    await expect(checkbox).toBeChecked()
    await expect(args.onChange).toHaveBeenCalledWith(true)
  },
}

export const Checked: Story = { args: { checked: true } }

export const Indeterminate: Story = {
  args: { label: 'Select all', indeterminate: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('checkbox', { name: 'Select all' })).toBePartiallyChecked()
  },
}

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ args, canvas }) => {
    const checkbox = canvas.getByRole('checkbox')
    await expect(checkbox).toBeDisabled()
    await userEvent.click(checkbox)
    await expect(args.onChange).not.toHaveBeenCalled()
  },
}

export const DisabledChecked: Story = { args: { disabled: true, checked: true } }

export const HiddenLabel: Story = {
  args: { hideLabel: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('checkbox', { name: 'Select Q4 Marketing Budget' })).toBeVisible()
    await expect(canvas.queryByText('Select Q4 Marketing Budget')).toBeNull()
  },
}

export const Keyboard: Story = {
  play: async ({ canvas }) => {
    await userEvent.tab()
    const checkbox = canvas.getByRole('checkbox')
    await expect(checkbox).toHaveFocus()
    await userEvent.keyboard(' ')
    await expect(checkbox).toBeChecked()
  },
}
