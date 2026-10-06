import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, type within } from 'storybook/test'
import { transactions } from './mockData'
import { Transfer } from './Transfer'

const meta = {
  title: 'Prototypes/Alpin neo-bank/Transfer',
  component: Transfer,
  parameters: { layout: 'padded', chromatic: { viewports: [375, 1200] } },
  tags: ['!manifest'],
  args: { transactions, onSend: fn(), onUndo: fn(), onViewTransaction: fn() },
} satisfies Meta<typeof Transfer>

export default meta
type Story = StoryObj<typeof meta>

type Canvas = ReturnType<typeof within>

const fillForm = async (canvas: Canvas) => {
  await userEvent.type(canvas.getByRole('textbox', { name: /Recipient/ }), 'Anna Müller')
  await userEvent.type(canvas.getByRole('textbox', { name: /Amount/ }), "1'250.50")
  await userEvent.type(canvas.getByRole('textbox', { name: /Message/ }), 'Ferienwohnung Arosa')
  await userEvent.click(canvas.getByRole('button', { name: 'Continue' }))
}

export const Form: Story = {}

export const ValidationErrors: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Continue' }))
    await expect(canvas.getByRole('textbox', { name: /Recipient/ })).toHaveAttribute('aria-invalid', 'true')
    await expect(canvas.getByRole('textbox', { name: /Amount/ })).toHaveAccessibleDescription(/Enter an amount/)

    await userEvent.type(canvas.getByRole('textbox', { name: /Amount/ }), '99999')
    await expect(canvas.getByRole('textbox', { name: /Amount/ })).toHaveAccessibleDescription(/more than your balance/)
  },
}

export const Confirm: Story = {
  play: async ({ canvas }) => {
    await fillForm(canvas)
    await expect(canvas.getByRole('heading', { name: 'Check and confirm' })).toBeVisible()
    await expect(canvas.getByText("CHF 1'250.50")).toBeVisible()
    await expect(canvas.getByText('Ferienwohnung Arosa')).toBeVisible()

    await userEvent.click(canvas.getByRole('button', { name: 'Back' }))
    await expect(canvas.getByRole('textbox', { name: /Recipient/ })).toHaveValue('Anna Müller')
  },
}

export const Sent: Story = {
  play: async ({ args, canvas }) => {
    await fillForm(canvas)
    await userEvent.click(canvas.getByRole('button', { name: 'Confirm and send' }))
    await expect(args.onSend).toHaveBeenCalledWith(
      expect.objectContaining({ merchant: 'Anna Müller', amount: -125_050, status: 'Pending' }),
    )
    await expect(canvas.getByRole('status')).toHaveTextContent("CHF 1'250.50 sent to Anna Müller")
  },
}

export const Undo: Story = {
  play: async ({ args, canvas }) => {
    await fillForm(canvas)
    await userEvent.click(canvas.getByRole('button', { name: 'Confirm and send' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Undo' }))
    await expect(args.onUndo).toHaveBeenCalledWith('transfer-0013')
    await expect(canvas.getByRole('status')).toHaveTextContent('Transfer cancelled')
    await expect(canvas.getByRole('textbox', { name: /Amount/ })).toHaveValue("1'250.50")
  },
}
