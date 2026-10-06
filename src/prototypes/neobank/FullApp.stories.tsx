import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { Neobank } from './Neobank'

const meta = {
  title: 'Prototypes/Alpin neo-bank/Full app',
  component: Neobank,
  parameters: { layout: 'fullscreen', chromatic: { viewports: [375, 1200] } },
  tags: ['!manifest'],
} satisfies Meta<typeof Neobank>

export default meta
type Story = StoryObj<typeof meta>

const nav = (canvasElement: HTMLElement) => within(canvasElement.querySelector('nav') as HTMLElement)

export const ClickThrough: Story = {
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole('heading', { level: 1, name: 'Alpin' })).toBeVisible()
    for (const [screen, heading] of [
      ['Transactions', 'Transactions'],
      ['Transfer', 'Send money'],
      ['Cards', 'Card controls'],
      ['Dashboard', 'This month'],
    ]) {
      await userEvent.click(nav(canvasElement).getByRole('button', { name: screen }))
      await expect(nav(canvasElement).getByRole('button', { name: screen })).toHaveAttribute('aria-pressed', 'true')
      await expect(canvas.getByRole('heading', { name: heading })).toBeVisible()
    }
  },
}

export const DashboardRowOpensDetail: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: /Galaxus/ }))
    await expect(canvas.getByRole('button', { name: /Galaxus/ })).toHaveAttribute('aria-current', 'true')
    const detail = canvas.getByRole('region', { name: 'Galaxus transaction' })
    await expect(detail).toHaveTextContent('− CHF 349.00')
    await expect(detail).toHaveTextContent('Shopping')
  },
}

export const SentTransferAppearsAsPending: Story = {
  play: async ({ canvas, canvasElement }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Send' }))
    await userEvent.type(canvas.getByRole('textbox', { name: /Recipient/ }), 'Marco Rossi')
    await userEvent.type(canvas.getByRole('textbox', { name: /Amount/ }), '250')
    await userEvent.click(canvas.getByRole('button', { name: 'Continue' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Confirm and send' }))
    await expect(canvas.getByRole('status')).toHaveTextContent('CHF 250.00 sent to Marco Rossi')

    await userEvent.click(nav(canvasElement).getByRole('button', { name: 'Dashboard' }))
    await expect(canvas.getByRole('heading', { name: "CHF 11'982.40" })).toBeVisible()
    const firstRow = canvas.getAllByRole('button', { name: /CHF/ })[0]
    await expect(firstRow).toHaveTextContent('Marco Rossi')
    await expect(firstRow).toHaveTextContent('Pending')
    await expect(firstRow).toHaveTextContent('− CHF 250.00')

    await userEvent.click(nav(canvasElement).getByRole('button', { name: 'Transactions' }))
    await userEvent.click(canvas.getByRole('button', { name: /^Pending/ }))
    await expect(canvas.getByRole('button', { name: /^Pending/ })).toHaveTextContent('3')
  },
}

export const UndoRemovesTransfer: Story = {
  play: async ({ canvas, canvasElement }) => {
    await userEvent.click(nav(canvasElement).getByRole('button', { name: 'Transfer' }))
    await userEvent.type(canvas.getByRole('textbox', { name: /Recipient/ }), 'Marco Rossi')
    await userEvent.type(canvas.getByRole('textbox', { name: /Amount/ }), '250')
    await userEvent.click(canvas.getByRole('button', { name: 'Continue' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Confirm and send' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Undo' }))

    await userEvent.click(nav(canvasElement).getByRole('button', { name: 'Dashboard' }))
    await expect(canvas.getByRole('heading', { name: "CHF 12'232.40" })).toBeVisible()
    await expect(canvas.queryByRole('button', { name: /Marco Rossi/ })).toBeNull()
  },
}

export const FrozenCard: Story = {
  args: { initialScreen: 'cards' },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Freeze card' }))
    await expect(canvas.getByRole('status')).toHaveTextContent('Card frozen')
    await expect(canvas.getByText('Frozen')).toBeVisible()
  },
}
