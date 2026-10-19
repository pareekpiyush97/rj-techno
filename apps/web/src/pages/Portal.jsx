import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'
import { ROLE_LABEL } from '../auth/roles.js'

const DATA = {
  customer: {
    heading: 'Your projects',
    cards: [
      { id: 'RJT-1042', site: 'Rooftop · 5 kW · Bikaner', stage: 'Installation', pct: 65 },
      { id: 'RJT-1039', site: 'C&I · 40 kW · Nokha', stage: 'Net-metering', pct: 85 },
    ],
    docs: ['Quotation_RJT-1042.pdf', 'Net-metering_application.pdf', 'Warranty_card.pdf'],
    help: 'Raise a service request or reach the operations team directly.',
  },
  vendor: {
    heading: 'Open orders',
    cards: [
      { id: 'PO-5521', site: 'Modules · 24 × 540W', stage: 'Dispatch', pct: 40 },
      { id: 'PO-5519', site: 'Inverters · 5 kW × 3', stage: 'Payment due', pct: 70 },
    ],
    docs: ['PO-5521.pdf', 'GST_invoice_5519.pdf', 'Delivery_challan.pdf'],
    help: 'Update dispatch status or raise a payment query.',
  },
  employee: {
    heading: 'Assigned sites · 12-stage',
    cards: [
      { id: 'JOB-318', site: 'Stage 8 · GPS photo capture', stage: 'In progress', pct: 66 },
      { id: 'JOB-312', site: 'Stage 11 · Commissioning', stage: 'In progress', pct: 91 },
    ],
    docs: ['Site_checklist_318.pdf', 'Safety_SOP.pdf'],
    help: 'Open your field workflow and capture on-site proof.',
  },
  subvendor: {
    heading: 'Assigned jobs',
    cards: [
      { id: 'SV-204', site: 'Structure mounting · Nokha', stage: 'Scheduled', pct: 20 },
      { id: 'SV-198', site: 'DC cabling · Bikaner', stage: 'On site', pct: 55 },
    ],
    docs: ['Work_order_204.pdf', 'Scope_of_work.pdf'],
    help: 'Confirm your schedule or upload completion proof.',
  },
}

export default function Portal() {
  const { user, logout } = useAuth()
  const role = user?.role || 'customer'
  const d = DATA[role] || DATA.customer
  return (
    <>
      <section className="page-head">
        <span className="role-chip">{ROLE_LABEL[role] || 'Customer'} portal</span>
        <h1>Welcome back{user?.name ? `, ${user.name}` : ''}.</h1>
        <p className="lede">Track your work, grab documents and reach the team — all in one place.</p>
      </section>

      <section className="band">
        <h2>{d.heading}</h2>
        <div className="grid-2">
          {d.cards.map((c) => (
            <article className="card" key={c.id}>
              <div className="row-between"><h3>{c.id}</h3><span className="pill">{c.stage}</span></div>
              <p className="muted">{c.site}</p>
              <div className="bar"><span style={{ width: c.pct + '%' }}></span></div>
              <small className="muted">{c.pct}% complete</small>
            </article>
          ))}
        </div>
      </section>

      <section className="band grid-2">
        <article className="card">
          <h3>Documents</h3>
          <ul className="doc-list">{d.docs.map((x) => <li key={x}>{x}</li>)}</ul>
        </article>
        <article className="card">
          <h3>Need help?</h3>
          <p>{d.help}</p>
          <div className="cta-row">
            <Link to="/contact" className="btn btn-sm">Contact team</Link>
            <button className="btn btn-ghost btn-sm" onClick={logout}>Log out</button>
          </div>
        </article>
      </section>

      <p className="note band">Demo data for the <strong>{ROLE_LABEL[role]}</strong> role. Live data loads from the operations backend once connected.</p>
    </>
  )
}
