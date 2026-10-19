import { useAuth } from '../auth/AuthContext.jsx'
import { ROLE_LABEL } from '../auth/roles.js'
import CustomerPortal from '../portals/CustomerPortal.jsx'
import OpsPortal from '../portals/OpsPortal.jsx'

export default function Portal() {
  const { user } = useAuth()
  const role = user?.role || 'customer'
  return (
    <>
      <section className="page-head">
        <span className="role-chip">{ROLE_LABEL[role]} portal</span>
        <h1>Welcome back{user?.name ? `, ${user.name}` : ''}.</h1>
        <p className="lede">
          {role === 'customer'
            ? 'Track your solar installation by K. No. and raise complaints.'
            : 'Open an application and update each stage of the installation workflow.'}
        </p>
      </section>
      {role === 'customer' ? <CustomerPortal /> : <OpsPortal role={role} />}
    </>
  )
}
