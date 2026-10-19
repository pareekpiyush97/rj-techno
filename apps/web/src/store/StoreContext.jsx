import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'

const KEY = 'rjt_store_v3'

export const STAGE_DEFS = [
  { n: 1,  t: 'Site Survey & Electricity Bill Analysis',        owner: 'Employee' },
  { n: 2,  t: 'System Design & Capacity Planning',              owner: 'Employee' },
  { n: 3,  t: 'Quotation & Proposal',                           owner: 'Vendor' },
  { n: 4,  t: 'Customer Approval & Order Confirmation',         owner: 'Vendor' },
  { n: 5,  t: 'Technical Feasibility & Approvals',              owner: 'Employee' },
  { n: 6,  t: 'Procurement & Material Delivery',                owner: 'Vendor' },
  { n: 7,  t: 'Mounting Structure Installation',               owner: 'Sub-vendor' },
  { n: 8,  t: 'Solar Panel & Inverter Installation',           owner: 'Sub-vendor' },
  { n: 9,  t: 'Electrical Testing & Commissioning Preparation', owner: 'Employee' },
  { n: 10, t: 'Net Metering & DISCOM Inspection',              owner: 'Employee' },
  { n: 11, t: 'Final Commissioning & Customer Handover',       owner: 'Employee' },
]

function mkStages(current) {
  return STAGE_DEFS.map((s) => ({
    ...s,
    status: s.n < current ? 'done' : s.n === current ? 'in_progress' : 'pending',
    note: '', by: s.n < current ? s.owner : '', at: s.n < current ? '12 Oct 2026' : '', files: [],
  }))
}

function seed() {
  return {
    applications: [
      { kno: 'RJ-BKN-100482', customer: 'Ramesh Soni',  site: 'Rooftop · 5 kW · Bikaner', phone: '', docs: [], complaints: [], stages: mkStages(8) },
      { kno: 'RJ-BKN-100517', customer: 'Anita Vyas',    site: 'Rooftop · 3 kW · Nokha',   phone: '', docs: [], complaints: [], stages: mkStages(4) },
      { kno: 'RJ-BKN-100533', customer: 'Mahaveer Jain', site: 'C&I · 40 kW · Bikaner',    phone: '', docs: [], complaints: [], stages: mkStages(11) },
    ],
  }
}

function load() {
  try { const raw = localStorage.getItem(KEY); if (raw) { const p = JSON.parse(raw); if (p && p.applications) return p } } catch { /* ignore */ }
  return seed()
}

const mapApp = (d, kno, fn) => ({ ...d, applications: d.applications.map((a) => (a.kno === kno ? fn(a) : a)) })
const mapStage = (a, n, fn) => ({ ...a, stages: a.stages.map((s) => (s.n === n ? fn(s) : s)) })

const StoreContext = createContext(null)

export function StoreProvider({ children }) {
  const [data, setData] = useState(load)

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(data)) }
    catch {
      try {
        const slim = { ...data, applications: data.applications.map((a) => ({
          ...a,
          docs: (a.docs || []).map((f) => ({ ...f, dataUrl: undefined })),
          stages: a.stages.map((s) => ({ ...s, files: s.files.map((f) => ({ ...f, dataUrl: undefined })) })),
        })) }
        localStorage.setItem(KEY, JSON.stringify(slim))
      } catch { /* give up persisting; memory still works */ }
    }
  }, [data])

  const setStage = useCallback((kno, n, patch) => setData((d) => mapApp(d, kno, (a) => mapStage(a, n, (s) => ({ ...s, ...patch })))), [])
  const addStageFile = useCallback((kno, n, file) => setData((d) => mapApp(d, kno, (a) => mapStage(a, n, (s) => ({ ...s, files: [...s.files, file] })))), [])
  const removeStageFile = useCallback((kno, n, fid) => setData((d) => mapApp(d, kno, (a) => mapStage(a, n, (s) => ({ ...s, files: s.files.filter((f) => f.id !== fid) })))), [])
  const addAppFile = useCallback((kno, file) => setData((d) => mapApp(d, kno, (a) => ({ ...a, docs: [...(a.docs || []), file] }))), [])
  const removeAppFile = useCallback((kno, fid) => setData((d) => mapApp(d, kno, (a) => ({ ...a, docs: (a.docs || []).filter((f) => f.id !== fid) }))), [])
  const addComplaint = useCallback((kno, text) => setData((d) => mapApp(d, kno, (a) => ({ ...a, complaints: [{ id: 'C' + String(Date.now()).slice(-5), text, status: 'Open', at: new Date().toLocaleString() }, ...a.complaints] }))), [])
  const setComplaint = useCallback((kno, cid, patch) => setData((d) => mapApp(d, kno, (a) => ({ ...a, complaints: a.complaints.map((c) => (c.id === cid ? { ...c, ...patch } : c)) }))), [])
  const addApplication = useCallback((info) => setData((d) => {
    if (d.applications.some((a) => a.kno === info.kno)) return d
    const na = { kno: info.kno, customer: info.customer, site: info.site || '—', phone: info.phone || '', docs: [], complaints: [], stages: mkStages(1) }
    return { ...d, applications: [na, ...d.applications] }
  }), [])
  const resetAll = useCallback(() => setData(seed()), [])

  const value = useMemo(() => ({ data, setStage, addStageFile, removeStageFile, addAppFile, removeAppFile, addComplaint, setComplaint, addApplication, resetAll }),
    [data, setStage, addStageFile, removeStageFile, addAppFile, removeAppFile, addComplaint, setComplaint, addApplication, resetAll])
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const c = useContext(StoreContext)
  if (!c) throw new Error('useStore must be used within StoreProvider')
  return c
}
