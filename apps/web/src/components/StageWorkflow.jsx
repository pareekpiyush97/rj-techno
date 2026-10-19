import { useState, lazy, Suspense, Component } from 'react'

const GeoCameraCapture = lazy(() => import('./GeoCameraCapture.jsx'))

class Boundary extends Component {
  constructor(p) { super(p); this.state = { e: null } }
  static getDerivedStateFromError(e) { return { e } }
  render() {
    return this.state.e
      ? <p className="note" role="alert">Camera module couldn’t start: {String(this.state.e.message || this.state.e)}</p>
      : this.props.children
  }
}

const STAGES = [
  { n: 1,  t: 'Site Survey',         d: 'Measure roof, shading and load; capture baseline site conditions.', field: true },
  { n: 2,  t: 'System Design',       d: 'Size the array, strings and inverter for real consumption.' },
  { n: 3,  t: 'Proposal & Approval', d: 'Quotation, customer sign-off and DISCOM registration.' },
  { n: 4,  t: 'Material Dispatch',   d: 'Modules, inverter and balance-of-system dispatched to site.' },
  { n: 5,  t: 'Site Preparation',    d: 'Mark layout, prep roof penetrations and rig safety lines.', field: true },
  { n: 6,  t: 'Structure Mounting',  d: 'Install mounting structure and rails; level and torque.', field: true },
  { n: 7,  t: 'Module Installation', d: 'Place and clamp modules; verify orientation and tilt.', field: true },
  { n: 8,  t: 'DC Cabling',          d: 'String wiring, MC4 terminations and DC routing.', field: true },
  { n: 9,  t: 'Inverter & AC',       d: 'Mount inverter, AC cabling and protection devices.', field: true },
  { n: 10, t: 'Earthing & Safety',   d: 'Earthing, SPD and continuity checks.', field: true },
  { n: 11, t: 'Net-Metering',        d: 'Bi-directional meter install and DISCOM inspection.', field: true },
  { n: 12, t: 'Commissioning',       d: 'Power on, performance check and customer handover.', field: true },
]
const CURRENT = 7

export default function StageWorkflow({ site }) {
  const [open, setOpen] = useState(CURRENT)
  const [capturing, setCapturing] = useState(false)
  const stage = STAGES.find((s) => s.n === open) || STAGES[0]
  const status = (n) => (n < CURRENT ? 'done' : n === CURRENT ? 'current' : 'pending')
  const done = STAGES.filter((s) => s.n < CURRENT).length

  return (
    <div>
      <div className="wf-head">
        <div>
          <strong>JOB-318 · Rooftop 5 kW · Bikaner</strong>
          <span className="muted"> — {done} of 12 stages complete</span>
        </div>
        <div className="bar wf-bar"><span style={{ width: (done / 12) * 100 + '%' }}></span></div>
      </div>

      <div className="wf">
        <ol className="wf-steps">
          {STAGES.map((s) => (
            <li key={s.n} className={`wf-step ${status(s.n)} ${open === s.n ? 'open' : ''}`}>
              <button type="button" onClick={() => { setOpen(s.n); setCapturing(false) }}>
                <span className="wf-dot">{status(s.n) === 'done' ? '✓' : s.n}</span>
                <span className="wf-label">{s.t}</span>
                <span className="wf-stat">{status(s.n)}</span>
              </button>
            </li>
          ))}
        </ol>

        <div className="wf-detail card">
          <div className="row-between">
            <h3>Stage {stage.n} · {stage.t}</h3>
            <span className="pill">{status(stage.n)}</span>
          </div>
          <p>{stage.d}</p>
          {stage.field ? (
            !capturing ? (
              <button className="btn btn-sm" onClick={() => setCapturing(true)}>Capture GPS photo</button>
            ) : (
              <Boundary>
                <Suspense fallback={<p className="note">Loading camera…</p>}>
                  <GeoCameraCapture
                    projectId="DEMO" stepNo={stage.n}
                    site={site || { name: 'RJ Techno — Demo Site', lat: 28.0229, lng: 73.3119 }}
                    onDone={(rec) => console.log('captured', rec)}
                  />
                </Suspense>
              </Boundary>
            )
          ) : (
            <p className="note">Office stage — no on-site capture required.</p>
          )}
          <p className="note">On-site stages require live-camera capture with GPS geofence. Saving is disabled until the backend is live.</p>
        </div>
      </div>
    </div>
  )
}
