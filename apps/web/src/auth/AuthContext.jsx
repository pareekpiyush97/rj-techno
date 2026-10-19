import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { ROLE_LABEL } from './roles.js'

// DEMO-ONLY client gate. NOT a real security boundary — anyone can read the public
// bundle. Real auth = PocketBase server-side, per-role collection rules on the VPS.
const DEMO_CODE = import.meta.env.VITE_DEMO_CODE || ''
const STORAGE_KEY = 'rjt_demo_session'
const MAX_ATTEMPTS = 5
const LOCK_MS = 30_000

const AuthContext = createContext(null)

function readSession() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readSession)
  const [attempts, setAttempts] = useState(0)
  const [lockedUntil, setLockedUntil] = useState(0)

  useEffect(() => {
    try {
      if (user) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
      else sessionStorage.removeItem(STORAGE_KEY)
    } catch { /* storage unavailable — memory-only session */ }
  }, [user])

  const login = useCallback((code, role = 'customer') => {
    const now = Date.now()
    if (now < lockedUntil) {
      const secs = Math.ceil((lockedUntil - now) / 1000)
      return { ok: false, error: `Too many attempts. Try again in ${secs}s.` }
    }
    if (DEMO_CODE && code === DEMO_CODE) {
      setAttempts(0)
      setUser({ name: `Demo ${ROLE_LABEL[role] || 'User'}`, role, since: new Date().toISOString() })
      return { ok: true }
    }
    const next = attempts + 1
    if (next >= MAX_ATTEMPTS) {
      setAttempts(0)
      setLockedUntil(now + LOCK_MS)
      return { ok: false, error: `Too many attempts. Locked for ${LOCK_MS / 1000}s.` }
    }
    setAttempts(next)
    return { ok: false, error: 'Invalid access code.' }
  }, [attempts, lockedUntil])

  const logout = useCallback(() => setUser(null), [])

  return (
    <AuthContext.Provider value={{ user, isAuthed: !!user, login, logout, lockedUntil }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
