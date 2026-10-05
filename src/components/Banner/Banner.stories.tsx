import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent } from 'storybook/test'
import { Button } from '../Button/Button'
import { Banner } from './Banner'

const meta = {
  title: 'Components/Banner',
  component: Banner,
  tags: ['autodocs'],
  argTypes: {
    tone: { control: 'inline-radio', options: ['info', 'success', 'warning', 'danger'] },
    title: { control: 'text' },
    children: { control: 'text' },
    action: {
      control: 'inline-radio',
      options: ['none', 'undo'],
      mapping: { none: undefined, undo: <Button variant="secondary" size="sm">Undo</Button> },
    },
    onDismiss: { control: 'inline-radio', options: ['none', 'dismissible'], mapping: { none: undefined, dismissible: fn() } },
  },
  args: {
    tone: 'info',
    title: 'Review requested',
    children: 'Lena Fischer asked you to review “Q4 Marketing Budget”.',
  },
} satisfies Meta<typeof Banner>

export default meta
type Story = StoryObj<typeof meta>

export const Info: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('status')).toHaveTextContent('Review requested')
  },
}

export const Success: Story = {
  args: { tone: 'success', title: 'Document approved', children: '“Q4 Marketing Budget” was approved.' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('status')).toBeVisible()
  },
}

export const Warning: Story = {
  args: { tone: 'warning', title: 'Changes requested', children: 'The submitter has been asked to revise this document.' },
}

export const Danger: Story = {
  args: { tone: 'danger', title: 'Approval failed', children: 'The document could not be approved. Try again.' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('alert')).toHaveTextContent('Approval failed')
  },
}

export const WithAction: Story = {
  args: { tone: 'success', title: 'Document approved', children: '“Q4 Marketing Budget” was approved.', action: 'undo' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Undo' })).toBeVisible()
  },
}

export const Dismissible: Story = {
  args: { onDismiss: fn() },
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Dismiss' }))
    await expect(args.onDismiss).toHaveBeenCalledOnce()
  },
}

export const TitleOnly: Story = { args: { tone: 'success', title: '3 documents approved', children: undefined } }
