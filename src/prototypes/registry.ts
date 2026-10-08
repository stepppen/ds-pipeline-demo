import type { ComponentType } from 'react'
import { ApprovalPrototype } from './approval/ApprovalPrototype'
import { ApprovalV2 } from './approval-v2/ApprovalV2'
import { KlinikDashboard } from './klinik/KlinikDashboard'
import { Neobank } from './neobank/Neobank'

export type PrototypeEntry = {
  name: string
  description: string
  route: string
  component: ComponentType
}

export const prototypes: PrototypeEntry[] = [
  {
    name: 'Klinik – Patient Dashboard',
    description: 'Hospital patient dashboard and Leistungen capture, rebuilt from the design system (desktop, 1440px).',
    route: '/klinik',
    component: KlinikDashboard,
  },
  {
    name: 'Alpin neo-bank',
    description: 'Dashboard, transactions, transfer and card controls for a fictional Swiss neo-bank.',
    route: '/neobank',
    component: Neobank,
  },
  {
    name: 'Approval v2',
    description: 'Master/detail document approval with bulk actions and undo.',
    route: '/approval-v2',
    component: ApprovalV2,
  },
  {
    name: 'Approval v1',
    description: 'First document approval flow: list, detail and confirmation screens.',
    route: '/approval',
    component: ApprovalPrototype,
  },
]
