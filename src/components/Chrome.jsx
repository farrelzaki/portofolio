import { useEffect, useRef, useState } from 'react'
import { content, t } from '../content/index.js'
import { finePointer, useLenis } from '../lib/motion.js'
import { Link, PAGES, pathOf } from '../lib/router.jsx'

const { settings, projects, services, stack } = content

/* Tema (terang/gelap) section yang sedang berada di bawah titik y tertentu. */
function themeAt(y) {
  const els = document.elementsFromPoint(window.innerWidth / 2, y)
  for (const el of els) {
    const s = el.closest('[data-theme]')
    if (s) return s.dataset.theme
  }
  return 'light'
}

function useChromeState(page) {
  const [state, setState] = useState({ top: 'light', mid: 'light', bottom: 'light', progress: 0, pastHero: false, nearEnd: false })
  useEffect(() => {
    let raf = 0
    const run = () => {
      raf = 0
      const h = window.innerHeight
      const max = document.documentElement.scrollHeight - h
      const footer = document.getElementById('contact')
      setState({
        top: themeAt(36),
        mid: themeAt(h / 2),
        bottom: themeAt(h - 30),
        progress: max > 0 ? window.scrollY / max : 0,
        pastHero: window.scrollY > h * 0.85,
        nearEnd: footer ? footer.getBoundingClientRect().top < h * 0.8 : false,
      })
    }
    const on = () => { if (!raf) raf = requestAnimationFrame(run) }
    run()
    // Halaman baru: hitung ulang setelah transisi selesai menggambar.
    const late = setTimeout(run, 900)
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => { clearTimeout(late); window.removeEventListener('scroll', on); window.removeEventListener('resize', on) }
  }, [page])
  return state
}

/** true saat pengguna sedang menggulir ke bawah; kembali false setelah berhenti sebentar atau menggulir ke atas. */
function useScrollingDown(idle = 900) {
  const [down, setDown] = useState(false)
  useEffect(() => {
    let lastY = window.scrollY
    let timer = 0
    const on = () => {
      const y = window.scrollY
      if (y > lastY + 2) setDown(true)
      else if (y < lastY - 2) setDown(false)
      lastY = y
      clearTimeout(timer)
      timer = setTimeout(() => setDown(false), idle)
    }
    window.addEventListener('scroll', on, { passive: true })
    return () => { window.removeEventListener('scroll', on); clearTimeout(timer) }
  }, [idle])
  return down
}

function useClock(timezone) {
  const fmt = () => new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: timezone }).format(new Date()).replace('.', ':')
  const [time, setTime] = useState(fmt)
  useEffect(() => {
    const id = setInterval(() => setTime(fmt()), 15000)
    return () => clearInterval(id)
  })
  return time
}

const ICONS = {
  home: <path d="M4 11l8-7 8 7M6 9.5V20h12V9.5M10 20v-5h4v5" />,
  work: <path d="M4 7h16v12H4zM9 7V5h6v2" />,
  services: <path d="M8 9l-4 3 4 3M16 9l4 3-4 3M13.5 6l-3 12" />,
  achievements: <path d="M8 4h8v5a4 4 0 0 1-8 0zM12 13v4M8 20h8M16 6h3a3 3 0 0 1-3 3M8 6H5a3 3 0 0 0 3 3" />,
  journey: <path d="M4 18L12 6l8 12M8 12h8" />,
  contact: <path d="M4 6h16v12H4zM4 7l8 6 8-6" />,
}

function Icon({ name }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[name]}
    </svg>
  )
}

export function Avatar({ size = 30 }) {
  return settings.photo
    ? <img className="avatar" src={settings.photo} alt="" style={{ width: size, height: size }} />
    : <span className="avatar avatar-initials" style={{ width: size, height: size }} aria-hidden="true">FZ</span>
}

/** Panel gelap yang terbuka saat ikon Projek/Keahlian di dock di-hover (meniru brandappart.com). */
function Peek({ kind, lang, ui, onPick }) {
  if (kind === 'work') {
    return (
      <>
        <span className="peek-label mono">{ui.nav.work}</span>
        <ul className="peek-links">
          {projects.map((p, i) => (
            <li key={p.id} style={{ '--i': i }}><Link to={`/projek/${p.id}`} onClick={onPick}>{p.name}</Link></li>
          ))}
          <li style={{ '--i': projects.length }}><Link to="/projek" onClick={onPick} className="peek-all">{ui.seeAll.work} →</Link></li>
        </ul>
        <span className="peek-label mono">{ui.featured}</span>
        <div className="peek-cards">
          {projects.slice(0, 2).map((p) => (
            <Link key={p.id} to={`/projek/${p.id}`} onClick={onPick} className="peek-card" style={{ '--accent': p.accent }}>
              <img src={p.cover} alt="" loading="lazy" />
              <span><strong>{p.name}</strong><em className="mono">{p.year} · {t(lang, p.category)}</em></span>
            </Link>
          ))}
        </div>
      </>
    )
  }
  return (
    <>
      <span className="peek-label mono">{ui.nav.services}</span>
      <ul className="peek-links long">
        {services.map((x, i) => (
          <li key={x.id} style={{ '--i': i }}><Link to="/keahlian" onClick={onPick}>{t(lang, x.title)}</Link></li>
        ))}
      </ul>
      <span className="peek-label mono">{ui.stack}</span>
      <ul className="peek-chips">{stack.map((x) => <li key={x}>{x}</li>)}</ul>
    </>
  )
}

