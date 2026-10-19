import { useState } from 'react'
import { Navigate, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'

export default function Login() {
  const { login, isAuthed } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const dest = location.state?.from || '/customer'
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (isAuthed) return <Navigate to={dest} replace />

  function onSubmit(e) {
    e.preventDefault()
    setBusy(true)
    const res = login(code.trim())
    setBusy(false)
    if (res.ok) navigate(dest, { replace: true })
    else { setError(res.error); setCode('') }
  }

  return (
    <section className="auth-wrap">
      <div className="card auth-card">
        <span className="demo-badge">DEMO</span>
        <h1>Customer login</h1>
        <p className="muted">Enter your access code to view your projects.</p>
        <form onSubmit={onSubmit} noValidate>
          <label>Access code
            <input
              type="password" name="code" value={code} autoComplete="off"
              inputMode="numeric" autoFocus aria-invalid={!!error}
              onChange={(e) => { setCode(e.target.value); setError('') }}
            />
          </label>
          {error && <p className="err" role="alert">{error}</p>}
          <button className="btn full" type="submit" disabled={busy || !code}>
            {busy ? 'Checking…' : 'Sign in'}
          </button>
        </form>
        <p className="note">
          Prototype gate — <strong>not real authentication</strong>. Production login runs
          server-side on PocketBase. Demo code: <strong>224001</strong>.
        </p>
      </div>
    </section>
  )
}
