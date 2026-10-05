import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent } from 'storybook/test'
import { Button } from './Button'

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    type: { control: 'inline-radio', options: ['button', 'submit', 'reset'] },
    'aria-label': { control: 'text' },
    'aria-pressed': { control: 'inline-radio', options: [undefined, true, false, 'mixed'] },
    children: { control: 'text' },
  },
  args: { children: 'Save changes', variant: 'primary', size: 'md', disabled: false, type: 'button', onClick: fn() },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Save changes' }))
    await expect(args.onClick).toHaveBeenCalledOnce()
  },
}

export const Secondary: Story = { args: { variant: 'secondary' } }

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ args, canvas }) => {
    const button = canvas.getByRole('button', { name: 'Save changes' })
    await expect(button).toBeDisabled()
    await userEvent.click(button)
    await expect(args.onClick).not.toHaveBeenCalled()
  },
}

export const DisabledSecondary: Story = { args: { variant: 'secondary', disabled: true } }

export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
      <Button {...args} size="sm">Small</Button>
      <Button {...args} size="md">Medium</Button>
      <Button {...args} size="lg">Large</Button>
    </div>
  ),
}

export const WithAriaLabel: Story = {
  args: { variant: 'secondary', size: 'sm', children: '×', 'aria-label': 'Dismiss' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Dismiss' })).toBeVisible()
  },
}

export const Toggle: Story = {
  args: { variant: 'secondary', children: 'Bold', 'aria-pressed': true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Bold' })).toHaveAttribute('aria-pressed', 'true')
  },
}

export const Submit: Story = {
  args: { type: 'submit', children: 'Submit' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Submit' })).toHaveAttribute('type', 'submit')
  },
}
