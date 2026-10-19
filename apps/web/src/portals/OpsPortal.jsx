import { useState } from 'react'
import { useStore } from '../store/StoreContext.jsx'
import { ROLE_LABEL } from '../auth/roles.js'
import StagePipeline from '../components/StagePipeline.jsx'

export default function OpsPortal({ role }) {
  const { data } = useStore()
  const apps = data.applications
  const [sel, setSel] = useState(apps[0] && apps[0].kno)
  const app = apps.find((a) => a.kno === sel) || apps[0]

  return (
    <>
      <section className="band">
        <h2>Applications</h2>
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
