import { useStore } from '../store/StoreContext.jsx'
import FileUpload from './FileUpload.jsx'

export default function AppDocuments({ app, title = 'Documents', hintLine }) {
  const { addAppFile, removeAppFile } = useStore()
  return (
    <article className="card">
      <h3>{title}</h3>
      <p className="muted">{hintLine || `Upload bills, photos, approvals or any document for ${app.kno}.`}</p>
      <FileUpload label="Upload a file" files={app.docs || []} onAdd={(f) => addAppFile(app.kno, f)} onRemove={(id) => removeAppFile(app.kno, id)} />
    </article>
  )
}
