import { useState, lazy, Suspense, Component } from 'react'
import { useStore } from '../store/StoreContext.jsx'
import FileUpload from '../components/FileUpload.jsx'

const GeoCameraCapture = lazy(() => import('../components/GeoCameraCapture.jsx'))

class Boundary extends Component {
  constructor(p) { super(p); this.state = { e: null } }
  static getDerivedStateFromError(e) { return { e } }
  render() {
    return this.state.e
      ? <p className="note" role="alert">Camera couldn’t start: {String(this.state.e.message || this.state.e)}. Use file upload instead.</p>
      : this.props.children
  }
}

export default function EmployeePortal() {
  const { data, updateItem, addFile, removeFile } = useStore()
  const stages = data.stages
  const firstPending = stages.find((s) => s.status === 'pending')
  const [open, setOpen] = useState((firstPending || stages[stages.length - 1]).id)
  const [cam, setCam] = useState(false)
  const stage = stages.find((s) => s.id === open) || stages[0]
  const done = stages.filter((s) => s.status === 'done').length
  const curId = firstPending ? firstPending.id : null
  const stat = (s) => (s.status === 'done' ? 'done' : s.id === curId ? 'current' : 'pending')

  function complete() {
    updateItem('stages', stage.id, { status: 'done' })
    if (stage.id < 12) setOpen(stage.id + 1)
    setCam(false)
  }

  return (
    <>
      <div className="wf-head">
        <div><strong>JOB-318 · Rooftop 5 kW · Bikaner</strong><span className="muted"> — {done} of 12 stages complete</span></div>
        <div className="bar wf-bar"><span style={{ width: (done / 12) * 100 + '%' }}></span></div>
      </div>
      <div className="wf">
        <ol className="wf-steps">
          {stages.map((s) => (
            <li key={s.id} className={`wf-step ${stat(s)} ${open === s.id ? 'open' : ''}`}>
              <button type="button" onClick={() => { setOpen(s.id); setCam(false) }}>
                <span className="wf-dot">{s.status === 'done' ? '✓' : s.id}</span>
                <span className="wf-label">{s.t}{s.files.length > 0 ? ` · ${s.files.length} photo${s.files.length > 1 ? 's' : ''}` : ''}</span>
                <span className="wf-stat">{stat(s)}</span>
              </button>
            </li>
          ))}
        </ol>
        <div className="wf-detail card">
          <div className="row-between"><h3>Stage {stage.id} · {stage.t}</h3><span className="pill">{stat(stage)}</span></div>
          <p>{stage.d}</p>
          {stage.field && (
            <div className="wf-capture">
              <FileUpload
                label="Upload site photo" accept="image/*"
                files={stage.files}
                onAdd={(f) => addFile('stages', stage.id, f)}
                onRemove={(id) => removeFile('stages', stage.id, id)}
              />
              {!cam
                ? <button type="button" className="link-btn" onClick={() => setCam(true)}>or use live camera with GPS geofence →</button>
                : <Boundary><Suspense fallback={<p className="note">Loading camera…</p>}>
                    <GeoCameraCapture projectId="JOB-318" stepNo={stage.id} site={{ name: 'Bikaner site', lat: 28.0229, lng: 73.3119 }} onDone={() => {}} />
                  </Suspense></Boundary>}
            </div>
          )}
          <div className="wf-actions">
            {stage.status !== 'done'
              ? <button type="button" className="btn btn-sm" onClick={complete}>Mark stage complete</button>
              : <button type="button" className="btn btn-ghost btn-sm" onClick={() => updateItem('stages', stage.id, { status: 'pending' })}>Re-open stage</button>}
          </div>
        </div>
      </div>
    </>
  )
}
