import { useState, type ComponentProps } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent } from 'storybook/test'
import { Tabs } from './Tabs'

const items = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'details', label: 'Details' },
  { id: 'history', label: 'History' },
  { id: 'documents', label: 'Documents' },
]

function ControlledTabs(args: ComponentProps<typeof Tabs>) {
  const [value, setValue] = useState(args.value)
  return (
    <Tabs
      {...args}
      value={value}
      onChange={(id) => {
        args.onChange(id)
        setValue(id)
      }}
    />
  )
}

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    value: { control: 'inline-radio', options: items.map((item) => item.id) },
    idPrefix: { control: 'text' },
  },
  args: { label: 'Record sections', items, value: 'dashboard', onChange: fn() },
  render: (args) => <ControlledTabs key={args.value} {...args} />,
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('tablist', { name: 'Record sections' })).toBeVisible()
    await expect(canvas.getByRole('tab', { name: 'Dashboard' })).toHaveAttribute('aria-selected', 'true')
    await expect(canvas.getByRole('tab', { name: 'Details' })).toHaveAttribute('tabindex', '-1')
  },
}

export const SecondSelected: Story = { args: { value: 'details' } }

export const ClickToSelect: Story = {
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('tab', { name: 'History' }))
    await expect(args.onChange).toHaveBeenCalledWith('history')
    await expect(canvas.getByRole('tab', { name: 'History' })).toHaveAttribute('aria-selected', 'true')
  },
}

export const ArrowKeys: Story = {
  play: async ({ args, canvas }) => {
    await userEvent.tab()
    await expect(canvas.getByRole('tab', { name: 'Dashboard' })).toHaveFocus()
    await userEvent.keyboard('{ArrowRight}')
    await expect(canvas.getByRole('tab', { name: 'Details' })).toHaveFocus()
    await expect(canvas.getByRole('tab', { name: 'Details' })).toHaveAttribute('aria-selected', 'true')
    await userEvent.keyboard('{ArrowLeft}{ArrowLeft}')
    await expect(canvas.getByRole('tab', { name: 'Documents' })).toHaveFocus()
    await userEvent.keyboard('{Home}')
    await expect(canvas.getByRole('tab', { name: 'Dashboard' })).toHaveAttribute('aria-selected', 'true')
    await userEvent.keyboard('{End}')
    await expect(args.onChange).toHaveBeenLastCalledWith('documents')
  },
}

export const WithPanel: Story = {
  args: { idPrefix: 'record', items: items.map((item) => ({ ...item, panelId: 'record-panel' })) },
  render: (args) => {
    function WithPanelDemo() {
      const [value, setValue] = useState(args.value)
      return (
        <>
          <Tabs {...args} value={value} onChange={setValue} />
          <div role="tabpanel" id="record-panel" aria-labelledby={`record-${value}`} style={{ padding: 'var(--space-4)' }}>
            Content for {value}
          </div>
        </>
      )
    }
    return <WithPanelDemo />
  },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('tab', { name: 'History' }))
    await expect(canvas.getByRole('tabpanel', { name: 'History' })).toHaveTextContent('Content for history')
  },
}
