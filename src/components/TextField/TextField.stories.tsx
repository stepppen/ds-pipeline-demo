import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState, type ComponentProps } from 'react'
import { expect, fn, userEvent } from 'storybook/test'
import { Icon } from '../../icons/Icon'
import { TextField } from './TextField'

function ControlledTextField(args: ComponentProps<typeof TextField>) {
  const [value, setValue] = useState(args.value)
  return (
    <TextField
      {...args}
      value={value}
      onChange={(next) => {
        args.onChange?.(next)
        setValue(next)
      }}
    />
  )
}

const meta = {
  title: 'Components/TextField',
  component: TextField,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    hideLabel: { control: 'boolean' },
    value: { control: 'text' },
    placeholder: { control: 'text' },
    type: { control: 'inline-radio', options: ['text', 'search', 'date', 'number'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
    helperText: { control: 'text' },
    errorText: { control: 'text' },
    multiline: { control: 'boolean' },
    rows: { control: { type: 'number', min: 1 } },
    required: { control: 'boolean' },
    maxLength: { control: { type: 'number', min: 1 } },
    leadingIcon: {
      control: 'inline-radio',
      options: ['none', 'search'],
      mapping: { none: undefined, search: <Icon name="search" /> },
    },
  },
  args: {
    label: 'Document name',
    hideLabel: false,
    value: '',
    placeholder: 'e.g. Q4 Marketing Budget',
    type: 'text',
    size: 'md',
    disabled: false,
    invalid: false,
    multiline: false,
    required: false,
    onChange: fn(),
  },
  // Local state keyed on the arg, so typing works in tests and the Controls panel still resets it.
  render: (args) => <ControlledTextField key={args.value} {...args} />,
} satisfies Meta<typeof TextField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ args, canvas }) => {
    const input = canvas.getByRole('textbox', { name: 'Document name' })
    await userEvent.type(input, 'Budget')
    await expect(input).toHaveValue('Budget')
    await expect(args.onChange).toHaveBeenLastCalledWith('Budget')
  },
}

export const Small: Story = { args: { size: 'sm' } }

export const Search: Story = {
  args: { type: 'search', label: 'Search documents', hideLabel: true, placeholder: 'Search by name or submitter' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('searchbox', { name: 'Search documents' })).toBeVisible()
  },
}

export const WithHelperText: Story = {
  args: { helperText: 'Shown to reviewers in the approval list.' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('textbox')).toHaveAccessibleDescription('Shown to reviewers in the approval list.')
  },
}

export const Invalid: Story = {
  args: { value: 'Q4', invalid: true, errorText: 'Use at least 3 characters.' },
  play: async ({ canvas }) => {
    const input = canvas.getByRole('textbox')
    await expect(input).toHaveAttribute('aria-invalid', 'true')
    await expect(input).toHaveAccessibleDescription('Use at least 3 characters.')
  },
}

export const Disabled: Story = { args: { value: 'Q4 Marketing Budget', disabled: true } }

export const HiddenLabel: Story = {
  args: { hideLabel: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('textbox', { name: 'Document name' })).toBeVisible()
    await expect(canvas.queryByText('Document name')).toBeNull()
  },
}

export const Multiline: Story = {
  args: {
    multiline: true,
    rows: 4,
    required: true,
    maxLength: 500,
    label: 'Comment',
    placeholder: 'What needs to change?',
    helperText: 'Required. Up to 500 characters.',
  },
  play: async ({ canvas }) => {
    const textarea = canvas.getByRole('textbox', { name: 'Comment' })
    await expect(textarea.tagName).toBe('TEXTAREA')
    await expect(textarea).toBeRequired()
    await expect(textarea).toHaveAttribute('maxlength', '500')
  },
}

export const MultilineInvalid: Story = {
  args: { ...Multiline.args, invalid: true, errorText: 'Add a comment before requesting changes.' },
}

export const WithLeadingIcon: Story = {
  args: { label: 'Search records', hideLabel: true, type: 'search', placeholder: 'Search (patient, case, report) …', leadingIcon: 'search' },
  play: async ({ canvas }) => {
    const input = canvas.getByRole('searchbox', { name: 'Search records' })
    await userEvent.type(input, 'Muster')
    await expect(input).toHaveValue('Muster')
  },
}

export const SmallWithLeadingIcon: Story = {
  args: { size: 'sm', label: 'Search records', hideLabel: true, type: 'search', placeholder: 'Search …', leadingIcon: 'search' },
}

export const DateInput: Story = {
  args: { label: 'Date', type: 'date', value: '2022-05-30', placeholder: undefined },
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Date')).toHaveValue('2022-05-30')
  },
}

export const NumberInput: Story = {
  args: { label: 'Quantity', type: 'number', value: '1', min: 1, step: 1, placeholder: undefined },
  play: async ({ canvas }) => {
    const input = canvas.getByRole('spinbutton', { name: 'Quantity' })
    await expect(input).toHaveAttribute('min', '1')
    await userEvent.clear(input)
    await userEvent.type(input, '3')
    await expect(input).toHaveValue(3)
  },
}
