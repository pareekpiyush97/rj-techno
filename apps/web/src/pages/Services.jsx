import { Link } from 'react-router-dom'

const SERVICES = [
  { t: 'Residential Rooftop Solar', d: 'Grid-tied systems sized to your consumption, with net-metering handled end-to-end.', points: ['Load & roof assessment', 'Subsidy & net-metering paperwork', 'Monitoring app handover'] },
  { t: 'Commercial & Industrial EPC', d: 'Engineering, procurement and construction for C&I rooftops and ground-mount plants.', points: ['Detailed engineering & BoM', 'Structural & electrical BOS', 'Commissioning & compliance'] },
  { t: 'Operations & Maintenance', d: 'Keep generation at spec with proactive monitoring and fast on-site response.', points: ['Performance monitoring', 'Scheduled cleaning & inspection', 'Breakdown & warranty support'] },
  { t: 'Subsidy & Net-Metering', d: 'Navigate DISCOM approvals, subsidy claims and metering without the runaround.', points: ['Eligibility check', 'Application & liaison', 'Documentation tracking'] },
  { t: 'Operations Platform', d: 'The 4-portal system behind every project — vendor, employee, sub-vendor and customer.', points: ['12-stage field workflow', 'GPS + live-photo proof', 'Customer status portal'] },
]

export default function Services() {
  return (
    <>
      <section className="page-head">
        <p className="eyebrow">Services</p>
        <h1>From the first survey to year-25 maintenance.</h1>
        <p className="lede">One team for design, installation, approvals and long-term operations — so your solar keeps earning its payback.</p>
      </section>

      <section className="band">
        <div className="grid-2">
          {SERVICES.map((s) => (
            <article className="card service" key={s.t}>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
              <ul>{s.points.map((p) => <li key={p}>{p}</li>)}</ul>
            </article>
          ))}
        </div>
      </section>

      <section className="cta-band">
        <div><h2>Not sure what you need?</h2><p>Send us your bill and site details — we'll recommend the right system and service plan.</p></div>
        <Link to="/contact" className="btn">Talk to us</Link>
      </section>
    </>
  )
}
