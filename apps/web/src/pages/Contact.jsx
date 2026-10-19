import { useState } from 'react'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', company: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [cooldown, setCooldown] = useState(false)

  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  function validate() {
    const er = {}
    if (form.name.trim().length < 2) er.name = 'Please enter your name.'
    if (!EMAIL_RE.test(form.email)) er.email = 'Enter a valid email address.'
    if (form.phone && !/^[0-9+\-\s()]{7,15}$/.test(form.phone)) er.phone = 'Enter a valid phone number.'
    if (form.message.trim().length < 10) er.message = 'Tell us a little more (10+ characters).'
    return er
  }

  function onSubmit(e) {
    e.preventDefault()
    if (cooldown) return
    if (form.company) { setStatus('sent'); return } // honeypot
    const er = validate()
    setErrors(er)
    if (Object.keys(er).length) return
    try {
      const list = JSON.parse(localStorage.getItem('rjt_enquiries') || '[]')
      list.unshift({ ...form, company: undefined, at: new Date().toISOString() })
      localStorage.setItem('rjt_enquiries', JSON.stringify(list.slice(0, 50)))
    } catch { /* ignore */ }
    setStatus('sent')
    setForm({ name: '', email: '', phone: '', message: '', company: '' })
    setCooldown(true)
    setTimeout(() => setCooldown(false), 12000)
  }

  return (
    <>
      <section className="page-head">
        <p className="eyebrow">Contact</p>
        <h1>Let's talk solar.</h1>
        <p className="lede">Share your site details and we'll get back within one working day.</p>
      </section>

      <section className="band contact-grid">
        <form className="form card" onSubmit={onSubmit} noValidate>
          <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" value={form.company} onChange={update} />
          <label>Name<input name="name" value={form.name} onChange={update} autoComplete="name" required />{errors.name && <em className="err">{errors.name}</em>}</label>
          <label>Email<input name="email" type="email" value={form.email} onChange={update} autoComplete="email" required />{errors.email && <em className="err">{errors.email}</em>}</label>
          <label>Phone <span className="opt">(optional)</span><input name="phone" type="tel" value={form.phone} onChange={update} autoComplete="tel" inputMode="tel" />{errors.phone && <em className="err">{errors.phone}</em>}</label>
          <label>Message<textarea name="message" rows="4" value={form.message} onChange={update} required></textarea>{errors.message && <em className="err">{errors.message}</em>}</label>
          <button className="btn" type="submit" disabled={cooldown}>{cooldown ? 'Message sent ✓' : 'Send message'}</button>
          {status === 'sent' && <p className="note ok">Thanks — your message is in. We'll get back within one working day.</p>}
        </form>
        <aside className="card contact-info">
          <h3>Reach us</h3>
          <p><strong>RJ Techno</strong><br />Bikaner, Rajasthan 334001</p>
          <p><a href="mailto:hello@rjtechno.in">hello@rjtechno.in</a></p>
          <p className="muted">Mon–Sat · 9:30am – 7:00pm</p>
        </aside>
      </section>
    </>
  )
}
