import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'

const PROJECTS = [
  { id: 'RJT-1042', site: 'Rooftop · 5 kW · Bikaner', stage: 'Installation', pct: 65 },
  { id: 'RJT-1039', site: 'C&I · 40 kW · Nokha', stage: 'Net-metering', pct: 85 },
]
const DOCS = ['Quotation_RJT-1042.pdf', 'Net-metering_application.pdf', 'Warranty_card.pdf']

export default function Customer() {
  const { user, logout } = useAuth()
  return (
    <>
      <section className="page-head">
        <p className="eyebrow">Customer portal</p>
        <h1>Welcome back{user?.name ? `, ${user.name}` : ''}.</h1>
        <p className="lede">Track your projects, raise service requests and grab your documents.</p>
      </section>

      <section className="band">
        <h2>Your projects</h2>
        <div className="grid-2">
          {PROJECTS.map((p) => (
            <article className="card" key={p.id}>
              <div className="row-between"><h3>{p.id}</h3><span className="pill">{p.stage}</span></div>
              <p className="muted">{p.site}</p>
              <div className="bar"><span style={{ width: p.pct + '%' }}></span></div>
              <small className="muted">{p.pct}% complete</small>
            </article>
          ))}
        </div>
      </section>

      <section className="band grid-2">
        <article className="card">
          <h3>Documents</h3>
          <ul className="doc-list">{DOCS.map((d) => <li key={d}>{d}</li>)}</ul>
        </article>
        <article className="card">
          <h3>Need help?</h3>
          <p>Raise a service request or reach the operations team directly.</p>
          <div className="cta-row">
            <Link to="/contact" className="btn btn-sm">Raise a request</Link>
            <button className="btn btn-ghost btn-sm" onClick={logout}>Log out</button>
          </div>
        </article>
      </section>

      <p className="note band">Demo data shown. Live project status will load from the operations backend once it's connected.</p>
    </>
  )
}
