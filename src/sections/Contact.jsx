import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { content, t } from '../content/index.js'
import { gsap, prefersReduced, useLenis } from '../lib/motion.js'
import { Link, PAGES } from '../lib/router.jsx'
import { Avatar } from '../components/Chrome.jsx'
import Icon from '../components/Icon.jsx'

const { settings, projects } = content

function useClock(tz) {
  const fmt = () => new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: tz }).format(new Date()).replace('.', ':')
  const [now, setNow] = useState(fmt)
  useEffect(() => {
    const id = setInterval(() => setNow(fmt()), 15000)
    return () => clearInterval(id)
  })
  return now
}

/** Wordmark selebar footer: ukuran huruf dihitung agar pas satu baris, huruf naik bergantian saat terlihat. */
export function Wordmark() {
  const box = useRef(null)
  const text = useRef(null)
  useLayoutEffect(() => {
    const fit = () => {
      const el = text.current
      if (!el || !box.current) return
      el.style.fontSize = '100px'
      const w = el.getBoundingClientRect().width
      const cs = getComputedStyle(box.current)
      const room = box.current.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)
      // Sedikit ruang cadangan agar huruf terakhir (dan titik "i") tidak terpotong.
      if (w) el.style.fontSize = `${(100 * room * 0.985) / w}px`
    }
    fit()
    document.fonts?.ready.then(fit)
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])
  useEffect(() => {
    if (prefersReduced()) return
    // Diputar ulang setiap kali wordmark kembali terlihat; disembunyikan lagi saat keluar ke atas.
    const tw = gsap.from(box.current.querySelectorAll('.wm-ch'), {
      yPercent: 100, duration: 1.2, ease: 'expo.out', stagger: 0.035,
      scrollTrigger: { trigger: box.current, start: 'top 98%', toggleActions: 'restart none restart reset' },
    })
    return () => { tw.scrollTrigger?.kill(); tw.kill() }
  }, [])
  return (
    <div ref={box} className="wm" aria-hidden="true">
      <span ref={text} className="wm-text">
        {settings.shortName.split('').map((c, i) => <span key={i} className="wm-ch">{c === ' ' ? ' ' : c}</span>)}
      </span>
    </div>
  )
}

/** Baris paling bawah: hak cipta, kredit, kembali ke atas. Dipakai footer dan halaman Kontak. */
export function FootBar({ ui }) {
  const lenis = useLenis()
  const toTop = (e) => { e.preventDefault(); if (lenis) lenis.scrollTo(0, { duration: 1.4 }); else window.scrollTo({ top: 0 }) }
  return (
    <div className="ft-bar">
      <span>© 2026 {settings.name}</span>
      <span>{ui.builtWith}</span>
      <a href="#main" onClick={toTop} className="ft-top-link">{ui.backToTop} <Icon name="up" /></a>
    </div>
  )
}

/** Footer ringkas untuk halaman selain beranda: ajakan singkat, tautan kontak, baris hak cipta. */
export function FooterLite({ ui }) {
  const links = [
    ['Email', `mailto:${settings.email}`],
    ['WhatsApp', `https://wa.me/${settings.whatsapp}`],
    settings.links.github && ['GitHub', settings.links.github],
  ].filter(Boolean)
  return (
    <footer className="fl" id="contact" data-theme="dark">
      <div className="fl-main">
        <p className="fl-ask">{ui.liteAsk}</p>
        <Link to="/kontak" className="fl-cta">{ui.contactCta} <Icon name="right" /></Link>
        <ul className="fl-links">
          {links.map(([label, href]) => (
            <li key={label}><a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">{label}</a></li>
          ))}
        </ul>
      </div>
      <FootBar ui={ui} />
    </footer>
  )
}

/** Footer lengkap di beranda. */
export default function Contact({ lang, ui, setLang }) {
  const root = useRef(null)
  const time = useClock(settings.timezone)
  const [copied, setCopied] = useState(false)
  const sec = settings.sections.contact

  useEffect(() => {
    if (prefersReduced()) return
    const ctx = gsap.context(() => {
      gsap.from('.ft-line > span', { yPercent: 105, duration: 1.1, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: '.ft-title', start: 'top 88%' } })
    }, root)
    return () => ctx.revert()
  }, [lang])

  const copy = async () => {
    try { await navigator.clipboard.writeText(settings.email); setCopied(true); setTimeout(() => setCopied(false), 1800) } catch { /* clipboard diblokir */ }
  }

  const socials = [
    ['Email', `mailto:${settings.email}`],
    ['WhatsApp', `https://wa.me/${settings.whatsapp}`],
    settings.links.github && ['GitHub', settings.links.github],
    settings.links.linkedin && ['LinkedIn', settings.links.linkedin],
    settings.links.instagram && ['Instagram', settings.links.instagram],
  ].filter(Boolean)

  return (
    <footer ref={root} className="ft" id="contact" data-theme="dark">
      <div className="ft-head">
        <h2 className="ft-title" aria-label={`${t(lang, sec.lead)} ${t(lang, sec.tail)}`}>
          <span className="ft-line" aria-hidden="true"><span>{t(lang, sec.lead)}</span></span>
          <span className="ft-line ft-tail" aria-hidden="true"><span>{t(lang, sec.tail)}</span></span>
        </h2>
        <div className="ft-pitch">
          <p>{t(lang, sec.intro)}</p>
          <div className="ft-actions">
            <Link to="/kontak" className="ft-primary">
              <Avatar size={34} />
              <span>{ui.startChat}</span>
              <Icon name="right" />
            </Link>
            <a className="ft-secondary" href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer">WhatsApp <Icon name="external" /></a>
          </div>
        </div>
      </div>

      <div className="ft-mailrow">
        <a className="ft-mail" href={`mailto:${settings.email}`}>
          <span>{settings.email}</span>
          <i aria-hidden="true"><Icon name="external" /></i>
        </a>
        <button type="button" className="ft-copy" onClick={copy} aria-live="polite">
          <Icon name={copied ? 'check' : 'copy'} />
          <span>{copied ? ui.contactPage.copied : ui.contactPage.copy}</span>
        </button>
      </div>

      <nav className="ft-cols" aria-label={ui.navigation}>
        <div>
          <h3>{ui.navigation}</h3>
          <ul>{PAGES.map(({ id, path }) => <li key={id}><Link to={path}>{ui.nav[id]}</Link></li>)}</ul>
        </div>
        <div>
          <h3>{ui.projects}</h3>
          <ul>{projects.map((p) => <li key={p.id}><Link to={`/proyek/${p.id}`}>{p.name}</Link></li>)}</ul>
        </div>
        <div>
          <h3>{ui.contact}</h3>
          <ul>{socials.map(([label, href]) => <li key={label}><a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">{label}</a></li>)}</ul>
        </div>
        <div>
          <h3>{ui.location}</h3>
          <p>{settings.location}</p>
          <p className="ft-time"><span>{time}</span> WIB</p>
          <div className="lang lang-foot" role="group" aria-label={ui.language}>
            {['id', 'en'].map((l) => (
              <button key={l} type="button" className={lang === l ? 'on' : ''} aria-pressed={lang === l} onClick={() => setLang(l)}>{l.toUpperCase()}</button>
            ))}
          </div>
        </div>
      </nav>

      <FootBar ui={ui} />
      <Wordmark />
    </footer>
  )
}
