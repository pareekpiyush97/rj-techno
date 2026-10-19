import { useAuth } from '../auth/AuthContext.jsx'
import { ROLE_LABEL } from '../auth/roles.js'
import CustomerPortal from '../portals/CustomerPortal.jsx'
import VendorPortal from '../portals/VendorPortal.jsx'
import SubvendorPortal from '../portals/SubvendorPortal.jsx'
import EmployeePortal from '../portals/EmployeePortal.jsx'

const VIEW = { customer: CustomerPortal, vendor: VendorPortal, subvendor: SubvendorPortal, employee: EmployeePortal }

export default function Portal() {
  const { user } = useAuth()
  const role = user?.role || 'customer'
  const View = VIEW[role] || CustomerPortal
  const sub = role === 'employee'
    ? 'Your assigned sites and the 12-stage field workflow, with on-site photo capture.'
    : 'Track your work, upload files and update status — all in one place.'
  return (
    <>
      <section className="page-head">
        <span className="role-chip">{ROLE_LABEL[role]} portal</span>
        <h1>Welcome back{user?.name ? `, ${user.name}` : ''}.</h1>
        <p className="lede">{sub}</p>
      </section>
      <View />
    </>
  )
}
