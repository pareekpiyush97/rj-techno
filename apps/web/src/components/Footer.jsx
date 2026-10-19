import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="foot">
      <div className="foot-grid">
        <div>
          <strong className="foot-brand">RJ Techno</strong>
          <p>Solar EPC, O&amp;M and a 4-portal operations platform for homes and businesses across Bikaner, Rajasthan.</p>
        </div>
        <div>
          <h4>Pages</h4>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/services">Services</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <div>
          <h4>Get in touch</h4>
          <p>Bikaner, Rajasthan 334001</p>
          <p><a href="mailto:hello@rjtechno.in">hello@rjtechno.in</a></p>
        </div>
      </div>
      <div className="foot-base">
        <span>© {new Date().getFullYear()} RJ Techno. All rights reserved.</span>
        <span>Built by Zrimat</span>
      </div>
    </footer>
  )
}
