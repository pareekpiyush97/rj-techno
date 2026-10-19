import { Link } from 'react-router-dom'

const STATS = [
  { k: '2+ MW', v: 'Solar capacity delivered' },
  { k: '300+', v: 'Rooftops energised' },
  { k: '98%', v: 'Uptime on O&M sites' },
  { k: '25 yr', v: 'Performance horizon' },
]
const PROCESS = [
  { n: '01', t: 'Survey & design', d: 'Site assessment and a system sized to your real load and roof.' },
  { n: '02', t: 'Approvals', d: 'DISCOM registration, subsidy and net-metering paperwork handled.' },
  { n: '03', t: 'Installation', d: '12-stage field workflow with GPS-verified on-site proof at every step.' },
  { n: '04', t: 'Operate', d: 'Monitoring, O&M and a customer portal for the life of the system.' },
]
const SERVICES = [
  { t: 'Rooftop Solar', d: 'Grid-tied rooftop systems for homes and businesses, sized for real consumption and net-metering.' },
  { t: 'Commercial EPC', d: 'End-to-end engineering, procurement and construction for C&I and ground-mount plants.' },
  { t: 'Operations & Maintenance', d: 'Monitoring, cleaning schedules and rapid fault response to protect your generation.' },
]

function SolarArt() {
  return (
    <svg className="art-svg" viewBox="0 0 440 360" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Solar panel and sun illustration">
      <defs>
        <linearGradient id="pg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#1AA24A" />
          <stop offset="1" stop-color="#0f7a37" />
        </linearGradient>
      </defs>
      <circle cx="340" cy="92" r="36" fill="#B9922E" />
      <g className="sun-rays" stroke="#B9922E" stroke-width="5" stroke-linecap="round">
        <line x1="340" y1="26" x2="340" y2="44" /><line x1="340" y1="140" x2="340" y2="158" />
        <line x1="274" y1="92" x2="292" y2="92" /><line x1="388" y1="92" x2="406" y2="92" />
        <line x1="293" y1="45" x2="306" y2="58" /><line x1="374" y1="126" x2="387" y2="139" />
        <line x1="387" y1="45" x2="374" y2="58" /><line x1="306" y1="126" x2="293" y2="139" />
      </g>
      <g transform="translate(44 150) rotate(-6) skewX(-11)">
        <rect x="0" y="0" width="250" height="156" rx="12" fill="url(#pg)" stroke="#0C3D1E" stroke-width="2" />
        <g fill="none" stroke="#A7E7BC" stroke-width="2" opacity="0.5">
          <line x1="62.5" y1="0" x2="62.5" y2="156" /><line x1="125" y1="0" x2="125" y2="156" /><line x1="187.5" y1="0" x2="187.5" y2="156" />
          <line x1="0" y1="52" x2="250" y2="52" /><line x1="0" y1="104" x2="250" y2="104" />
        </g>
      </g>
      <line x1="150" y1="300" x2="150" y2="332" stroke="#5C5342" stroke-width="7" stroke-linecap="round" />
      <line x1="236" y1="286" x2="236" y2="320" stroke="#5C5342" stroke-width="7" stroke-linecap="round" />
      <line x1="60" y1="340" x2="360" y2="340" stroke="#E9DFC8" stroke-width="3" stroke-linecap="round" />
    </svg>
  )
}

export default function Home() {
  return (
    <>
      <section className="hero hero-split">
        <div className="hero-copy">
          <p className="eyebrow">Solar operations · Bikaner</p>
          <h1>Power your site with solar that actually <span className="accent">performs</span>.</h1>
          <p className="lede">RJ Techno designs, installs and runs solar for homes and businesses across Rajasthan — backed by a 4-portal operations platform that keeps every project on track.</p>
          <div className="cta-row">
            <Link to="/services" className="btn">Explore services</Link>
            <Link to="/contact" className="btn btn-ghost">Get a quote</Link>
          </div>
        </div>
        <div className="hero-art"><SolarArt /></div>
      </section>

      <section className="stats" aria-label="Key figures">
        {STATS.map((s) => (<div className="stat" key={s.v}><strong>{s.k}</strong><span>{s.v}</span></div>))}
      </section>

      <section className="band">
        <div className="band-head"><h2>How we deliver</h2><Link to="/services" className="link-arrow">All services →</Link></div>
        <div className="grid-4">
          {PROCESS.map((p) => (
            <article className="proc" key={p.n}><span className="proc-n">{p.n}</span><h3>{p.t}</h3><p>{p.d}</p></article>
          ))}
        </div>
      </section>

      <section className="band">
        <h2>What we do</h2>
        <div className="grid-3">
          {SERVICES.map((s) => (<article className="card" key={s.t}><h3>{s.t}</h3><p>{s.d}</p></article>))}
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
        <div><h2>Ready to size your system?</h2><p>Tell us your average bill and roof area — we'll come back with a plan and payback estimate.</p></div>
        <Link to="/contact" className="btn">Start now</Link>
      </section>
    </>
  )
}
