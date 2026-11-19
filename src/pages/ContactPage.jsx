import { useEffect, useRef, useState } from 'react'
import { content, t } from '../content/index.js'
import { finePointer, gsap, prefersReduced, useLenis } from '../lib/motion.js'
import { Link, PAGES } from '../lib/router.jsx'
import { Avatar } from '../components/Chrome.jsx'
import './pages.css'

const { settings, services } = content

function useClock(tz) {
  const fmt = () => new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: tz }).format(new Date()).replaceAll('.', ':')
  const [now, setNow] = useState(fmt)
  useEffect(() => {
    const id = setInterval(() => setNow(fmt()), 1000)
    return () => clearInterval(id)
  })
  return now
}

/** Tombol bulat yang tertarik ke kursor (ref. tombol kirim dennissnellenberg.com/contact). */
function useMagnet(ref) {
  useEffect(() => {
    const el = ref.current
    if (!el || !finePointer() || prefersReduced()) return
    const x = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' })
    const y = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' })
    const move = (e) => {
      const r = el.getBoundingClientRect()
      x((e.clientX - (r.left + r.width / 2)) * 0.35)
      y((e.clientY - (r.top + r.height / 2)) * 0.35)
    }
    const leave = () => { x(0); y(0) }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave) }
  }, [ref])
}

/**
 * Halaman Kontak (ref. dennissnellenberg.com/contact + pilihan chip cuberto.com/contacts):
 * pertanyaan bernomor yang menyusun email atau pesan WhatsApp. Tidak ada server: tombol
 * kirim hanya membuka aplikasi email / WhatsApp pengunjung dengan pesan yang sudah terisi.
 */
