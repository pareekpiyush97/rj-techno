import { Navigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'
import { ROLE_LABEL } from '../auth/roles.js'
import OpsPortal from '../portals/OpsPortal.jsx'

export default function Portal() {
  const { user } = useAuth()
  const role = user?.role || 'vendor'
  // Customers track publicly — never inside the staff portal.
  if (role === 'customer') return <Navigate to="/customer" replace />
  return (
    <>
      <section className="page-head">
        <span className="role-chip">{ROLE_LABEL[role]} portal</span>
        <h1>Welcome back{user?.name ? `, ${user.name}` : ''}.</h1>
        <p className="lede">Open an application and update each stage of the installation workflow.</p>
      </section>
      <OpsPortal role={role} />
    </>
  )
}
