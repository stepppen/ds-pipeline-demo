import { createElement } from 'react'
import { formatSignedChf } from './format'
import styles from './neobank.module.css'

/** Signed CHF amount for ListRow's trailing slot; incoming amounts use the success text colour. */
export const amountNode = (rappen: number) =>
  createElement(
    'span',
    { className: `${styles.amount} ${rappen > 0 ? styles.incoming : ''}` },
    formatSignedChf(rappen),
  )