export default function ContactPage({ lang, ui, setLang }) {
  const root = useRef(null)
  const send = useRef(null)
  const lenis = useLenis()
  const time = useClock(settings.timezone)
  const [form, setForm] = useState({ name: '', email: '', topics: [], message: '' })
  const [copied, setCopied] = useState(false)
  const sec = settings.sections.contact
  const c = ui.contactPage
  useMagnet(send)

  const options = [...services.map((s) => t(lang, s.title)), ...c.extraTopics]
  const toggle = (o) => setForm((f) => ({ ...f, topics: f.topics.includes(o) ? f.topics.filter((x) => x !== o) : [...f.topics, o] }))
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const body = [
    form.message.trim(),
    form.topics.length ? `\n${c.topicsLabel}: ${form.topics.join(', ')}` : '',
    `\n— ${form.name.trim() || c.anon}${form.email.trim() ? ` (${form.email.trim()})` : ''}`,
  ].join('').trim()
  const subject = `${c.subject}${form.name.trim() ? ` — ${form.name.trim()}` : ''}`
  const mailto = `mailto:${settings.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  const wa = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(`${subject}\n\n${body}`)}`
  const ready = form.message.trim().length > 0

  const copy = async () => {
    try { await navigator.clipboard.writeText(settings.email); setCopied(true); setTimeout(() => setCopied(false), 1800) } catch { /* clipboard diblokir */ }
  }

  useEffect(() => {
    if (prefersReduced()) return
    const ctx = gsap.context(() => {
      gsap.from('.ct-char', { yPercent: 110, rotate: 8, duration: 0.9, ease: 'expo.out', stagger: 0.018, delay: 0.2 })
      gsap.from('.ct-fade', { y: 30, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.07, delay: 0.55 })
      gsap.from('.ct-q', { y: 50, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: '.ct-form', start: 'top 85%' } })
    }, root)
    return () => ctx.revert()
  }, [lang])

  const title = `${t(lang, sec.lead)} ${t(lang, sec.tail)}`
  const words = title.split(' ')
  const toTop = (e) => { e.preventDefault(); if (lenis) lenis.scrollTo(0, { duration: 1.4 }); else window.scrollTo({ top: 0 }) }

  return (
    <div ref={root} className="ct-page" data-theme="dark" id="contact">
      <section className="ct-hero" data-theme="dark">
        <h1 className="ct-title" aria-label={title}>
          {words.map((w, i) => (
            <span key={i} className={`ct-w ${i >= t(lang, sec.lead).split(' ').length ? 'tail' : ''}`} aria-hidden="true">
              {w.split('').map((ch, k) => <span key={k} className="ct-char">{ch}</span>)}
            </span>
          ))}
        </h1>
        <div className="ct-me ct-fade">
          <Avatar size={96} />
          <span className="ct-arrow" aria-hidden="true">↘</span>
        </div>
      </section>

      <div className="ct-grid">
        <form className="ct-form" onSubmit={(e) => { e.preventDefault(); if (ready) window.location.href = mailto }}>
          <label className="ct-q">
            <span className="mono">01</span>
            <span className="ct-ask">{c.qName}</span>
            <input value={form.name} onChange={set('name')} placeholder={c.phName} autoComplete="name" />
          </label>
          <label className="ct-q">
            <span className="mono">02</span>
            <span className="ct-ask">{c.qEmail}</span>
            <input type="email" value={form.email} onChange={set('email')} placeholder={c.phEmail} autoComplete="email" />
          </label>
          <fieldset className="ct-q">
            <span className="mono">03</span>
            <legend className="ct-ask">{c.qTopics}</legend>
            <div className="ct-chips">
              {options.map((o) => (
                <button key={o} type="button" className={form.topics.includes(o) ? 'on' : ''} aria-pressed={form.topics.includes(o)} onClick={() => toggle(o)}>{o}</button>
              ))}
            </div>
          </fieldset>
          <label className="ct-q">
            <span className="mono">04</span>
            <span className="ct-ask">{c.qMessage} *</span>
            <textarea value={form.message} onChange={set('message')} placeholder={c.phMessage} rows={4} required />
          </label>

          <div className="ct-send">
            <button ref={send} type="submit" className="ct-send-btn" disabled={!ready} data-cursor={ready ? c.sendMail : undefined}>
              <span>{c.sendMail}</span>
            </button>
            <div className="ct-send-alt">
              <a className={`pill pill-ghost ${ready ? '' : 'off'}`} href={ready ? wa : undefined} aria-disabled={!ready} target="_blank" rel="noreferrer">{c.sendWa} ↗</a>
              <p className="mono">{ready ? c.note : c.needMessage}</p>
            </div>
          </div>
        </form>

        <aside className="ct-info ct-fade">
          <div>
            <h2 className="mono">{c.details}</h2>
            <button type="button" className="ct-mail" onClick={copy} aria-live="polite">
              <span>{settings.email}</span>
              <em className="mono">{copied ? c.copied : c.copy}</em>
            </button>
            <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer">WhatsApp ↗</a>
            {settings.links.github && <a href={settings.links.github} target="_blank" rel="noreferrer">GitHub ↗</a>}
          </div>
          <div>
            <h2 className="mono">{c.where}</h2>
            <p>{settings.location}</p>
            <p className="ct-clock">{time} <span className="mono">WIB</span></p>
          </div>
          <div>
            <h2 className="mono">{ui.navigation}</h2>
            <ul className="ct-nav">{PAGES.map(({ id, path }) => <li key={id}><Link to={path}>{ui.nav[id]}</Link></li>)}</ul>
          </div>
          <div>
            <h2 className="mono">{ui.language}</h2>
            <div className="lang lang-foot" role="group" aria-label={ui.language}>
              {['id', 'en'].map((l) => (
                <button key={l} type="button" className={lang === l ? 'on' : ''} aria-pressed={lang === l} onClick={() => setLang(l)}>{l.toUpperCase()}</button>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <footer className="ct-foot mono">
        <span>© 2026 {settings.name}</span>
        <span>{ui.builtWith}</span>
        <a href="#main" onClick={toTop}>{ui.backToTop} ↑</a>
      </footer>
    </div>
  )
}
