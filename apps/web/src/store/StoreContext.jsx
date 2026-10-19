import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'

const KEY = 'rjt_store_v2'

export const STAGE_DEFS = [
  { id: 1,  t: 'Site Survey',         d: 'Measure roof, shading and load; capture baseline site conditions.', field: true },
  { id: 2,  t: 'System Design',       d: 'Size the array, strings and inverter for real consumption.', field: false },
  { id: 3,  t: 'Proposal & Approval', d: 'Quotation, customer sign-off and DISCOM registration.', field: false },
  { id: 4,  t: 'Material Dispatch',   d: 'Modules, inverter and balance-of-system dispatched to site.', field: false },
  { id: 5,  t: 'Site Preparation',    d: 'Mark layout, prep roof penetrations and rig safety lines.', field: true },
  { id: 6,  t: 'Structure Mounting',  d: 'Install mounting structure and rails; level and torque.', field: true },
  { id: 7,  t: 'Module Installation', d: 'Place and clamp modules; verify orientation and tilt.', field: true },
  { id: 8,  t: 'DC Cabling',          d: 'String wiring, MC4 terminations and DC routing.', field: true },
  { id: 9,  t: 'Inverter & AC',       d: 'Mount inverter, AC cabling and protection devices.', field: true },
  { id: 10, t: 'Earthing & Safety',   d: 'Earthing, SPD and continuity checks.', field: true },
  { id: 11, t: 'Net-Metering',        d: 'Bi-directional meter install and DISCOM inspection.', field: true },
  { id: 12, t: 'Commissioning',       d: 'Power on, performance check and customer handover.', field: true },
]

function seed() {
  return {
    projects: [
      { id: 'RJT-1042', site: 'Rooftop · 5 kW · Bikaner', status: 'Installation', pct: 65, files: [] },
      { id: 'RJT-1039', site: 'C&I · 40 kW · Nokha', status: 'Net-metering', pct: 85, files: [] },
    ],
    orders: [
      { id: 'PO-5521', item: 'Modules · 24 × 540W', status: 'Dispatched', note: '', files: [] },
      { id: 'PO-5519', item: 'Inverters · 5 kW × 3', status: 'Payment due', note: '', files: [] },
    ],
    jobs: [
      { id: 'SV-204', task: 'Structure mounting · Nokha', status: 'Scheduled', note: '', files: [] },
      { id: 'SV-198', task: 'DC cabling · Bikaner', status: 'On site', note: '', files: [] },
    ],
    stages: STAGE_DEFS.map((s) => ({ ...s, status: s.id < 7 ? 'done' : 'pending', files: [] })),
    requests: [],
  }
}

function load() {
  try { const raw = localStorage.getItem(KEY); if (raw) { const p = JSON.parse(raw); if (p && p.stages) return p } } catch { /* ignore */ }
  return seed()
}

const StoreContext = createContext(null)

export function StoreProvider({ children }) {
  const [data, setData] = useState(load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(data))
    } catch {
      try {
        const slim = { ...data }
        for (const c of ['projects', 'orders', 'jobs', 'stages']) {
          slim[c] = data[c].map((i) => ({ ...i, files: i.files.map((f) => ({ ...f, dataUrl: undefined })) }))
        }
        localStorage.setItem(KEY, JSON.stringify(slim))
      } catch { /* give up persisting; memory still works */ }
    }
  }, [data])

  const updateItem = useCallback((coll, id, patch) => {
    setData((d) => ({ ...d, [coll]: d[coll].map((i) => (i.id === id ? { ...i, ...patch } : i)) }))
  }, [])
  const addFile = useCallback((coll, id, file) => {
    setData((d) => ({ ...d, [coll]: d[coll].map((i) => (i.id === id ? { ...i, files: [...i.files, file] } : i)) }))
  }, [])
  const removeFile = useCallback((coll, id, fid) => {
    setData((d) => ({ ...d, [coll]: d[coll].map((i) => (i.id === id ? { ...i, files: i.files.filter((f) => f.id !== fid) } : i)) }))
  }, [])
  const addRequest = useCallback((r) => {
    setData((d) => ({ ...d, requests: [{ id: 'SR-' + String(Date.now()).slice(-5), at: new Date().toLocaleString(), status: 'Open', ...r }, ...d.requests] }))
  }, [])
  const resetAll = useCallback(() => setData(seed()), [])

  const value = useMemo(
    () => ({ data, updateItem, addFile, removeFile, addRequest, resetAll }),
    [data, updateItem, addFile, removeFile, addRequest, resetAll]
  )
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const c = useContext(StoreContext)
  if (!c) throw new Error('useStore must be used within StoreProvider')
  return c
}
