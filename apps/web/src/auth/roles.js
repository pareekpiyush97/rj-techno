// Staff portal roles. Customers do NOT log in — they track publicly by K. No.
// on the Customer page. Server-side auth (PocketBase) slots in behind this later.
export const ROLES = [
  { key: 'vendor',    label: 'Vendor',     desc: 'Orders & dispatch' },
  { key: 'employee',  label: 'Employee',   desc: 'Field install workflow' },
  { key: 'subvendor', label: 'Sub-vendor', desc: 'Assigned jobs & proof' },
]
export const ROLE_LABEL = {
  ...Object.fromEntries(ROLES.map((r) => [r.key, r.label])),
  customer: 'Customer',
}
