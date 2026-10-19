import { useStore } from '../store/StoreContext.jsx'
import FileUpload from '../components/FileUpload.jsx'

const ORDER_STATUS = ['Pending', 'Dispatched', 'Delivered', 'Payment due', 'Paid']

export default function VendorPortal() {
  const { data, updateItem, addFile, removeFile } = useStore()
  return (
    <section className="band">
      <h2>Open orders</h2>
      <div className="grid-2">
        {data.orders.map((o) => (
          <article className="card" key={o.id}>
            <div className="row-between">
              <h3>{o.id}</h3>
              <select className="status-sel" aria-label="Order status" value={o.status} onChange={(e) => updateItem('orders', o.id, { status: e.target.value })}>
                {ORDER_STATUS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <p className="muted">{o.item}</p>
            <label>Note
              <input value={o.note} placeholder="Dispatch / payment note…" onChange={(e) => updateItem('orders', o.id, { note: e.target.value })} />
            </label>
            <FileUpload label="Upload invoice / challan" files={o.files} onAdd={(f) => addFile('orders', o.id, f)} onRemove={(id) => removeFile('orders', o.id, id)} />
          </article>
        ))}
      </div>
    </section>
  )
}
