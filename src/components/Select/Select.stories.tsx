import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState, type ComponentProps } from 'react'
import { expect, fn, userEvent } from 'storybook/test'
import { TextField } from '../TextField/TextField'
import { Select } from './Select'

function ControlledSelect(args: ComponentProps<typeof Select>) {
  const [value, setValue] = useState(args.value)
  return (
    <Select
      {...args}
      value={value}
      onChange={(next) => {
        args.onChange?.(next)
        setValue(next)
      }}
    />
  )
}

const options = [
  { value: 'consultation', label: 'Consultation' },
  { value: 'lab', label: 'Laboratory' },
  { value: 'imaging', label: 'Imaging' },
  { value: 'therapy', label: 'Therapy' },
]

const meta = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    hideLabel: { control: 'boolean' },
    value: { control: 'inline-radio', options: ['', ...options.map((option) => option.value)] },
    placeholder: { control: 'text' },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
    helperText: { control: 'text' },
    errorText: { control: 'text' },
    required: { control: 'boolean' },
  },
  args: {
    label: 'Service type',
    value: 'consultation',
    options,
    size: 'md',
    disabled: false,
    invalid: false,
    required: false,
    onChange: fn(),
  },
  render: (args) => <ControlledSelect key={args.value} {...args} />,
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ args, canvas }) => {
    const select = canvas.getByRole('combobox', { name: 'Service type' })
    await expect(select).toHaveValue('consultation')
    await userEvent.selectOptions(select, 'lab')
    await expect(args.onChange).toHaveBeenCalledWith('lab')
    await expect(select).toHaveValue('lab')
  },
}

export const Small: Story = { args: { size: 'sm' } }

export const WithPlaceholder: Story = {
  args: { value: '', placeholder: 'Choose a type …' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('combobox')).toHaveDisplayValue('Choose a type …')
  },
}

export const RequiredPlaceholder: Story = {
  args: { value: '', placeholder: 'Choose a type …', required: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('option', { name: 'Choose a type …' })).toBeDisabled()
  },
}

export const WithHelperText: Story = {
  args: { helperText: 'Filters the list below.' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('combobox')).toHaveAccessibleDescription('Filters the list below.')
  },
}

export const Invalid: Story = {
  args: { value: '', placeholder: 'Choose a type …', invalid: true, errorText: 'Choose a service type.' },
  play: async ({ canvas }) => {
    const select = canvas.getByRole('combobox')
    await expect(select).toHaveAttribute('aria-invalid', 'true')
    await expect(select).toHaveAccessibleDescription('Choose a service type.')
  },
}

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('combobox')).toBeDisabled()
  },
}

export const HiddenLabel: Story = {
  args: { hideLabel: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('combobox', { name: 'Service type' })).toBeVisible()
  },
}

// Native <select>: the browser handles keyboard selection; we only check it's in the tab order.
export const Keyboard: Story = {
  play: async ({ canvas }) => {
    await userEvent.tab()
    await expect(canvas.getByRole('combobox')).toHaveFocus()
  },
}

export const NextToTextField: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', alignItems: 'end' }}>
      <ControlledSelect {...args} />
      <TextField label="Quantity" type="number" value="1" min={1} />
    </div>
  ),
}
