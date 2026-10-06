import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent } from 'storybook/test'
import { Dashboard } from './Dashboard'
import { transactions } from './mockData'

const meta = {
  title: 'Prototypes/Alpin neo-bank/Dashboard',
  component: Dashboard,
  parameters: { layout: 'padded', chromatic: { viewports: [375, 1200] } },
  tags: ['!manifest'],
  args: { transactions, onNavigate: fn(), onOpenTransaction: fn() },
} satisfies Meta<typeof Dashboard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: "CHF 12'232.40" })).toBeVisible()
    await expect(canvas.getByText("CHF 6'895.00")).toBeVisible()
    await expect(canvas.getAllByRole('button', { name: /CHF/ })).toHaveLength(5)
    await expect(canvas.getByText("CHF 4'207.95")).toBeVisible()
    await expect(canvas.getByRole('button', { name: /Lukas Meier/ })).toHaveTextContent('+ CHF 45.00')
  },
}

export const QuickActions: Story = {
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Send' }))
    await expect(args.onNavigate).toHaveBeenCalledWith('transfer')
    await userEvent.click(canvas.getByRole('button', { name: 'See all' }))
    await expect(args.onNavigate).toHaveBeenCalledWith('transactions')
    await userEvent.click(canvas.getByRole('button', { name: 'Top up' }))
    await expect(canvas.getByRole('status')).toHaveTextContent('Top up isn’t part of this demo')
    await userEvent.click(canvas.getByRole('button', { name: 'Dismiss' }))
    await expect(canvas.queryByRole('status')).toBeNull()
  },
}

export const OpenRecentTransaction: Story = {
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: /Galaxus/ }))
    await expect(args.onOpenTransaction).toHaveBeenCalledWith('t9')
  },
}

export const NewAccount: Story = {
  args: { transactions: [] },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: "CHF 8'124.05" })).toBeVisible()
  },
}
