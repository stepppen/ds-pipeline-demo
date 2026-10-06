import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { transactions } from './mockData'
import { Transactions } from './Transactions'

function TransactionsHarness({ initialSelectedId = null }: { initialSelectedId?: string | null }) {
  const [selectedId, setSelectedId] = useState(initialSelectedId)
  return <Transactions transactions={transactions} selectedId={selectedId} onSelect={setSelectedId} />
}

const meta = {
  title: 'Prototypes/Alpin neo-bank/Transactions',
  component: TransactionsHarness,
  parameters: { layout: 'padded', chromatic: { viewports: [375, 1200] } },
  tags: ['!manifest'],
} satisfies Meta<typeof TransactionsHarness>

export default meta
type Story = StoryObj<typeof meta>

export const NothingSelected: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Select a transaction to see its details.')).toBeVisible()
    await expect(canvas.getByRole('button', { name: /^All/ })).toHaveTextContent('12')
    await expect(canvas.getByRole('button', { name: /^Pending/ })).toHaveTextContent('2')
  },
}

export const OpenDetail: Story = {
  play: async ({ canvas }) => {
    const row = canvas.getByRole('button', { name: /Galaxus/ })
    await userEvent.click(row)
    await expect(row).toHaveAttribute('aria-current', 'true')
    const detail = canvas.getByRole('region', { name: 'Galaxus transaction' })
    await expect(detail).toHaveTextContent("− CHF 349.00")
    await expect(detail).toHaveTextContent('03.10.2026')
    await expect(detail).toHaveTextContent('Shopping')
    await expect(detail).toHaveTextContent('ALP-20261003-2240')
    await expect(within(detail).getAllByText('Pending').length).toBeGreaterThan(0)
  },
}

export const SalarySelected: Story = { args: { initialSelectedId: 't7' } }

export const SearchAndFilter: Story = {
  play: async ({ canvas }) => {
    await userEvent.type(canvas.getByRole('searchbox', { name: 'Search transactions' }), 'coop')
    await expect(canvas.getAllByRole('button', { name: /Coop/ })).toHaveLength(2)
    await expect(canvas.getByRole('button', { name: /^Out/ })).toHaveTextContent('2')
    await expect(canvas.getByRole('button', { name: /^In/ })).toHaveTextContent('0')

    await userEvent.clear(canvas.getByRole('searchbox'))
    await userEvent.click(canvas.getByRole('button', { name: /^In/ }))
    await expect(canvas.getByRole('button', { name: /^In/ })).toHaveAttribute('aria-pressed', 'true')
    await expect(canvas.getAllByRole('button', { name: /\+ CHF/ })).toHaveLength(3)
  },
}

export const NoResults: Story = {
  play: async ({ canvas }) => {
    await userEvent.type(canvas.getByRole('searchbox', { name: 'Search transactions' }), 'Manor')
    await expect(canvas.getByText('No transactions match your search.')).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'Clear filters' }))
    await expect(canvas.getAllByRole('button', { name: /CHF/ })).toHaveLength(12)
  },
}
