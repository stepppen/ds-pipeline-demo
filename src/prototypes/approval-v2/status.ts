import type { Status } from './mockData'

type BadgeStyle = { variant: 'solid' | 'outline'; tone: 'brand' | 'success' | 'warning' | 'danger' }

export const badgeStyle: Record<Status, BadgeStyle> = {
  New: { variant: 'outline', tone: 'brand' },
  'In review': { variant: 'solid', tone: 'warning' },
  'Changes requested': { variant: 'solid', tone: 'danger' },
  Approved: { variant: 'solid', tone: 'success' },
}

export const isApprovable = (status: Status) => status === 'New' || status === 'In review'
