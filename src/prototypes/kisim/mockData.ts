import type { TableColumn, TableRow } from '../../components/Table/Table'
import type { IconName } from '../../icons/Icon'

export const patient = {
  name: 'Anna Muster',
  meta: '28.12.1992 · 29 J · W · PID 100234 · ZI01 / B01',
  status: ['stationär', 'REA: Nein', 'IPS: Ja', 'Allergien: Ja'],
}

/** The design only shows the initials "SV"; the full name is invented so the avatar has an accessible name. */
export const currentUser = 'Sandra Vogt'

export const tabs = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'stammdaten', label: 'Stammdaten' },
  { id: 'leistungen', label: 'Leistungen' },
  { id: 'diagnosen', label: 'Diagnosen' },
  { id: 'kurve', label: 'Kurve' },
]

export const vitals = [
  { label: 'BD', value: '130/85 mmHg', time: 'vom 30.05. 09:53' },
  { label: 'Puls', value: '60 /min', time: 'vom 30.05. 09:53' },
  { label: 'SpO₂', value: '88 %', time: 'vom 30.05. 09:53' },
  { label: 'AF', value: '13 /min', time: 'vom 30.05. 09:54' },
  { label: 'Temp', value: '36.8 °C', time: 'vom 30.05. 08:10' },
]

type Entry = { icon: IconName; title: string; meta?: string }

export const orders: Entry[] = [
  { icon: 'document', title: 'Angiographie Aorta, Becken', meta: 'Angemeldet · verordnet 30.05. 09:50' },
  { icon: 'warning-triangle', title: 'Einmalige Verordnung', meta: 'Wird nicht elektronisch übermittelt' },
]

export const diagnoses: Entry[] = [
  { icon: 'document', title: 'Autoimmunkrankheit (systemisch) o.n.A.', meta: 'ICD-10: M35.9 · Hauptdiagnose' },
]

export const progressNotes: Entry[] = [
  { icon: 'comment', title: 'Visite: Befund stabil', meta: '30.05.2022 09:54 · Dr. T. Muster' },
]

export const reports: Entry[] = [
  'Anamnese',
  'Status',
  'Austrittsbericht',
  'Ärztliches Zeugnis',
  'Rezept',
  'Dosierungskarte',
].map((title) => ({ icon: 'document', title }))

export const appointments: Entry[] = [
  { icon: 'calendar', title: 'Angiographie', meta: '31.05.2022 08:30 · Radiologie' },
  { icon: 'calendar', title: 'Physiotherapie', meta: '31.05.2022 14:00 · Therapiezentrum' },
  { icon: 'calendar', title: 'Austrittsgespräch', meta: '01.06.2022 10:00 · Station B' },
]

export const labColumns: TableColumn[] = ['Parameter', 'Einheit', '30.05 07:15', '28.05 07:45', 'Referenz'].map(
  (header) => ({ header, sortable: true }),
)

export const labRows: TableRow[] = [
  { id: 'natrium', cells: ['Natrium', 'mmol/l', { value: 133, flag: 'L' }, { value: 134, flag: 'L' }, '136–145'] },
  { id: 'kalium', cells: ['Kalium', 'mmol/l', '4.3', '4.0', '3.5–5.1'] },
  { id: 'crp', cells: ['CRP', 'mg/l', { value: 40, flag: 'H' }, { value: 71, flag: 'H' }, '< 5'] },
  { id: 'leukozyten', cells: ['Leukozyten', '10⁹/l', { value: '10.9', flag: 'H' }, { value: '11.6', flag: 'H' }, '4.0–10.0'] },
]
