import { useState } from 'react'
import { useStore } from '../store/StoreContext.jsx'
import StagePipeline from '../components/StagePipeline.jsx'

export default function CustomerPortal() {
  const { data, addComplaint } = useStore()
  const apps = data.applications
  const [query, setQuery] = useState('')
  const [knoSel, setKnoSel] = useState(null)   // confirmed K.No. after lookup
  const [lookErr, setLookErr] = useState('')
  const [tab, setTab] = useState('progress')   // 'progress' | 'complaint'
  const [text, setText] = useState('')

  // re-derive live from store so new complaints show immediately
  const app = knoSel ? apps.find((a) => a.kno === knoSel) : null
  const done = app ? app.stages.filter((s) => s.status === 'done').length : 0
  const active = app ? app.stages.find((s) => s.status !== 'done') : null

  function track(e) {
    e.preventDefault()
    const q = query.trim().toUpperCase()
    if (!q) { setLookErr('Please enter your Consumer Number (K. No.).'); setKnoSel(null); return }
    const found = apps.find((a) => a.kno.toUpperCase() === q)
    if (!found) { setLookErr(`No application found for "${query.trim()}". Please check your number or contact RJ Techno.`); setKnoSel(null); return }
    setKnoSel(found.kno); setLookErr(''); setTab('progress')
  }

  function submitComplaint(e) {
    e.preventDefault()
    if (!text.trim() || !app) return
    addComplaint(app.kno, text.trim())
    setText('')
  }

  return (
    <>
      <section className="band">
        <form className="card kno-lookup" onSubmit={track}>
          <h2>Enter your Consumer Number (K. No.)</h2>
          <p className="muted">Enter your registered Consumer Number (K. No.) to see your installation progress or raise a complaint.</p>
          <div className="lookup-row">
            <input value={query} onChange={(e) => { setQuery(e.target.value); setLookErr('') }} placeholder="e.g. RJ-BKN-100482" aria-label="Consumer Number" autoComplete="off" />
            <button className="btn" type="submit">Track</button>
          </div>
          {lookErr && <p className="err">{lookErr}</p>}
          <p className="note">Don't know your K. No.? It's on your proposal / RJ Techno will share it.</p>
        </form>
      </section>

      {app && (
        <>
          <section className="band">
            <div className="track-head card">
              <span className="role-chip">{app.kno}</span>
              <h2>{app.customer}</h2>
              <p className="muted">{app.site} · {done}/11 stages done{active ? ` · Current: ${active.t}` : ' · Completed & handed over'}</p>
            </div>
            <div className="tabs">
              <button type="button" className={`tab ${tab === 'progress' ? 'on' : ''}`} onClick={() => setTab('progress')}>See installation process</button>
              <button type="button" className={`tab ${tab === 'complaint' ? 'on' : ''}`} onClick={() => setTab('complaint')}>Raise a complaint</button>
            </div>
          </section>

          {tab === 'progress' ? (
            <section className="band">
              <h2>Installation progress</h2>
              <StagePipeline app={app} editable={false} role="Customer" />
            </section>
          ) : (
            <section className="band grid-2">
              <article className="card">
                <h3>Raise a complaint</h3>
                <form className="form" onSubmit={submitComplaint}>
                  <label>Complaint / issue<textarea rows="3" value={text} onChange={(e) => setText(e.target.value)} placeholder="Describe your issue…"></textarea></label>
                  <button className="btn btn-sm" type="submit">Submit complaint</button>
                </form>
              </article>
              <article className="card">
                <h3>Your complaints</h3>
                {app.complaints.length === 0
                  ? <p className="muted">No complaints raised for {app.kno}.</p>
                  : <ul className="req-list">{app.complaints.map((c) => (
                      <li key={c.id}><div className="row-between"><strong>{c.text}</strong><span className="pill">{c.status}</span></div><small className="muted">{c.id} · {c.at}</small></li>
                    ))}</ul>}
              </article>
            </section>
          )}
        </>
      )}
    </>
  )
}
