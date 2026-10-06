import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { ApprovalV2 } from './ApprovalV2'
import { documents } from './mockData'

const meta = {
  title: 'Prototypes/Approval v2',
  component: ApprovalV2,
  parameters: { layout: 'fullscreen' },
  tags: ['!manifest'],
} satisfies Meta<typeof ApprovalV2>

export default meta
type Story = StoryObj<typeof meta>

const rowFor = (canvasElement: HTMLElement, name: string) =>
  within(canvasElement).getByText(name, { selector: 'span' }).closest('li') as HTMLElement

export const ClickThrough: Story = {}

export const ApproveOneDocument: Story = {
  play: async ({ canvas, canvasElement }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Open Q4 Marketing Budget' }))
    const panel = canvas.getByRole('region', { name: 'Q4 Marketing Budget' })
    await expect(panel).toHaveTextContent('In review')

    await userEvent.click(within(panel).getByRole('button', { name: 'Approve' }))
    await expect(canvas.getByText('Document approved')).toBeVisible()
    await expect(panel).toHaveTextContent('Approved')
    await expect(rowFor(canvasElement, 'Q4 Marketing Budget')).toHaveTextContent('Approved')

    await userEvent.click(canvas.getByRole('button', { name: 'Undo' }))
    await expect(canvas.queryByText('Document approved')).toBeNull()
    await expect(panel).toHaveTextContent('In review')
  },
}

export const BulkApproveWithOneSkipped: Story = {
  play: async ({ canvas, canvasElement }) => {
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Select Q4 Marketing Budget' }))
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Select Vendor Contract – CloudHost AG' }))
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Select Remote Work Policy v2' }))
    await expect(canvas.getByText('3 selected')).toBeVisible()

    await userEvent.click(canvas.getByRole('button', { name: 'Approve 2 of 3' }))
    await expect(canvas.getByText('2 documents approved')).toBeVisible()
    await expect(canvas.getByText(/1 skipped/)).toBeVisible()
    await expect(canvas.queryByText('3 selected')).toBeNull()
    await expect(rowFor(canvasElement, 'Q4 Marketing Budget')).toHaveTextContent('Approved')
    await expect(rowFor(canvasElement, 'Vendor Contract – CloudHost AG')).toHaveTextContent('Approved')

    await userEvent.click(canvas.getByRole('button', { name: 'Undo' }))
    await expect(rowFor(canvasElement, 'Q4 Marketing Budget')).toHaveTextContent('In review')
    await expect(rowFor(canvasElement, 'Vendor Contract – CloudHost AG')).toHaveTextContent('New')
    await expect(rowFor(canvasElement, 'Remote Work Policy v2')).toHaveTextContent('Approved')
  },
}

export const RequestChangesWithComment: Story = {
  play: async ({ canvas, canvasElement }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Open Q4 Marketing Budget' }))
    const panel = canvas.getByRole('region', { name: 'Q4 Marketing Budget' })
    await userEvent.click(within(panel).getByRole('button', { name: 'Request changes' }))
    await userEvent.type(
      within(panel).getByRole('textbox', { name: 'Comment for the submitter' }),
      'Split the events budget by quarter.',
    )
    await userEvent.click(within(panel).getByRole('button', { name: 'Submit' }))

    await expect(panel).toHaveTextContent('Changes requested')
    await expect(panel).toHaveTextContent('Split the events budget by quarter.')
    await expect(within(panel).queryByRole('button', { name: 'Approve' })).toBeNull()
    await expect(rowFor(canvasElement, 'Q4 Marketing Budget')).toHaveTextContent('Changes requested')
  },
}

export const SubmitEmptyComment: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Open Q4 Marketing Budget' }))
    const panel = canvas.getByRole('region', { name: 'Q4 Marketing Budget' })
    await userEvent.click(within(panel).getByRole('button', { name: 'Request changes' }))
    const submit = within(panel).getByRole('button', { name: 'Submit' })
    await expect(submit).toBeEnabled()
    await userEvent.click(submit)

    const textbox = within(panel).getByRole('textbox', { name: 'Comment for the submitter' })
    await expect(textbox).toHaveAttribute('aria-invalid', 'true')
    await expect(textbox).toHaveAccessibleDescription(/Add a comment/)
    await expect(panel).toHaveTextContent('In review')
  },
}

export const NoDocumentOpen: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: 'No document open' })).toBeVisible()
  },
}

export const NoResults: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Open Q4 Marketing Budget' }))
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Select Data Retention Schedule' }))
    await expect(canvas.getByText('1 selected')).toBeVisible()

    await userEvent.type(canvas.getByRole('searchbox', { name: 'Search documents' }), 'zzz')
    await expect(canvas.getByRole('heading', { name: 'No documents match your filters' })).toBeVisible()
    // Searching clears the selection, and the open document stays open even though it's filtered out.
    await expect(canvas.queryByText('1 selected')).toBeNull()
    await expect(canvas.getByRole('region', { name: 'Q4 Marketing Budget' })).toBeVisible()

    await userEvent.click(canvas.getByRole('button', { name: 'Clear filters' }))
    await expect(canvas.getAllByRole('listitem')).toHaveLength(8)
  },
}

const longName = 'Cross-border data processing agreement for the 2027 customer analytics platform migrations'

export const LongDocumentName: Story = {
  args: { initialDocuments: [{ ...documents[0], name: longName }, ...documents.slice(1)] },
  play: async ({ canvas }) => {
    await expect(longName).toHaveLength(90)
    await userEvent.click(canvas.getByRole('button', { name: `Open ${longName}` }))
    await expect(canvas.getByRole('heading', { name: longName })).toBeVisible()
  },
}