export default function Chrome({ lang, setLang, ui, menuOpen, setMenuOpen, page }) {
  const lenis = useLenis()
  const s = useChromeState(page)
  const [peek, setPeekState] = useState(null)
  const [peekKind, setPeekKind] = useState('work')
  const setPeek = (k) => { setPeekState(k); if (k) setPeekKind(k) }
  const scrollingDown = useScrollingDown()
  const ctaVisible = s.pastHero && !s.nearEnd && !menuOpen && !scrollingDown
  const hideTop = scrollingDown && s.pastHero && !menuOpen
  const time = useClock(settings.timezone)
  const flyout = useRef(null)
  const toggle = useRef(null)

  const closeAll = () => { setMenuOpen(false); setPeek(null) }

  useEffect(() => {
    if (!peek) return
    const onKey = (e) => { if (e.key === 'Escape') setPeekState(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [peek])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e) => { if (e.key === 'Escape') { setMenuOpen(false); toggle.current?.focus() } }
    window.addEventListener('keydown', onKey)
    flyout.current?.querySelector('a')?.focus({ preventScroll: true })
    lenis?.stop()
    return () => { window.removeEventListener('keydown', onKey); lenis?.start() }
  }, [menuOpen, lenis, setMenuOpen])

  return (
    <>
      <a className="skip" href="#main">{ui.skip}</a>

      <Link to="/" className={`brand chrome-${s.top} ${hideTop ? 'hide' : ''}`} aria-label={`${settings.name}, ${ui.nav.home}`} onClick={closeAll}>
        <span>Farrel</span><span>Zaki</span>
      </Link>

      <Link to="/kontak" className={`top-cta chrome-${s.top} ${hideTop || page === 'contact' ? 'hide' : ''}`} onClick={closeAll}>
        <span>{ui.contactCta}</span>
      </Link>

      <div className="navzone" onMouseLeave={() => setPeek(null)}>
        <div className={`peek ${peek ? 'open' : ''}`} inert={!peek} data-lenis-prevent>
          <Peek key={peekKind} kind={peekKind} lang={lang} ui={ui} onPick={closeAll} />
        </div>
        <nav className={`dock chrome-${peek ? 'dark' : s.mid}`} aria-label={ui.navigation}>
          {PAGES.map(({ id, path }) => (
            <Link
              key={id} to={path} onClick={closeAll}
              className={`${page === id ? 'on' : ''} ${peek === id ? 'peeking' : ''}`}
              aria-current={page === id ? 'page' : undefined}
              aria-label={ui.nav[id]}
              onMouseEnter={() => finePointer() && setPeek(id === 'work' || id === 'services' ? id : null)}
            >
              <Icon name={id} />
              <span className="dock-tag">{ui.nav[id]}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className={`progress chrome-${s.top}`} aria-hidden="true">
        <span style={{ transform: `translateY(${s.progress * 100}%)` }} />
      </div>

      <button
        ref={toggle}
        type="button"
        className={`menu-toggle chrome-${menuOpen ? 'dark' : s.bottom}`}
        aria-expanded={menuOpen}
        aria-controls="flyout"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? ui.close : ui.menu}
        <span className="dots" aria-hidden="true"><i /><i /><i /></span>
      </button>

      <p className={`clock chrome-${s.bottom}`}>
        {settings.location} <strong>{time}</strong>
      </p>

      <div className={`float-cta ${ctaVisible ? 'show' : ''}`} aria-hidden={!ctaVisible}>
        <span className="float-cta-text">{t(lang, settings.floatingCta)}</span>
        <Link to="/kontak" onClick={closeAll} tabIndex={ctaVisible ? 0 : -1}>
          {ui.contactCta} <Avatar size={26} />
        </Link>
      </div>

      <div className={`scrim ${menuOpen ? 'show' : ''}`} onClick={() => setMenuOpen(false)} aria-hidden="true" />
      <div id="flyout" ref={flyout} className={`flyout ${menuOpen ? 'open' : ''}`} aria-hidden={!menuOpen} data-lenis-prevent>
        <ul className="flyout-links">
          {PAGES.map(({ id, path }, i) => (
            <li key={id} style={{ '--i': i }}>
              <Link to={path} onClick={closeAll} className={page === id ? 'on' : ''} tabIndex={menuOpen ? 0 : -1}>{ui.nav[id]}</Link>
            </li>
          ))}
        </ul>
        <ul className="flyout-small">
          {projects.map((p) => (
            <li key={p.id}><Link to={`${pathOf('work')}/${p.id}`} onClick={closeAll} tabIndex={menuOpen ? 0 : -1}>{p.name}</Link></li>
          ))}
        </ul>
        <div className="flyout-foot">
          <div className="lang" role="group" aria-label={ui.language}>
            {['id', 'en'].map((l) => (
              <button key={l} type="button" className={lang === l ? 'on' : ''} aria-pressed={lang === l} onClick={() => setLang(l)} tabIndex={menuOpen ? 0 : -1}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="flyout-social">
            {settings.links.github && <a href={settings.links.github} target="_blank" rel="noreferrer" tabIndex={menuOpen ? 0 : -1}>GitHub</a>}
            {settings.links.linkedin && <a href={settings.links.linkedin} target="_blank" rel="noreferrer" tabIndex={menuOpen ? 0 : -1}>LinkedIn</a>}
            {settings.links.instagram && <a href={settings.links.instagram} target="_blank" rel="noreferrer" tabIndex={menuOpen ? 0 : -1}>Instagram</a>}
            <a href={`mailto:${settings.email}`} tabIndex={menuOpen ? 0 : -1}>Email</a>
            <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer" tabIndex={menuOpen ? 0 : -1}>WhatsApp</a>
          </div>
        </div>
      </div>
    </>
  )
}
