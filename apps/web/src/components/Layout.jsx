import { Outlet } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'

export default function Layout() {
  return (
    <div className="site">
      <a className="skip" href="#main">Skip to content</a>
      <Navbar />
      <main id="main" className="main">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
