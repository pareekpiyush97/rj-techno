import { lazy, Suspense, useState, Component } from 'react'

const GeoCameraCapture = lazy(() => import('./components/GeoCameraCapture.jsx'))

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null } }
  static getDerivedStateFromError(error) { return { error } }
  render() {
    if (this.state.error) {
      return (
        <p className="note" role="alert">
          Preview couldn’t start: {String(this.state.error.message || this.state.error)}
        </p>
      )
    }
    return this.props.children
  }
}

const PORTALS = [
  { key: 'vendor',    name: 'Vendor Portal',     desc: 'Orders, dispatch & payment tracking' },
  { key: 'employee',  name: 'Employee Portal',   desc: '12-stage workflow + GPS photo capture' },
  { key: 'subvendor', name: 'Sub-vendor Portal', desc: 'Assigned jobs & on-site proof' },
  { key: 'customer',  name: 'Customer Portal',   desc: 'Project status & service requests' },
]

const ICON = import.meta.env.BASE_URL + 'icon.svg'

export default function App() {
  const [showCapture, setShowCapture] = useState(false)

  return (
    <div className="app">
      <header className="nav">
        <img src={ICON} alt="" className="logo" width="36" height="36" />
        <div className="brand">
          <strong>RJ Techno</strong>
          <span>Solar Operations Platform</span>
        </div>
        <span className="status" title="Deployment status">
          <i className="dot" aria-hidden="true"></i> Live preview
        </span>
      </header>

      <main className="hero">
        <p className="eyebrow">Launching soon</p>
        <h1>The operations backbone for <span className="accent">RJ Techno</span> solar.</h1>
        <p className="sub">
          Four role-based portals, one platform. The frontend is live here;
          the backend (PocketBase on VPS) is being provisioned.
        </p>

        <section className="grid" aria-label="Portals">
          {PORTALS.map((p) => (
            <article className="card" key={p.key}>
              <h2>{p.name}</h2>
              <p>{p.desc}</p>
              <span className="soon">Coming soon</span>
            </article>
          ))}
        </section>

        <section className="preview" aria-label="GPS Photo Capture preview">
          <h3>On-site GPS Photo Capture <span className="beta">beta</span></h3>
          <p>
            Live-camera capture with GPS geofence and a burned-in watermark —
            the core of the Employee 12-stage flow.
          </p>
          {!showCapture ? (
            <button className="btn" onClick={() => setShowCapture(true)}>
              Launch capture preview
            </button>
          ) : (
            <ErrorBoundary>
              <Suspense fallback={<p className="note">Loading camera module…</p>}>
                <GeoCameraCapture
                  projectId="DEMO"
                  stepNo={8}
                  site={{ name: 'RJ Techno — Demo Site', lat: 28.0229, lng: 73.3119 }}
                  onDone={(rec) => console.log('capture done', rec)}
                />
              </Suspense>
            </ErrorBoundary>
          )}
          <p className="note">
            Needs camera + location permission. Saving is disabled until the backend is live.
          </p>
        </section>
      </main>

      <footer className="foot">
        <span>© {new Date().getFullYear()} RJ Techno · Bikaner</span>
        <span>Built by Zrimat</span>
      </footer>
    </div>
  )
}
