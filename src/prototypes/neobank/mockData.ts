export type Category = 'Salary' | 'Transfer' | 'Groceries' | 'Transport' | 'Shopping' | 'Dining' | 'Housing' | 'Utilities'

export type Transaction = {
  id: string
  merchant: string
  /** ISO date, so lists sort correctly; shown as dd.mm.yyyy. */
  date: string
  /** In Rappen. Positive is incoming, negative is outgoing. */
  amount: number
  status: 'Booked' | 'Pending'
  category: Category
  reference: string
  message?: string
}

/** The demo is frozen on one day so screenshots never drift. */
export const TODAY = '2026-10-06'

export const OPENING_BALANCE = 812_405

export const account = {
  holder: 'Lea Brunner',
  name: 'Alpin Private',
  iban: 'CH93 0076 2011 6238 5295 7',
}

export const card = {
  name: 'Alpin Debit',
  lastFour: '4821',
  expiry: '08/29',
  monthlyLimit: 500_000,
  spentThisMonth: 53_705,
}

export const transactions: Transaction[] = [
  { id: 't12', merchant: 'Lukas Meier', date: '2026-10-06', amount: 4_500, status: 'Pending', category: 'Transfer', reference: 'ALP-20261006-0412', message: 'Pizza Freitag' },
  { id: 't11', merchant: 'Migros', date: '2026-10-05', amount: -8_430, status: 'Booked', category: 'Groceries', reference: 'ALP-20261005-1187' },
  { id: 't10', merchant: 'SBB', date: '2026-10-04', amount: -6_200, status: 'Booked', category: 'Transport', reference: 'ALP-20261004-0951' },
  { id: 't9', merchant: 'Galaxus', date: '2026-10-03', amount: -34_900, status: 'Pending', category: 'Shopping', reference: 'ALP-20261003-2240' },
  { id: 't8', merchant: 'Coop', date: '2026-10-02', amount: -4_175, status: 'Booked', category: 'Groceries', reference: 'ALP-20261002-0716' },
  { id: 't7', merchant: 'Muster AG', date: '2026-10-01', amount: 685_000, status: 'Booked', category: 'Salary', reference: 'ALP-20261001-0001', message: 'Lohn Oktober 2026' },
  { id: 't6', merchant: 'Verwaltung Aare AG', date: '2026-10-01', amount: -215_000, status: 'Booked', category: 'Housing', reference: 'ALP-20261001-0002', message: 'Miete Oktober' },
  { id: 't5', merchant: 'Swisscom', date: '2026-09-30', amount: -6_990, status: 'Booked', category: 'Utilities', reference: 'ALP-20260930-0533' },
  { id: 't4', merchant: 'Anna Müller', date: '2026-09-29', amount: 12_000, status: 'Booked', category: 'Transfer', reference: 'ALP-20260929-1802', message: 'Konzerttickets' },
  { id: 't3', merchant: 'Brasserie Lorraine', date: '2026-09-26', amount: -9_650, status: 'Booked', category: 'Dining', reference: 'ALP-20260926-2015' },
  { id: 't2', merchant: 'Coop', date: '2026-09-25', amount: -2_340, status: 'Booked', category: 'Groceries', reference: 'ALP-20260925-1744' },
  { id: 't1', merchant: 'SBB', date: '2026-09-24', amount: -2_980, status: 'Booked', category: 'Transport', reference: 'ALP-20260924-0630' },
]
