export const ROLES = [
  { key: 'customer',  label: 'Customer',   desc: 'Project status & documents' },
  { key: 'vendor',    label: 'Vendor',     desc: 'Orders & dispatch' },
  { key: 'employee',  label: 'Employee',   desc: '12-stage field workflow' },
  { key: 'subvendor', label: 'Sub-vendor', desc: 'Assigned jobs & proof' },
]
export const ROLE_LABEL = Object.fromEntries(ROLES.map((r) => [r.key, r.label]))
