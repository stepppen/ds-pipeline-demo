export type Status = 'New' | 'In review' | 'Approved' | 'Changes requested'

export type ApprovalDocument = {
  id: string
  name: string
  submitter: string
  date: string
  status: Status
  description: string
}

export const documents: ApprovalDocument[] = [
  { id: 'd1', name: 'Q4 Marketing Budget', submitter: 'Lena Fischer', date: '2026-09-28', status: 'In review', description: 'Proposed allocation of the Q4 marketing spend across paid search, events and content production.' },
  { id: 'd2', name: 'Vendor Contract – CloudHost AG', submitter: 'Marc Dubois', date: '2026-09-29', status: 'New', description: 'Three-year hosting agreement renewal with revised SLA terms and a 6% price increase.' },
  { id: 'd3', name: 'Remote Work Policy v2', submitter: 'Sofia Rossi', date: '2026-09-30', status: 'In review', description: 'Updated guidelines for hybrid work, including equipment allowance and core collaboration hours.' },
  { id: 'd4', name: 'Security Incident Report #142', submitter: 'Jonas Weber', date: '2026-10-01', status: 'New', description: 'Post-mortem of the phishing attempt detected on 24 September, with remediation steps.' },
  { id: 'd5', name: 'Onboarding Checklist Refresh', submitter: 'Amélie Laurent', date: '2026-10-01', status: 'In review', description: 'Revised first-week checklist for new engineers, aligned with the updated tooling stack.' },
  { id: 'd6', name: 'Travel Expense Claim – Zurich Summit', submitter: 'Noah Keller', date: '2026-10-02', status: 'New', description: 'Expense claim for travel and accommodation during the Zurich Product Summit.' },
  { id: 'd7', name: 'Data Retention Schedule', submitter: 'Elena Moretti', date: '2026-10-03', status: 'In review', description: 'Retention periods for customer, financial and HR records under the revised nFADP guidance.' },
  { id: 'd8', name: 'Brand Guidelines Addendum', submitter: 'Luca Brunner', date: '2026-10-04', status: 'New', description: 'Additions covering motion principles and co-branding rules for partner campaigns.' },
]
