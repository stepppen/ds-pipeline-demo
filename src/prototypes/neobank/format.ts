import type { Category, Transaction } from './mockData'

/** 245080 → "2'450.80" — Swiss apostrophe thousands, two decimals. */
const formatNumber = (rappen: number) => {
  const [francs, cents] = (Math.abs(rappen) / 100).toFixed(2).split('.')
  return `${francs.replace(/\B(?=(\d{3})+(?!\d))/g, "'")}.${cents}`
}

/** "CHF 2'450.80", unsigned. */
export const formatChf = (rappen: number) => `CHF ${formatNumber(rappen)}`

/** "+ CHF 6'850.00" or "− CHF 84.30". */
export const formatSignedChf = (rappen: number) => `${rappen >= 0 ? '+' : '−'} ${formatChf(rappen)}`

/** "2026-10-06" → "06.10.2026". */
export const formatDate = (iso: string) => iso.split('-').reverse().join('.')

/** Accepts "1'250.50", "1250,50" or "1250"; returns Rappen, or null if it isn't a positive amount. */
export const parseChf = (input: string) => {
  const normalised = input.trim().replace(/['’\s]/g, '').replace(',', '.')
  if (!/^\d+(\.\d{1,2})?$/.test(normalised)) return null
  const rappen = Math.round(Number(normalised) * 100)
  return rappen > 0 ? rappen : null
}

export const balanceOf = (opening: number, list: Transaction[]) =>
  list.reduce((sum, tx) => sum + tx.amount, opening)

export const monthTotals = (list: Transaction[], month: string) => {
  const inMonth = list.filter((tx) => tx.date.startsWith(month))
  const incoming = inMonth.filter((tx) => tx.amount > 0).reduce((sum, tx) => sum + tx.amount, 0)
  const outgoing = inMonth.filter((tx) => tx.amount < 0).reduce((sum, tx) => sum - tx.amount, 0)
  return { incoming, outgoing, saved: incoming - outgoing }
}

/*
 * Badge has no neutral or categorical tones (known gap), so income reads as
 * success and every spending category shares the brand tone.
 */
export const categoryTone = (category: Category) => (category === 'Salary' ? 'success' : 'brand')

export const subtitleFor = (tx: Transaction) =>
  [formatDate(tx.date), tx.category, tx.status === 'Pending' ? 'Pending' : null].filter(Boolean).join(' · ')
