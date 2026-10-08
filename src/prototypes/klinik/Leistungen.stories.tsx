import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { KlinikDashboard } from './KlinikDashboard'

// Pinned so new entries always get 30.05.2022 11:05 in snapshots.
const clock = () => new Date(2022, 4, 30, 11, 5)

const meta = {
  title: 'Prototypes/Klinik/Leistungen',
  component: KlinikDashboard,
  parameters: { layout: 'fullscreen', chromatic: { viewports: [1440] } },
  tags: ['!manifest'],
  args: { initialTab: 'leistungen', clock },
} satisfies Meta<typeof KlinikDashboard>

export default meta
type Story = StoryObj<typeof meta>

type Canvas = ReturnType<typeof within>

const table = (canvas: Canvas) => canvas.getByRole('table', { name: 'Erfasste Leistungen' })
const bodyRows = (canvas: Canvas) => within(table(canvas)).getAllByRole('row').slice(1)
const summaryRow = (canvas: Canvas, label: string) => canvas.getByText(label, { selector: 'dt p' }).closest('div') as HTMLElement

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('tab', { name: 'Leistungen' })).toHaveAttribute('aria-selected', 'true')
    await expect(bodyRows(canvas)).toHaveLength(6)
    await expect(within(table(canvas)).getByRole('rowheader', { name: '30.05.2022 09:50' })).toBeVisible()
    await expect(bodyRows(canvas)[5]).toHaveTextContent('Nicht verrechenbar')
    await expect(summaryRow(canvas, 'Leistungen')).toHaveTextContent('6')
    await expect(summaryRow(canvas, 'Taxpunkte')).toHaveTextContent('102.41')
    await expect(summaryRow(canvas, 'Zu prüfen')).toHaveTextContent('1')
    await expect(summaryRow(canvas, 'Nicht verrechenbar')).toHaveTextContent('1')
  },
}

export const FilterAndReset: Story = {
  play: async ({ canvas }) => {
    await userEvent.type(canvas.getByRole('searchbox', { name: 'Suche' }), 'konsult')
    await expect(bodyRows(canvas)).toHaveLength(3)

    await userEvent.clear(canvas.getByRole('searchbox', { name: 'Suche' }))
    await userEvent.selectOptions(canvas.getByRole('combobox', { name: 'Leistungsart' }), 'Labor')
    await expect(bodyRows(canvas)).toHaveLength(1)
    await expect(bodyRows(canvas)[0]).toHaveTextContent('Labor: Blutentnahme')

    await userEvent.selectOptions(canvas.getByRole('combobox', { name: 'Erbringer' }), 'Dr. S. Beispiel')
    await expect(within(table(canvas)).getAllByRole('row')).toHaveLength(1)
    await expect(canvas.getByText('Keine Leistungen entsprechen den Filtern.')).toBeVisible()
    // The summary describes all data, not the filtered view.
    await expect(summaryRow(canvas, 'Leistungen')).toHaveTextContent('6')

    await userEvent.click(canvas.getByRole('button', { name: 'Filter zurücksetzen' }))
    await expect(canvas.getByRole('combobox', { name: 'Leistungsart' })).toHaveValue('alle')
    await expect(canvas.getByRole('combobox', { name: 'Erbringer' })).toHaveValue('alle')
    await expect(bodyRows(canvas)).toHaveLength(6)
  },
}

export const AddEntry: Story = {
  play: async ({ canvas }) => {
    const form = within(canvas.getByRole('form', { name: 'Neue Leistung erfassen' }))
    await expect(form.getByLabelText(/Datum/)).toHaveValue('2022-05-30')
    await userEvent.type(form.getByRole('textbox', { name: /Tarifposition/ }), '00.0010')
    await userEvent.type(form.getByRole('textbox', { name: /Bezeichnung/ }), 'Konsultation, erste 5 Min.')
    const quantity = form.getByRole('spinbutton', { name: /Menge/ })
    await userEvent.clear(quantity)
    await userEvent.type(quantity, '2')
    await userEvent.click(form.getByRole('button', { name: 'Erfassen' }))

    await expect(bodyRows(canvas)).toHaveLength(7)
    await expect(bodyRows(canvas)[0]).toHaveTextContent('30.05.2022 11:05')
    await expect(bodyRows(canvas)[0]).toHaveTextContent('Erfasst')
    await expect(canvas.getByRole('status')).toHaveTextContent('Leistung erfasst')
    await expect(summaryRow(canvas, 'Leistungen')).toHaveTextContent('7')
    await expect(summaryRow(canvas, 'Taxpunkte')).toHaveTextContent('137.93')

    await expect(form.getByRole('textbox', { name: /Tarifposition/ })).toHaveValue('')
    await expect(form.getByRole('spinbutton', { name: /Menge/ })).toHaveValue(1)
  },
}

export const ValidationErrors: Story = {
  play: async ({ canvas }) => {
    const form = within(canvas.getByRole('form', { name: 'Neue Leistung erfassen' }))
    await userEvent.clear(form.getByRole('spinbutton', { name: /Menge/ }))
    await userEvent.click(form.getByRole('button', { name: 'Erfassen' }))

    await expect(form.getByRole('textbox', { name: /Tarifposition/ })).toHaveAttribute('aria-invalid', 'true')
    await expect(form.getByRole('textbox', { name: /Bezeichnung/ })).toHaveAccessibleDescription('Bezeichnung angeben.')
    await expect(form.getByRole('spinbutton', { name: /Menge/ })).toHaveAccessibleDescription('Ganze Zahl ab 1 angeben.')
    await expect(bodyRows(canvas)).toHaveLength(6)

    await userEvent.type(form.getByRole('textbox', { name: /Tarifposition/ }), '99.9999')
    await expect(form.getByRole('textbox', { name: /Tarifposition/ })).not.toHaveAttribute('aria-invalid')
  },
}

export const LoadMore: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Weitere laden' }))
    await expect(bodyRows(canvas)).toHaveLength(9)
    await expect(canvas.getByRole('button', { name: 'Keine weiteren Leistungen' })).toBeDisabled()
    await expect(summaryRow(canvas, 'Leistungen')).toHaveTextContent('9')
    await expect(summaryRow(canvas, 'Taxpunkte')).toHaveTextContent('227.41')
    await expect(summaryRow(canvas, 'Zu prüfen')).toHaveTextContent('2')
  },
}

export const EntriesSurviveTabSwitch: Story = {
  play: async ({ canvas }) => {
    const form = within(canvas.getByRole('form', { name: 'Neue Leistung erfassen' }))
    await userEvent.type(form.getByRole('textbox', { name: /Tarifposition/ }), '35.0210')
    await userEvent.type(form.getByRole('textbox', { name: /Bezeichnung/ }), 'Labor: Blutentnahme')
    await userEvent.click(form.getByRole('button', { name: 'Erfassen' }))

    await userEvent.click(canvas.getByRole('tab', { name: 'Dashboard' }))
    await userEvent.click(canvas.getByRole('tab', { name: 'Leistungen' }))
    await expect(bodyRows(canvas)).toHaveLength(7)
  },
}
