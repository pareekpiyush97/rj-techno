import { Link } from 'react-router-dom'

// NOTE: sample figures — replace with RJ Techno's real numbers before going public.
const STATS = [
  { k: '2+ MW', v: 'Solar capacity delivered' },
  { k: '300+', v: 'Rooftops energised' },
  { k: '98%', v: 'Uptime on O&M sites' },
  { k: '25 yr', v: 'Performance horizon' },
]
const SERVICES = [
  { t: 'Rooftop Solar', d: 'Grid-tied rooftop systems for homes and businesses, sized for real consumption and net-metering.' },
  { t: 'Commercial EPC', d: 'End-to-end engineering, procurement and construction for C&I and ground-mount plants.' },
  { t: 'Operations & Maintenance', d: 'Monitoring, cleaning schedules and rapid fault response to protect your generation.' },
]

export default function Home() {
  return (
    <>
      <section className="hero">
        <p className="eyebrow">Solar operations · Bikaner</p>
        <h1>Power your site with solar that actually <span className="accent">performs</span>.</h1>
        <p className="lede">
          RJ Techno designs, installs and runs solar for homes and businesses across Rajasthan —
          backed by a 4-portal operations platform that keeps every project on track.
        </p>
        <div className="cta-row">
          <Link to="/services" className="btn">Explore services</Link>
          <Link to="/contact" className="btn btn-ghost">Get a quote</Link>
        </div>
      </section>

      <section className="stats" aria-label="Key figures">
        {STATS.map((s) => (
          <div className="stat" key={s.v}><strong>{s.k}</strong><span>{s.v}</span></div>
        ))}
      </section>

      <section className="band">
        <div className="band-head">
          <h2>What we do</h2>
          <Link to="/services" className="link-arrow">All services →</Link>
        </div>
        <div className="grid-3">
          {SERVICES.map((s) => (
            <article className="card" key={s.t}><h3>{s.t}</h3><p>{s.d}</p></article>
          ))}
        </div>
      </section>

      <section className="band">
        <h2>Why RJ Techno</h2>
        <div className="grid-3">
          <article className="card"><h3>Operations-first</h3><p>Every install is tracked through vendor, employee, sub-vendor and customer portals — no job falls through the cracks.</p></article>
          <article className="card"><h3>Proof on site</h3><p>Field work is verified with GPS + live-camera capture, so you see exactly what happened and where.</p></article>
          <article className="card"><h3>Local &amp; accountable</h3><p>Bikaner-based team with fast turnaround on service, warranty and net-metering paperwork.</p></article>
        </div>
      </section>

      <section className="cta-band">
        <div>
          <h2>Ready to size your system?</h2>
          <p>Tell us your average bill and roof area — we'll come back with a plan and payback estimate.</p>
        </div>
        <Link to="/contact" className="btn">Start now</Link>
      </section>
    </>
  )
}
