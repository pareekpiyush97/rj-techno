import { useRef, useState } from 'react'

function readFile(file) {
  return new Promise((resolve) => {
    const base = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      name: file.name, size: file.size, type: file.type || 'file',
    }
    if (file.type && file.type.startsWith('image/') && file.size < 2_000_000) {
      const r = new FileReader()
      r.onload = () => resolve({ ...base, dataUrl: r.result })
      r.onerror = () => resolve(base)
      r.readAsDataURL(file)
    } else resolve(base)
  })
}

export default function FileUpload({ files = [], onAdd, onRemove, label = 'Upload files', accept, hint = 'Photos, PDF or documents' }) {
  const ref = useRef(null)
  const [drag, setDrag] = useState(false)

  async function handleFiles(list) {
    for (const f of list) { const rec = await readFile(f); onAdd(rec) }
  }
  async function onChange(e) { await handleFiles(Array.from(e.target.files || [])); e.target.value = '' }
  function onDrop(e) { e.preventDefault(); setDrag(false); handleFiles(Array.from(e.dataTransfer.files || [])) }

  return (
    <div className="uploader">
      <button
        type="button"
        className={`dropzone ${drag ? 'drag' : ''}`}
        onClick={() => ref.current && ref.current.click()}
        onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
      >
        <span className="dz-ic" aria-hidden="true">⬆</span>
        <span className="dz-text"><strong>{label}</strong><small>{hint} — click or drag &amp; drop</small></span>
      </button>
      <input ref={ref} type="file" accept={accept} multiple hidden onChange={onChange} />
      {files.length > 0 && (
        <ul className="file-list">
          {files.map((f) => (
            <li key={f.id}>
              {f.dataUrl
                ? <img src={f.dataUrl} alt="" className="file-thumb" />
                : <span className="file-ic">{(f.type.split('/')[1] || 'file').slice(0, 4).toUpperCase()}</span>}
              <span className="file-meta"><strong>{f.name}</strong><small>{(f.size / 1024).toFixed(0)} KB · uploaded</small></span>
              <button type="button" className="file-x" aria-label={`Remove ${f.name}`} onClick={() => onRemove(f.id)}>×</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
