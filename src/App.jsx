import { useEffect, useMemo, useRef, useState } from 'react'
import Cover from './Covers.jsx'
import { profile, stack, projects, services, experience, achievements, ui } from './data.js'

const SECTIONS = ['projects', 'skills', 'experience', 'achievements', 'contact']

/* ---------- hooks ---------- */

function useReveal(dep) {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]')
    if (!('IntersectionObserver' in window)) {
      els.forEach((e) => e.classList.add('in'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target) }
      }),
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )
    els.forEach((e) => io.observe(e))
    return () => io.disconnect()
  }, [dep])
}

function useNavTheme() {
  const [dark, setDark] = useState(false)
  useEffect(() => {
    let raf = 0
    const run = () => {
      raf = 0
      const secs = document.querySelectorAll('[data-nav]')
      let d = false
      secs.forEach((s) => {
        const r = s.getBoundingClientRect()
        if (r.top <= 36 && r.bottom > 36) d = s.dataset.nav === 'dark'
      })
      setDark(d)
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(run) }
    run()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll) }
  }, [])
  return dark
}

/* ---------- navbar ---------- */

function Nav({ lang, setLang, t, dark }) {
  const [open, setOpen] = useState(null) // 'projects' | 'skills' | null
  const [menu, setMenu] = useState(false)
  const closeTimer = useRef(0)

  const enter = (k) => { clearTimeout(closeTimer.current); setOpen(k) }
  const leave = () => { closeTimer.current = setTimeout(() => setOpen(null), 120) }

  useEffect(() => {
    document.body.style.overflow = menu ? 'hidden' : ''
    const onKey = (e) => { if (e.key === 'Escape') { setMenu(false); setOpen(null) } }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menu])

  const go = () => { setMenu(false); setOpen(null) }

  return (
    <header className={`nav ${dark ? 'is-dark' : ''} ${open ? 'has-panel' : ''}`} onMouseLeave={leave}>
      <div className="nav-bar">
        <a className="logo" href="#top" aria-label="Farrel Muhammad Zaki">
          <span className="logo-mark">F</span>
          <span className="logo-text">Farrel Zaki</span>
        </a>

        <nav className="nav-links" aria-label="Utama">
          {SECTIONS.slice(0, 4).map((k) => {
            const hasPanel = k === 'projects' || k === 'skills'
            return (
              <div
                key={k}
                className="nav-item"
                onMouseEnter={() => (hasPanel ? enter(k) : (clearTimeout(closeTimer.current), setOpen(null)))}
                onFocus={() => (hasPanel ? enter(k) : setOpen(null))}
              >
                <a className={`nav-link ${open === k ? 'on' : ''}`} href={`#${k}`} onClick={go}>
                  <span>{t.nav[k]}</span>
                </a>
              </div>
            )
          })}
        </nav>

        <div className="nav-right">
          <div className="lang" role="group" aria-label="Bahasa / Language">
            {['id', 'en'].map((l) => (
              <button key={l} className={lang === l ? 'active' : ''} onClick={() => setLang(l)} aria-pressed={lang === l}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <a className="btn btn-nav" href="#contact" onClick={go}>
            <span>{t.nav.cta}</span>
          </a>
          <button className="menu-btn" onClick={() => setMenu(true)} aria-label={t.nav.menu}>
            <span /><span />
          </button>
        </div>
      </div>

      <div className={`panel ${open ? 'show' : ''}`} onMouseEnter={() => clearTimeout(closeTimer.current)} aria-hidden={!open}>
        {open === 'projects' && (
          <ul className="panel-grid">
            {projects.map((p, i) => (
              <li key={p.id} style={{ '--i': i }}>
                <a href="#projects" onClick={go} tabIndex={open ? 0 : -1}>
                  <strong>{p.name}</strong>
                  <span>{p.cat[lang]}</span>
                </a>
              </li>
            ))}
          </ul>
        )}
        {open === 'skills' && (
          <ul className="panel-grid">
            {services.map((s, i) => (
              <li key={s.key} style={{ '--i': i }}>
                <a href="#skills" onClick={go} tabIndex={open ? 0 : -1}>
                  <strong>{s.title[lang]}</strong>
                  <span>{s.tags.slice(0, 3).join(' · ')}</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={`overlay ${menu ? 'show' : ''}`} aria-hidden={!menu}>
        <button className="overlay-close" onClick={() => setMenu(false)}>{t.nav.close}</button>
        <ul>
          {SECTIONS.map((k, i) => (
            <li key={k} style={{ '--i': i }}>
              <a href={`#${k}`} onClick={go} tabIndex={menu ? 0 : -1}>{t.nav[k]}</a>
            </li>
          ))}
        </ul>
        <div className="lang lang-overlay">
          {['id', 'en'].map((l) => (
            <button key={l} className={lang === l ? 'active' : ''} onClick={() => setLang(l)}>{l.toUpperCase()}</button>
          ))}
        </div>
      </div>
    </header>
  )
}

/* ---------- hero ---------- */

function Hero({ t }) {
  const h = t.hero
  return (
    <section className="hero" id="top" data-nav="light">
      <div className="wrap">
        <h1 className="hero-title" aria-label={`${h.l1} ${h.l2a}${h.l2b}${h.l2c}`}>
          <span className="line"><span style={{ '--d': 0 }}>{h.l1}</span></span>
          <span className="line">
            <span style={{ '--d': 1 }}>
              {h.l2a}<em>{h.l2b}</em>{h.l2c}
            </span>
          </span>
        </h1>

        <div className="hero-row">
          <p className="hero-sub" data-reveal style={{ '--i': 3 }}>{h.sub}</p>
          <div className="hero-actions" data-reveal style={{ '--i': 4 }}>
            <a className="btn btn-ink" href="#projects"><span>{h.cta1}</span></a>
            <a className="btn btn-line" href="#contact"><span>{h.cta2}</span></a>
          </div>
        </div>

        <dl className="stats">
          {h.stats.map(([n, l], i) => (
            <div key={l} data-reveal style={{ '--i': 5 + i }}>
              <dt>{n}</dt>
              <dd>{l}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="strip" aria-hidden="true">
        <div className="strip-track">
          {[...projects, ...projects].map((p, i) => (
            <figure key={i} className="strip-item"><Cover project={p} /></figure>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------- projects ---------- */

function Projects({ lang, t }) {
  const [active, setActive] = useState(0)
  const [hover, setHover] = useState(-1)
  const preview = useRef(null)
  const pos = useRef({ x: 0, y: 0, tx: 0, ty: 0 })
  const raf = useRef(0)

  const fine = useMemo(() => typeof window !== 'undefined' && window.matchMedia?.('(hover: hover) and (pointer: fine)').matches, [])

  useEffect(() => {
    if (!fine) return
    const tick = () => {
      const p = pos.current
      p.x += (p.tx - p.x) * 0.16
      p.y += (p.ty - p.y) * 0.16
      if (preview.current) preview.current.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [fine])

  const onMove = (e) => {
    pos.current.tx = e.clientX + 28
    pos.current.ty = e.clientY - 150
  }

  return (
    <section className="projects" id="projects" data-nav="light">
      <div className="wrap">
        <header className="sec-head" data-reveal>
          <h2>{t.projects.title}</h2>
          <p className="muted">{t.projects.hint}</p>
        </header>

        <ul className="plist" onPointerMove={fine ? onMove : undefined} onPointerLeave={() => setHover(-1)}>
          {projects.map((p, i) => {
            const isOpen = active === i
            return (
              <li
                key={p.id}
                className={`prow ${isOpen ? 'open' : ''}`}
                data-reveal
                style={{ '--i': i }}
                onPointerEnter={() => setHover(i)}
              >
                <button className="prow-head" onClick={() => setActive(isOpen ? -1 : i)} aria-expanded={isOpen}>
                  <span className="prow-no">{String(i + 1).padStart(2, '0')}</span>
                  <span className="prow-name">{p.name}</span>
                  <span className="prow-cat">{p.cat[lang]}</span>
                  <span className="prow-plus" aria-hidden="true" />
                </button>
                <div className="prow-body">
                  <div className="prow-inner">
                    <div className="prow-cover"><Cover project={p} /></div>
                    <div className="prow-text">
                      <p>{p.text[lang]}</p>
                      <ul className="chips" aria-label={t.projects.role}>
                        {p.tags.map((x) => <li key={x}>{x}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      {fine && (
        <div className={`preview ${hover >= 0 && active !== hover ? 'show' : ''}`} ref={preview} aria-hidden="true">
          <div className="preview-card">
            {projects.map((p, i) => (
              <div key={p.id} className={`preview-slide ${hover === i ? 'on' : ''}`}><Cover project={p} /></div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

/* ---------- marquee ---------- */

function Marquee() {
  const items = [...stack, ...stack]
  return (
    <section className="marquee" data-nav="dark" aria-label="Tech stack">
      <div className="marquee-track">
        {items.map((s, i) => (
          <span key={i}>{s}<i aria-hidden="true" /></span>
        ))}
      </div>
    </section>
  )
}

/* ---------- skills ---------- */

function Skills({ lang, t }) {
  return (
    <section className="skills" id="skills" data-nav="dark">
      <div className="wrap">
        <header className="sec-head" data-reveal>
          <h2>{t.skills.title}</h2>
        </header>
        <div className="sgrid">
          {services.map((s, i) => (
            <div key={s.key} data-reveal style={{ '--i': i }}>
              <article className="scell" tabIndex={0}>
                <span className="scell-no">{String(i + 1).padStart(2, '0')}</span>
                <h3>{s.title[lang]}</h3>
                <p>{s.text[lang]}</p>
                <ul className="chips chips-dark">
                  {s.tags.map((x) => <li key={x}>{x}</li>)}
                </ul>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------- experience ---------- */

function Experience({ lang, t }) {
  return (
    <section className="experience" id="experience" data-nav="light">
      <div className="wrap exp-grid">
        <header className="sec-head sticky" data-reveal>
          <h2>{t.experience.title}</h2>
        </header>
        <ol className="exp-list">
          {experience.map((e, i) => (
            <li key={e.title.en} data-reveal style={{ '--i': i }}>
              <time>{e.date}</time>
              <div>
                <h3>{e.title[lang]}</h3>
                <p className="org">{e.org}</p>
                <p>{e.text[lang]}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ---------- achievements ---------- */

function Achievements({ lang, t }) {
  return (
    <section className="achv" id="achievements" data-nav="blue">
      <div className="wrap">
        <header className="sec-head" data-reveal>
          <h2>{t.achievements.title}</h2>
        </header>
        <div className="agrid">
          {achievements.map((a, i) => (
            <figure key={a.title.en} className="acard" data-reveal style={{ '--i': i }}>
              <div className="acard-img">
                <img src={a.image} alt={`Sertifikat: ${a.title[lang]}`} loading="lazy" />
              </div>
              <figcaption>
                <h3>{a.title[lang]}</h3>
                <p className="meta">{a.meta[lang]}</p>
                <p>{a.text[lang]}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------- contact + footer ---------- */

function Contact({ t }) {
  const c = t.contact
  const { links } = profile
  return (
    <section className="contact" id="contact" data-nav="dark">
      <div className="wrap">
        <h2 className="contact-title" data-reveal>{c.title}</h2>
        <p className="contact-sub" data-reveal style={{ '--i': 1 }}>{c.sub}</p>
        <a className="mail" href={`mailto:${profile.email}`} data-reveal style={{ '--i': 2 }}>
          <span className="mail-fill" aria-hidden="true">{profile.email}</span>
          <span className="mail-text">{profile.email}</span>
        </a>
        <div className="contact-actions" data-reveal style={{ '--i': 3 }}>
          <a className="btn btn-blue" href={`mailto:${profile.email}`}><span>{c.email}</span></a>
          <a className="btn btn-ghost" href={`https://wa.me/${profile.whatsapp}`} target="_blank" rel="noreferrer"><span>{c.wa}</span></a>
          {links.linkedin && <a className="btn btn-ghost" href={links.linkedin} target="_blank" rel="noreferrer"><span>LinkedIn</span></a>}
          {links.github && <a className="btn btn-ghost" href={links.github} target="_blank" rel="noreferrer"><span>GitHub</span></a>}
          {links.instagram && <a className="btn btn-ghost" href={links.instagram} target="_blank" rel="noreferrer"><span>Instagram</span></a>}
        </div>
      </div>
    </section>
  )
}

function Footer({ t }) {
  return (
    <footer className="footer" data-nav="dark">
      <div className="wrap foot-row">
        <p>© 2026 {profile.name}. {t.footer.rights}</p>
        <a href="#top">{t.footer.top}</a>
      </div>
      <p className="foot-name" aria-hidden="true">Farrel Zaki</p>
    </footer>
  )
}

/* ---------- app ---------- */

export default function App() {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem('lang') || 'id' } catch { return 'id' }
  })
  const t = ui[lang]
  const dark = useNavTheme()
  useReveal(lang)

  useEffect(() => {
    document.documentElement.lang = lang
    try { localStorage.setItem('lang', lang) } catch { /* ignore */ }
  }, [lang])

  return (
    <>
      <Nav lang={lang} setLang={setLang} t={t} dark={dark} />
      <main>
        <Hero t={t} />
        <Projects lang={lang} t={t} />
        <Marquee />
        <Skills lang={lang} t={t} />
        <Experience lang={lang} t={t} />
        <Achievements lang={lang} t={t} />
        <Contact t={t} />
      </main>
      <Footer t={t} />
    </>
  )
}
