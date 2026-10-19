import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'

const ICON = import.meta.env.BASE_URL + 'icon.svg'
const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/contact', label: 'Contact' },
  { to: '/portal', label: 'Portal' },
]

export default function Navbar() {
  const { isAuthed, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  return (
    <header className="nav">
      <NavLink to="/" className="nav-brand" onClick={() => setOpen(false)}>
        <img src={ICON} alt="" width="34" height="34" />
        <span className="nav-brand-text"><strong>RJ Techno</strong><small>Solar Operations</small></span>
      </NavLink>

      <button className="nav-toggle" aria-label="Toggle navigation menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <span></span><span></span><span></span>
      </button>

      <nav className={`nav-links ${open ? 'open' : ''}`} onClick={() => setOpen(false)}>
        {LINKS.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => (isActive ? 'active' : undefined)}>
            {l.label}
          </NavLink>
        ))}
        {isAuthed ? (
          <button className="btn btn-sm" onClick={() => { logout(); navigate('/') }}>Log out</button>
        ) : (
          <NavLink to="/login" className="btn btn-sm">Login</NavLink>
        )}
      </nav>
    </header>
  )
}
