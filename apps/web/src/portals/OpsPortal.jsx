import { useState } from 'react'
import { useStore } from '../store/StoreContext.jsx'
import { ROLE_LABEL } from '../auth/roles.js'
import StagePipeline from '../components/StagePipeline.jsx'

const BLANK = { kno: '', customer: '', site: '', phone: '' }

export default function OpsPortal({ role }) {
  const { data, addApplication } = useStore()
  const apps = data.applications
  const [sel, setSel] = useState(apps[0] && apps[0].kno)
  const [showNew, setShowNew] = useState(false)
  const [form, setForm] = useState(BLANK)
  const [err, setErr] = useState('')
  const app = apps.find((a) => a.kno === sel) || apps[0]

  function create(e) {
    e.preventDefault()
    const kno = form.kno.trim()
    const customer = form.customer.trim()
    if (!kno || !customer) { setErr('K. No. and customer name are required.'); return }
    if (apps.some((a) => a.kno === kno)) { setErr('That K. No. already exists.'); return }
    addApplication({ kno, customer, site: form.site.trim(), phone: form.phone.trim() })
    setSel(kno); setForm(BLANK); setErr(''); setShowNew(false)
  }

  return (
    <>
      <section className="band">
        <div className="row-between">
          <h2>Applications</h2>
          <button type="button" className="btn btn-sm" onClick={() => { setShowNew((v) => !v); setErr('') }}>
            {showNew ? 'Close' : '+ New application'}
          </button>
        </div>

        {showNew && (
          <form className="card new-app" onSubmit={create} style={{ marginBottom: '14px' }}>
            <div className="form-grid">
              <label>Consumer Number (K. No.) *<input value={form.kno} onChange={(e) => setForm({ ...form, kno: e.target.value })} placeholder="e.g. RJ-BKN-100600" /></label>
              <label>Customer name *<input value={form.customer} onChange={(e) => setForm({ ...form, customer: e.target.value })} placeholder="e.g. Sunita Devi" /></label>
              <label>System / site<input value={form.site} onChange={(e) => setForm({ ...form, site: e.target.value })} placeholder="e.g. Rooftop · 4 kW · Bikaner" /></label>
              <label>Phone<input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Optional" inputMode="tel" /></label>
            </div>
            {err && <p className="err">{err}</p>}
            <div className="cta-row">
              <button type="submit" className="btn btn-sm">Create application</button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setShowNew(false); setForm(BLANK); setErr('') }}>Cancel</button>
            </div>
            <p className="note">Creates a new application starting at Stage 1. After creating, update its stages below.</p>
          </form>
        )}

        <div className="app-list">
          {apps.map((a) => {
            const done = a.stages.filter((s) => s.status === 'done').length
            const active = a.stages.find((s) => s.status !== 'done')
            return (
              <button key={a.kno} type="button" className={`app-row ${a.kno === sel ? 'on' : ''}`} onClick={() => setSel(a.kno)}>
                <span className="app-kno">{a.kno}</span>
                <span className="app-cust"><strong>{a.customer}</strong><small>{a.site}</small></span>
                <span className="app-prog"><span className="muted">{done}/11</span><span className="pill">{active ? 'Stage ' + active.n : 'Done'}</span></span>
              </button>
            )
          })}
        </div>
      </section>

      <section className="band">
        <div className="row-between"><h2>Workflow · {app.kno}</h2><span className="muted">{app.customer} · {app.site}</span></div>
        <p className="note">You're updating as <strong>{ROLE_LABEL[role]}</strong>. Set each stage Pending / In progress / Done, add a note and upload proof.</p>
        <StagePipeline app={app} editable role={ROLE_LABEL[role]} />
      </section>
    </>
  )
}
