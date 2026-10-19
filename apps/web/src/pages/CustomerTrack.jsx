import CustomerPortal from '../portals/CustomerPortal.jsx'

// Public, no-login customer page. A customer with no portal access simply
// enters their registered Consumer Number (K. No.) and sees live progress
// or raises a complaint. The lookup UI itself lives in CustomerPortal.
export default function CustomerTrack() {
  return (
    <>
      <section className="page-head">
        <span className="role-chip">Customer self-service</span>
        <h1>Track your solar installation</h1>
        <p className="lede">
          No login needed. Enter the 12-digit Consumer Number (K.&nbsp;No.) printed
          as <strong>&ldquo;KNO&rdquo;</strong> on your electricity bill to see the live
          installation progress for your site, or raise a complaint — the same
          status RJ Techno&rsquo;s team updates at every stage.
        </p>
      </section>
      <CustomerPortal />
    </>
  )
}
