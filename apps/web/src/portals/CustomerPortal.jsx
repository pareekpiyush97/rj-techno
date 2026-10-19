import { useState } from 'react'
import { useStore } from '../store/StoreContext.jsx'
import FileUpload from '../components/FileUpload.jsx'

export default function CustomerPortal() {
  const { data, addFile, removeFile, addRequest } = useStore()
  const [req, setReq] = useState({ subject: '', detail: '' })

  function submit(e) {
    e.preventDefault()
    if (!req.subject.trim()) return
    addRequest(req)
    setReq({ subject: '', detail: '' })
  }

  return (
    <>
      <section className="band">
        <h2>Your projects</h2>
        <div className="grid-2">
          {data.projects.map((p) => (
            <article className="card" key={p.id}>
              <div className="row-between"><h3>{p.id}</h3><span className="pill">{p.status}</span></div>
              <p className="muted">{p.site}</p>
              <div className="bar"><span style={{ width: p.pct + '%' }}></span></div>
              <small className="muted">{p.pct}% complete</small>
              <FileUpload label="Upload document" files={p.files} onAdd={(f) => addFile('projects', p.id, f)} onRemove={(id) => removeFile('projects', p.id, id)} />
            </article>
          ))}
        </div>
      </section>

      <section className="band grid-2">
        <article className="card">
          <h3>Raise a service request</h3>
          <form className="form" onSubmit={submit}>
            <label>Subject<input value={req.subject} onChange={(e) => setReq({ ...req, subject: e.target.value })} placeholder="e.g. Inverter showing a fault" required /></label>
            <label>Details<textarea rows="3" value={req.detail} onChange={(e) => setReq({ ...req, detail: e.target.value })} placeholder="What's happening on site?"></textarea></label>
            <button className="btn btn-sm" type="submit">Submit request</button>
          </form>
        </article>
        <article className="card">
          <h3>Your requests</h3>
          {data.requests.length === 0
            ? <p className="muted">No requests yet — raise one and it appears here.</p>
            : <ul className="req-list">{data.requests.map((r) => (
                <li key={r.id}>
                  <div className="row-between"><strong>{r.subject}</strong><span className="pill">{r.status}</span></div>
                  <small className="muted">{r.id} · {r.at}</small>
                  {r.detail && <p className="muted req-detail">{r.detail}</p>}
                </li>
              ))}</ul>}
        </article>
      </section>
    </>
  )
}
