import { useState } from 'react'
import { Navigate, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'
import { ROLES } from '../auth/roles.js'

export default function Login() {
  const { login, isAuthed } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const dest = location.state?.from || '/portal'
  const [role, setRole] = useState('customer')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (isAuthed) return <Navigate to={dest} replace />

  function onSubmit(e) {
    e.preventDefault()
    setBusy(true)
    const res = login(code.trim(), role)
    setBusy(false)
    if (res.ok) navigate(dest, { replace: true })
    else { setError(res.error); setCode('') }
  }

  return (
    <section className="auth-wrap">
      <div className="card auth-card">
        <h1>Portal sign-in</h1>
        <p className="muted">One secure login for every RJ Techno portal. Choose your role and enter your access code.</p>
        <form onSubmit={onSubmit} noValidate>
          <div className="role-picker" role="radiogroup" aria-label="Portal role">
            {ROLES.map((r) => (
              <button type="button" key={r.key} className={`role-opt ${role === r.key ? 'active' : ''}`} aria-pressed={role === r.key} onClick={() => setRole(r.key)}>
                <strong>{r.label}</strong><small>{r.desc}</small>
              </button>
            ))}
          </div>
          <label>Access code
            <input type="password" name="code" value={code} autoComplete="off" inputMode="numeric" autoFocus aria-invalid={!!error}
              onChange={(e) => { setCode(e.target.value); setError('') }} />
          </label>
          {error && <p className="err" role="alert">{error}</p>}
          <button className="btn full" type="submit" disabled={busy || !code}>{busy ? 'Signing in…' : 'Sign in'}</button>
        </form>
        <p className="note">Trouble signing in? Reach your RJ Techno coordinator.</p>
      </div>
    </section>
  )
}
