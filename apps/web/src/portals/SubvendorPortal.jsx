import { useStore } from '../store/StoreContext.jsx'
import FileUpload from '../components/FileUpload.jsx'

const JOB_STATUS = ['Scheduled', 'On site', 'In progress', 'Completed']

export default function SubvendorPortal() {
  const { data, updateItem, addFile, removeFile } = useStore()
  return (
    <section className="band">
      <h2>Assigned jobs</h2>
      <div className="grid-2">
        {data.jobs.map((j) => (
          <article className="card" key={j.id}>
            <div className="row-between">
              <h3>{j.id}</h3>
              <select className="status-sel" aria-label="Job status" value={j.status} onChange={(e) => updateItem('jobs', j.id, { status: e.target.value })}>
                {JOB_STATUS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <p className="muted">{j.task}</p>
            <label>Note
              <input value={j.note} placeholder="Progress note…" onChange={(e) => updateItem('jobs', j.id, { note: e.target.value })} />
            </label>
            <FileUpload label="Upload completion proof" files={j.files} onAdd={(f) => addFile('jobs', j.id, f)} onRemove={(id) => removeFile('jobs', j.id, id)} />
          </article>
        ))}
      </div>
    </section>
  )
}
