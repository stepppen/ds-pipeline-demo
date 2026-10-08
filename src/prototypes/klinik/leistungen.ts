export type ServiceStatus = 'Erfasst' | 'Verrechnet' | 'Zu prüfen' | 'Nicht verrechenbar'
export type ServiceType = 'Konsultation' | 'Labor' | 'Bildgebung' | 'Therapie'

export type Service = {
  id: string
  /** ISO date, shown as dd.mm.yyyy. */
  date: string
  time: string
  code: string
  description: string
  quantity: number
  status: ServiceStatus
  type?: ServiceType
  provider: string
  /** Taxpunkte per unit. Plausible demo values, not the official tariff. */
  taxpoints: number
}

export const serviceTypes: ServiceType[] = ['Konsultation', 'Labor', 'Bildgebung', 'Therapie']
export const providers = ['Dr. T. Muster', 'Dr. S. Beispiel', 'Pflege Station B']

/** New entries are recorded by the signed-in physician. */
export const DEFAULT_PROVIDER = 'Dr. T. Muster'

/** Known tariff positions, so a new entry gets a type and Taxpunkte. Unknown codes count 0 TP. */
export const catalog: Record<string, { type: ServiceType; taxpoints: number }> = {
  '00.0010': { type: 'Konsultation', taxpoints: 17.76 },
  '00.0020': { type: 'Konsultation', taxpoints: 8.88 },
  '00.0415': { type: 'Konsultation', taxpoints: 17.76 },
  '00.2285': { type: 'Konsultation', taxpoints: 8.88 },
  '32.0010': { type: 'Konsultation', taxpoints: 25.32 },
  '35.0210': { type: 'Labor', taxpoints: 6.05 },
  '39.0020': { type: 'Bildgebung', taxpoints: 54.2 },
  '29.0020': { type: 'Therapie', taxpoints: 30.7 },
  '1245.00': { type: 'Labor', taxpoints: 9.4 },
}

const row = (
  id: string,
  date: string,
  time: string,
  code: string,
  description: string,
  quantity: number,
  status: ServiceStatus,
  provider: string,
): Service => ({ id, date, time, code, description, quantity, status, provider, ...catalog[code] })

export const seedServices: Service[] = [
  row('s1', '2022-05-30', '09:50', '00.0010', 'Konsultation, erste 5 Min.', 1, 'Verrechnet', 'Dr. T. Muster'),
  row('s2', '2022-05-30', '09:55', '00.0020', 'Konsultation, jede weiteren 5 Min.', 3, 'Verrechnet', 'Dr. T. Muster'),
  row('s3', '2022-05-30', '10:15', '32.0010', 'Kleine Untersuchung', 1, 'Erfasst', 'Dr. S. Beispiel'),
  row('s4', '2022-05-29', '14:30', '00.0415', 'Telefonische Konsultation', 1, 'Zu prüfen', 'Dr. S. Beispiel'),
  row('s5', '2022-05-29', '08:00', '35.0210', 'Labor: Blutentnahme', 1, 'Verrechnet', 'Pflege Station B'),
  row('s6', '2022-05-28', '16:40', '00.2285', 'Berichterstellung', 1, 'Nicht verrechenbar', 'Dr. T. Muster'),
]

/** Loaded by "Weitere laden"; there's only one more page. */
export const moreServices: Service[] = [
  row('s7', '2022-05-28', '11:20', '39.0020', 'Röntgen Thorax, 2 Ebenen', 1, 'Verrechnet', 'Dr. S. Beispiel'),
  row('s8', '2022-05-27', '15:00', '29.0020', 'Atemtherapie, Einzelsitzung', 2, 'Zu prüfen', 'Pflege Station B'),
  row('s9', '2022-05-27', '07:45', '1245.00', 'Labor: CRP, quantitativ', 1, 'Verrechnet', 'Pflege Station B'),
]

export const statusTone = {
  Erfasst: 'neutral',
  Verrechnet: 'success',
  'Zu prüfen': 'warning',
  'Nicht verrechenbar': 'danger',
} as const

/** "2022-05-30" → "30.05.2022". */
export const formatDate = (iso: string) => iso.split('-').reverse().join('.')

/** 1234.5 → "1'234.50". */
export const formatTaxpoints = (value: number) => {
  const [whole, decimals] = value.toFixed(2).split('.')
  return `${whole.replace(/\B(?=(\d{3})+(?!\d))/g, "'")}.${decimals}`
}

const pad = (n: number) => String(n).padStart(2, '0')
export const isoDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
export const clockTime = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}`

export const summarize = (services: Service[]) => ({
  count: services.length,
  taxpoints: services.reduce((sum, s) => sum + s.taxpoints * s.quantity, 0),
  toReview: services.filter((s) => s.status === 'Zu prüfen').length,
  notBillable: services.filter((s) => s.status === 'Nicht verrechenbar').length,
})
