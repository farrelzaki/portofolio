import { useEffect, useRef, useState } from 'react'
import { content, t } from '../content/index.js'
import { finePointer, gsap, prefersReduced } from '../lib/motion.js'
import { Avatar } from '../components/Chrome.jsx'
import Icon from '../components/Icon.jsx'
import { FootBar, Wordmark } from '../sections/Contact.jsx'
import './pages.css'

const { settings, services } = content

function useClock(tz) {
  const fmt = () => new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: tz }).format(new Date()).replaceAll('.', ':')
  const [now, setNow] = useState(fmt)
  useEffect(() => {
    const id = setInterval(() => setNow(fmt()), 15000)
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
 * formulir singkat yang menyusun email atau pesan WhatsApp. Tidak ada server: tombol
 * kirim hanya membuka aplikasi email / WhatsApp pengunjung dengan pesan yang sudah terisi.
 */
export default function ContactPage({ lang, ui }) {
  const root = useRef(null)
  const send = useRef(null)
  const msg = useRef(null)
  const [nudge, setNudge] = useState(false)
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
  const ready = form.message.trim().length > 0
  const wa = ready ? `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(`${subject}\n\n${body}`)}` : `https://wa.me/${settings.whatsapp}`
  const submit = (e) => {
    e.preventDefault()
    if (ready) { window.location.href = mailto; return }
    setNudge(true)
    msg.current?.focus()
  }

  const copy = async () => {
    try { await navigator.clipboard.writeText(settings.email); setCopied(true); setTimeout(() => setCopied(false), 1800) } catch { /* clipboard diblokir */ }
  }

  useEffect(() => {
    if (prefersReduced()) return
    const ctx = gsap.context(() => {
      gsap.from('.ct-char', { yPercent: 110, rotate: 8, duration: 0.9, ease: 'expo.out', stagger: 0.018, delay: 0.2 })
      gsap.from('.ct-fade', { y: 30, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.07, delay: 0.55 })
      gsap.from('.ct-q, .ct-send', { y: 40, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.07, scrollTrigger: { trigger: '.ct-form', start: 'top 85%' } })
    }, root)
    return () => ctx.revert()
  }, [lang])

  const title = `${t(lang, sec.lead)} ${t(lang, sec.tail)}`
  const words = title.split(' ')

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

        <div className="ct-intro">
          <div className="ct-me ct-fade">
            <Avatar size={64} />
            <p className="ct-lede">{t(lang, sec.intro)}</p>
          </div>
          <dl className="ct-details ct-fade">
            <div>
              <dt>{c.details}</dt>
              <dd>
                <a className="ct-mail" href={`mailto:${settings.email}`}>{settings.email}</a>
                <span className="ct-links">
                  <button type="button" className="ct-chip" onClick={copy} aria-live="polite">
                    <Icon name={copied ? 'check' : 'copy'} /> {copied ? c.copied : c.copy}
                  </button>
                  <a className="ct-chip" href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer">WhatsApp <Icon name="external" /></a>
                  {settings.links.github && <a className="ct-chip" href={settings.links.github} target="_blank" rel="noreferrer">GitHub <Icon name="external" /></a>}
                </span>
              </dd>
            </div>
            <div>
              <dt>{c.where}</dt>
              <dd className="ct-where">{settings.location} <span aria-hidden="true">·</span> <time>{time} WIB</time></dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="ct-body" data-theme="dark">
        <header className="ct-body-head">
          <h2>{c.formTitle}</h2>
          <p>{c.note}</p>
        </header>
        <form className="ct-form" onSubmit={submit} noValidate>
          <div className="ct-row">
            <label className="ct-q">
              <span className="ct-ask">{c.qName}</span>
              <input value={form.name} onChange={set('name')} placeholder={c.phName} autoComplete="name" />
            </label>
            <label className="ct-q">
              <span className="ct-ask">{c.qEmail}</span>
              <input type="email" value={form.email} onChange={set('email')} placeholder={c.phEmail} autoComplete="email" />
            </label>
          </div>
          <fieldset className="ct-q">
            <legend className="ct-ask">{c.qTopics}</legend>
            <div className="ct-chips">
              {options.map((o) => (
                <button key={o} type="button" className={form.topics.includes(o) ? 'on' : ''} aria-pressed={form.topics.includes(o)} onClick={() => toggle(o)}>{o}</button>
              ))}
            </div>
          </fieldset>
          <label className="ct-q">
            <span className="ct-ask">{c.qMessage}</span>
            <textarea ref={msg} value={form.message} onChange={(e) => { set('message')(e); setNudge(false) }} placeholder={c.phMessage} rows={5} aria-describedby="ct-hint" />
          </label>

          <div className="ct-send">
            <button ref={send} type="submit" className="ct-send-btn">
              <span>{c.sendMail}</span>
              <Icon name="right" />
            </button>
            <div className="ct-send-alt">
              <a className="ct-chip" href={wa} target="_blank" rel="noreferrer">{c.sendWa} <Icon name="external" /></a>
              <p id="ct-hint" className={nudge ? 'warn' : ''} aria-live="polite">{nudge ? c.needMessage : ''}</p>
            </div>
          </div>
        </form>
      </section>

      <footer className="ct-foot">
        <FootBar ui={ui} />
        <Wordmark />
      </footer>
    </div>
  )
}
