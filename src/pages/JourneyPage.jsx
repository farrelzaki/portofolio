import { useEffect, useRef, useState } from 'react'
import { content, formatMonth, formatPeriod, t } from '../content/index.js'
import { gsap, prefersReduced, useMedia } from '../lib/motion.js'
import { Link } from '../lib/router.jsx'
import Icon from '../components/Icon.jsx'
import './pages.css'

const { experiences, achievements, projects, settings } = content

/**
 * Satu linimasa dari data yang ada: pengalaman (tanggal mulai), prestasi (tanggal),
 * dan projek (tahun). Prestasi yang id-nya sama dengan pengalaman tidak diulang.
 */
function buildTimeline() {
  const expIds = new Set(experiences.map((e) => e.id))
  const items = [
    ...experiences.map((e) => ({ kind: 'experience', date: e.start, id: e.id, title: e.title, sub: e.organization, text: e.description, period: [e.start, e.end], to: `/pengalaman/${e.id}` })),
    ...achievements.filter((a) => !expIds.has(a.id)).map((a) => ({ kind: 'award', date: a.date, id: a.id, title: a.title, sub: a.issuer, text: a.description, to: `/prestasi/${a.id}` })),
    ...projects.filter((p) => p.year).map((p) => ({ kind: 'project', date: p.year, id: p.id, title: { id: p.name, en: p.name }, sub: p.category, text: p.description, to: `/proyek/${p.id}`, accent: p.accent })),
  ]
  // Urut menurut tanggal; entri yang hanya punya tahun ditaruh di akhir tahunnya.
  const key = (d) => (d.length === 4 ? `${d}-13` : d)
  items.sort((a, b) => key(a.date).localeCompare(key(b.date)))
  const years = []
  for (const it of items) {
    const y = it.date.slice(0, 4)
    if (years.at(-1)?.year !== y) years.push({ year: y, items: [] })
    years.at(-1).items.push(it)
  }
  return years
}
const YEARS = buildTimeline()

/** Angka tahun 4 digit yang bergulir seperti odometer (ref. penghitung lusion.co). */
function Odometer({ value }) {
  return (
    <span className="jo-odo" aria-label={value}>
      {value.split('').map((d, i) => (
        <span key={i} className="jo-digit" aria-hidden="true">
          <span className="jo-reel" style={{ transform: `translateY(${-Number(d) * 10}%)`, transitionDelay: `${i * 70}ms` }}>
            {'0123456789'.split('').map((k) => <span key={k}>{k}</span>)}
          </span>
        </span>
      ))}
    </span>
  )
}

export default function JourneyPage({ lang, ui }) {
  const root = useRef(null)
  const [year, setYear] = useState(YEARS[0]?.year ?? '2024')
  const wide = useMedia('(min-width: 900px)')
  const sec = settings.sections.journey

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.jo-year').forEach((el) => {
        gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 55%', end: 'bottom 55%', onToggle: (s) => s.isActive && setYear(el.dataset.year) } })
      })
      if (prefersReduced()) return
      gsap.from('.jo-hero .jo-fade', { y: 30, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.07, delay: 0.25 })
      gsap.fromTo('.jo-line i', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.jo-body', start: 'top 55%', end: 'bottom 55%', scrub: true } })
      gsap.utils.toArray('.jo-item').forEach((el) => {
        gsap.from(el, { x: 60, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 85%' } })
        gsap.from(el.querySelector('.jo-dot'), { scale: 0, duration: 0.6, ease: 'back.out(2)', scrollTrigger: { trigger: el, start: 'top 70%' } })
      })
    }, root)
    return () => ctx.revert()
  }, [lang, wide])

  const kindLabel = { experience: ui.nav.journey, award: ui.competition, project: ui.nav.work }
  const last = experiences.reduce((m, e) => (e.end > m ? e.end : m), '')

  return (
    <div ref={root} className="jo-page" data-theme="light">
      <section className="jo-hero" data-theme="light">
        <h1 className="jo-title jo-fade">{t(lang, sec.lead)}<br /><em>{t(lang, sec.tail)}</em></h1>
        <p className="lede jo-fade">{YEARS[0]?.year}–{last.slice(0, 4)}</p>
      </section>

      <div className="jo-body">
        <aside className="jo-side" aria-hidden="true">
          <div className="jo-sticky">
            <Odometer value={year} />
          </div>
        </aside>
        <div className="jo-line" aria-hidden="true"><i /></div>
        <ol className="jo-years">
          {YEARS.map((y) => (
            <li key={y.year} className="jo-year" data-year={y.year}>
              <h2 className="jo-year-label">{y.year}</h2>
              <ol>
                {y.items.map((it) => {
                  const inner = (
                    <>
                      <span className="jo-dot" aria-hidden="true" />
                      <span className="jo-meta">
                        <span className={`jo-kind k-${it.kind}`}>{kindLabel[it.kind]}</span>
                        <span>{it.period ? formatPeriod(lang, ...it.period) : (it.date.length > 4 ? formatMonth(lang, it.date) : it.date)}</span>
                      </span>
                      <strong>{t(lang, it.title)}</strong>
                      <span className="jo-sub">{typeof it.sub === 'string' ? it.sub : t(lang, it.sub)}</span>
                      {t(lang, it.text) && <span className="jo-text">{t(lang, it.text)}</span>}
                      {it.to && <span className="jo-go">{it.kind === 'project' ? ui.caseStudy : it.kind === 'experience' ? ui.detail : ui.certificate} <Icon name="right" /></span>}
                    </>
                  )
                  return (
                    <li key={`${it.kind}-${it.id}`} className="jo-item" style={{ '--accent': it.accent }}>
                      {it.to ? <Link to={it.to} className="jo-card">{inner}</Link> : <div className="jo-card">{inner}</div>}
                    </li>
                  )
                })}
              </ol>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
