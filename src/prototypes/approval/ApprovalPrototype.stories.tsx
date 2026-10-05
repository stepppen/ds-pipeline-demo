import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent } from 'storybook/test'
import '../../styles/tokens.css'
import { ApprovalPrototype } from './ApprovalPrototype'

const meta = {
  title: 'Prototypes/Approval',
  component: ApprovalPrototype,
  parameters: { layout: 'fullscreen' },
  tags: ['!manifest'],
} satisfies Meta<typeof ApprovalPrototype>

export default meta
type Story = StoryObj<typeof meta>

export const ClickThrough: Story = {}

export const ApproveFlow: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('listitem')).toHaveLength(8)
    await userEvent.click(canvas.getAllByRole('button', { name: 'Open' })[0])
    await expect(canvas.getByRole('heading', { name: 'Q4 Marketing Budget' })).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'Approve' }))
    await expect(canvas.getByRole('heading', { name: 'Document approved' })).toBeVisible()
    await expect(canvas.getByText(/Q4 Marketing Budget/)).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'Back to list' }))
    await expect(canvas.getAllByRole('listitem')[0]).toHaveTextContent('Approved')
  },
}

export const RequestChangesFlow: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getAllByRole('button', { name: 'Open' })[1])
    await userEvent.click(canvas.getByRole('button', { name: 'Request changes' }))
    await expect(canvas.getByRole('heading', { name: 'Awaiting your review' })).toBeVisible()
    await expect(canvas.getAllByRole('listitem')[1]).toHaveTextContent('Changes requested')
  },
}
