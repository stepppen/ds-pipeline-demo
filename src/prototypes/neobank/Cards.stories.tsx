import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent } from 'storybook/test'
import { Cards } from './Cards'

function CardsHarness({ initialFrozen = false }: { initialFrozen?: boolean }) {
  const [frozen, setFrozen] = useState(initialFrozen)
  return <Cards frozen={frozen} onFrozenChange={setFrozen} />
}

const meta = {
  title: 'Prototypes/Alpin neo-bank/Cards',
  component: CardsHarness,
  parameters: { layout: 'padded', chromatic: { viewports: [375, 1200] } },
  tags: ['!manifest'],
} satisfies Meta<typeof CardsHarness>

export default meta
type Story = StoryObj<typeof meta>

export const Active: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('•••• •••• •••• 4821')).toBeVisible()
    await expect(canvas.getByText('Active')).toBeVisible()
    await expect(canvas.queryByText('Card frozen')).toBeNull()
  },
}

export const Frozen: Story = {
  args: { initialFrozen: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('checkbox', { name: 'Freeze card' })).toBeChecked()
    await expect(canvas.getByText('Frozen')).toBeVisible()
  },
}

export const FreezeAndUnfreeze: Story = {
  play: async ({ canvas }) => {
    const toggle = canvas.getByRole('checkbox', { name: 'Freeze card' })
    await userEvent.click(toggle)
    await expect(canvas.getByRole('status')).toHaveTextContent('Card frozen')
    await expect(canvas.getByText('Frozen')).toBeVisible()

    await userEvent.click(toggle)
    await expect(canvas.queryByRole('status')).toBeNull()
    await expect(canvas.getByText('Active')).toBeVisible()
  },
}
