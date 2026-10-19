import { useState } from 'react'
import { useStore } from '../store/StoreContext.jsx'
import StagePipeline from '../components/StagePipeline.jsx'
import AppDocuments from '../components/AppDocuments.jsx'

export default function CustomerPortal() {
  const { data, addComplaint } = useStore()
  const apps = data.applications
  const [kno, setKno] = useState(apps[0] && apps[0].kno)
  const app = apps.find((a) => a.kno === kno) || apps[0]
  const [text, setText] = useState('')
  const done = app.stages.filter((s) => s.status === 'done').length
  const active = app.stages.find((s) => s.status !== 'done')

  function submit(e) {
    e.preventDefault()
    if (!text.trim()) return
    addComplaint(app.kno, text.trim())
    setText('')
  }

  return (
    <>
      <section className="band">
        <div className="kno-head card">
          <label>Your Consumer Number (K. No.)
            <select value={kno} onChange={(e) => setKno(e.target.value)}>
              {apps.map((a) => <option key={a.kno} value={a.kno}>{a.kno} — {a.customer}</option>)}
            </select>
          </label>
          <div className="kno-prog">
            <strong>{done} / 11 stages done</strong>
            <span className="muted">{active ? `Current: ${active.t}` : 'Completed & handed over'}</span>
          </div>
        </div>
      </section>

      <section className="band">
        <h2>Installation progress</h2>
        <StagePipeline app={app} editable={false} role="Customer" />
      </section>

      <section className="band grid-2">
        <AppDocuments app={app} title="Your documents" hintLine="Upload your electricity bill, roof photos or ID proof here." />
        <article className="card">
          <h3>Raise a complaint</h3>
          <form className="form" onSubmit={submit}>
            <label>Complaint / issue<textarea rows="3" value={text} onChange={(e) => setText(e.target.value)} placeholder="Describe your issue…"></textarea></label>
            <button className="btn btn-sm" type="submit">Submit complaint</button>
          </form>
        </article>
      </section>

      <section className="band">
        <article className="card">
          <h3>Your complaints</h3>
          {app.complaints.length === 0
            ? <p className="muted">No complaints raised for {app.kno}.</p>
            : <ul className="req-list">{app.complaints.map((c) => (
                <li key={c.id}>
                  <div className="row-between"><strong>{c.text}</strong><span className="pill">{c.status}</span></div>
                  <small className="muted">{c.id} · {c.at}</small>
                </li>
              ))}</ul>}
        </article>
      </section>
    </>
  )
}
