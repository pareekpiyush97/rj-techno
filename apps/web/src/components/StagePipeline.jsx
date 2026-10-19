import { useState } from 'react'
import { useStore } from '../store/StoreContext.jsx'
import FileUpload from './FileUpload.jsx'

const STATUS = [
  { key: 'pending', label: 'Pending' },
  { key: 'in_progress', label: 'In progress' },
  { key: 'done', label: 'Done' },
]
const LABEL = { pending: 'Pending', in_progress: 'In progress', done: 'Done' }
const today = () => new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

export default function StagePipeline({ app, editable = false, role = 'Customer' }) {
  const { setStage, addStageFile, removeStageFile } = useStore()
  const active = app.stages.find((s) => s.status !== 'done') || app.stages[app.stages.length - 1]
  const [open, setOpen] = useState(active.n)
  const done = app.stages.filter((s) => s.status === 'done').length
  const pct = Math.round((done / app.stages.length) * 100)

  return (
    <div className="pipe">
      <div className="pipe-head">
        <div><strong>{done} of {app.stages.length} stages complete</strong><span className="muted"> · {pct}%</span></div>
        <div className="bar pipe-bar"><span style={{ width: pct + '%' }}></span></div>
      </div>
      <ol className="pipe-steps">
        {app.stages.map((s) => {
          const isOpen = open === s.n
          return (
            <li key={s.n} className={`pipe-step ${s.status} ${isOpen ? 'open' : ''}`}>
              <button type="button" className="pipe-row" onClick={() => setOpen(isOpen ? 0 : s.n)}>
                <span className="pipe-dot">{s.status === 'done' ? '✓' : s.n}</span>
                <span className="pipe-main">
                  <strong>{s.t}</strong>
                  <small>Owner: {s.owner}{s.by ? ` · updated by ${s.by} · ${s.at}` : ''}{s.files.length ? ` · ${s.files.length} file${s.files.length > 1 ? 's' : ''}` : ''}</small>
                </span>
                <span className={`pipe-badge ${s.status}`}>{LABEL[s.status]}</span>
              </button>
              {isOpen && (
                <div className="pipe-detail">
                  {editable ? (
                    <>
                      <div className="seg">
                        {STATUS.map((o) => (
                          <button key={o.key} type="button" className={`seg-btn ${s.status === o.key ? 'on' : ''}`}
                            onClick={() => setStage(app.kno, s.n, { status: o.key, by: role, at: today() })}>{o.label}</button>
                        ))}
                      </div>
                      <label>Update note<input value={s.note} placeholder="Add a note for this stage…" onChange={(e) => setStage(app.kno, s.n, { note: e.target.value })} /></label>
                      <FileUpload label="Upload proof / document" files={s.files} onAdd={(f) => addStageFile(app.kno, s.n, f)} onRemove={(id) => removeStageFile(app.kno, s.n, id)} />
                    </>
                  ) : (
                    <>
                      <p className="muted">{s.note || 'No update note yet.'}</p>
                      {s.files.length > 0 && (
                        <ul className="file-list">
                          {s.files.map((f) => (
                            <li key={f.id}>
                              {f.dataUrl ? <img src={f.dataUrl} alt="" className="file-thumb" /> : <span className="file-ic">{(f.type.split('/')[1] || 'file').slice(0, 4).toUpperCase()}</span>}
                              <span className="file-meta"><strong>{f.name}</strong><small>uploaded</small></span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  )}
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
