import type { Status } from './mockData'

// Badge has no semantic colours, so solid marks items needing action and outline the rest.
export function statusVariant(status: Status): 'solid' | 'outline' {
  return status === 'In review' || status === 'Approved' ? 'solid' : 'outline'
}
