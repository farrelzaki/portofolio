import { useEffect, useRef, useState } from 'react'
import { content, t } from '../content/index.js'
import { finePointer, gsap, prefersReduced } from '../lib/motion.js'
import { useCardReveal } from '../lib/cards.js'
import { Link, navigate } from '../lib/router.jsx'
import PageHead from '../components/PageHead.jsx'
import Hero from '../sections/Hero.jsx'
import Showreel from '../sections/Showreel.jsx'
import Work, { Card } from '../sections/Work.jsx'
import Ring from '../sections/Ring.jsx'
import Services from '../sections/Services.jsx'
import Achievements from '../sections/Achievements.jsx'
import Stack from '../sections/Stack.jsx'
import Journey from '../sections/Journey.jsx'
import Contact from '../sections/Contact.jsx'

const { settings, projects, achievements, experiences, stack, services } = content
const sec = settings.sections

/** Beranda: ringkasan semua bagian, masing-masing punya tautan ke halaman lengkapnya. */
export function HomePage({ lang, ui, onOpen }) {
  return (
    <>
      <Hero lang={lang} ui={ui} />
      <Showreel lang={lang} ui={ui} />
      <Work lang={lang} ui={ui} onOpen={onOpen} />
      <Ring lang={lang} ui={ui} />
      <Services lang={lang} ui={ui} onOpen={onOpen} />
      <Achievements lang={lang} ui={ui} />
      <Stack lang={lang} />
      <Journey lang={lang} ui={ui} />
    </>
  )
}

/** Gambar pratinjau yang mengikuti kursor di tampilan daftar (pointer halus saja). */
function useFollow(ref) {
  useEffect(() => {
    const el = ref.current
    if (!el || !finePointer() || prefersReduced()) return
    const x = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' })
    const y = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' })
    const on = (e) => { x(e.clientX); y(e.clientY) }
    window.addEventListener('pointermove', on)
    return () => window.removeEventListener('pointermove', on)
  }, [ref])
}

/** Halaman Projek: semua projek, tampilan grid atau daftar. /projek/:id membuka panel detail. */
export function WorkPage({ lang, ui }) {
  const root = useRef(null)
  const preview = useRef(null)
  const [view, setView] = useState('grid')
  const [hover, setHover] = useState(null)
  useCardReveal(root, lang, view)
  useFollow(preview)
  const open = (id) => navigate(`/projek/${id}`)

  useEffect(() => {
    if (view !== 'list' || prefersReduced()) return
    const tw = gsap.from(root.current.querySelectorAll('.prow'), { y: 40, opacity: 0, duration: 0.8, ease: 'expo.out', stagger: 0.05 })
    return () => tw.kill()
  }, [view])

  const [first, ...rest] = projects
  return (
    <section ref={root} className="page page-work" data-theme="light">
      <PageHead index={1} label={ui.nav.work} lead={ui.allWork[0]} tail={ui.allWork[1]} intro={t(lang, sec.work.intro)} count={`${projects.length} ${ui.items}`}>
        <div className="seg" role="group" aria-label={ui.nav.work}>
          {['grid', 'list'].map((v) => (
            <button key={v} type="button" className={view === v ? 'on' : ''} aria-pressed={view === v} onClick={() => setView(v)}>{ui[v]}</button>
          ))}
        </div>
      </PageHead>

      {view === 'grid' ? (
        <div className="mosaic">
          {first && <Card p={first} lang={lang} ui={ui} onOpen={open} className="wide" />}
          {rest.map((p) => <Card key={p.id} p={p} lang={lang} ui={ui} onOpen={open} />)}
        </div>
      ) : (
        <ol className="plist" onPointerLeave={() => setHover(null)}>
          {projects.map((p, i) => (
            <li key={p.id} className="prow" style={{ '--accent': p.accent }}>
              <button type="button" onClick={() => open(p.id)} onPointerEnter={() => setHover(p.id)} onFocus={() => setHover(p.id)} data-cursor={ui.viewProject}>
                <span className="mono prow-no">{String(i + 1).padStart(2, '0')}</span>
                <span className="prow-name">{p.name}</span>
                <span className="prow-cat">{t(lang, p.category)}</span>
                <span className="mono prow-year">{p.year}</span>
              </button>
            </li>
          ))}
        </ol>
      )}

      <div ref={preview} className={`ppreview ${view === 'list' && hover ? 'show' : ''}`} aria-hidden="true">
        {projects.map((p) => <img key={p.id} src={p.cover} alt="" className={hover === p.id ? 'on' : ''} loading="lazy" />)}
      </div>
    </section>
  )
}

/** Halaman Keahlian: kartu keahlian + seluruh stack. */
export function ServicesPage({ lang, ui, onOpen }) {
  return (
    <>
      <section className="page" data-theme="light">
        <PageHead index={2} label={ui.nav.services} lead={t(lang, sec.services.lead)} tail={t(lang, sec.services.tail)} count={`${services.length} ${ui.items}`} />
      </section>
      <Services lang={lang} ui={ui} onOpen={onOpen} bare />
      <Stack lang={lang} />
      <section className="page page-stack" data-theme="light">
        <h2 className="mono page-sub">{ui.stack}</h2>
        <ul className="stack-grid">{stack.map((s, i) => <li key={s} style={{ '--i': i }}>{s}</li>)}</ul>
      </section>
    </>
  )
}

/** Halaman Prestasi: semua sertifikat dalam grid. */
export function AchievementsPage({ lang, ui }) {
  const root = useRef(null)
  useEffect(() => {
    if (prefersReduced()) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.agrid .acard').forEach((el, i) => {
        gsap.from(el, { y: 70, rotate: (i % 2 ? 2 : -2), opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 92%' } })
      })
    }, root)
    return () => ctx.revert()
  }, [lang])
  return (
    <section ref={root} className="page" data-theme="light">
      <PageHead index={3} label={ui.nav.achievements} lead={t(lang, sec.achievements.lead)} tail={t(lang, sec.achievements.tail)} count={`${achievements.length} ${ui.items}`} />
      <div className="agrid">
        {achievements.map((a, i) => (
          <figure key={a.id} className={`acard ${i % 2 ? 'alt' : ''}`}>
            <div className="acard-top mono">
              <span>{a.date.slice(0, 4)}</span>
              {a.highlight && <span className="badge">{ui.highlight}</span>}
            </div>
            <div className="acard-img"><img src={a.image} alt={t(lang, a.title)} loading="lazy" /></div>
            <figcaption>
              <strong>{t(lang, a.title)}</strong>
              <span className="mono">{t(lang, a.issuer)}</span>
              {t(lang, a.description) && <p>{t(lang, a.description)}</p>}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

/** Halaman Pengalaman: linimasa pendidikan & pengalaman. */
export function JourneyPage({ lang, ui }) {
  return (
    <>
      <section className="page" data-theme="light">
        <PageHead index={4} label={ui.nav.journey} lead={t(lang, sec.journey.lead)} tail={t(lang, sec.journey.tail)} count={`${experiences.length} ${ui.items}`} />
      </section>
      <Journey lang={lang} ui={ui} bare />
    </>
  )
}

export function ContactPage({ lang, ui, setLang }) {
  return <Contact lang={lang} ui={ui} setLang={setLang} asPage />
}

export function NotFoundPage({ ui }) {
  return (
    <section className="page page-404" data-theme="light">
      <PageHead index={404} label={ui.notFound} lead="404" tail={ui.notFound}>
        <Link to="/" className="pill pill-dark">{ui.backHome}</Link>
      </PageHead>
    </section>
  )
}
