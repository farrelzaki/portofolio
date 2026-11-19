import { useEffect, useRef } from 'react'
import { content, t } from '../content/index.js'
import { gsap, prefersReduced, useMedia } from '../lib/motion.js'
import { Link } from '../lib/router.jsx'
import './pages.css'

const { achievements, settings } = content
const SLICES = 7
const years = [...new Set(achievements.map((a) => a.date.slice(0, 4)))].sort()
const STATS = [
  { n: achievements.length, key: 'certificates' },
  { n: achievements.filter((a) => a.highlight).length, key: 'highlights' },
  { n: years.length, key: 'years', note: years.length > 1 ? `${years[0]}–${years.at(-1)}` : years[0] },
]

/**
 * Halaman Prestasi sebagai ruang pameran gelap: statistik menghitung naik, lalu dinding
 * sertifikat bergeser horizontal saat digulir. Tiap bingkai terbuka lewat potongan strip
 * vertikal (ref. aristidebenoist.com) dan disorot lampu dari atas.
 */
export default function AwardsPage({ lang, ui }) {
  const root = useRef(null)
  const track = useRef(null)
  const wall = useRef(null)
  const wide = useMedia('(min-width: 900px)')
  const sec = settings.sections.achievements

  useEffect(() => {
    if (prefersReduced()) return
    const ctx = gsap.context(() => {
      gsap.from('.aw-hero .aw-fade', { y: 30, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.07, delay: 0.25 })
      gsap.utils.toArray('.aw-stat b').forEach((el) => {
        const to = Number(el.dataset.n)
        const o = { v: 0 }
        gsap.to(o, { v: to, duration: 1.6, ease: 'power3.out', delay: 0.5, onUpdate: () => { el.textContent = String(Math.round(o.v)).padStart(2, '0') } })
      })

      const reveal = (frame, extra = {}) => {
        gsap.to(frame.querySelectorAll('.aw-slice'), {
          scaleY: 0, duration: 1.1, ease: 'expo.inOut', stagger: { each: 0.06, from: 'random' },
          scrollTrigger: { trigger: frame, ...extra },
        })
        gsap.from(frame.querySelector('img'), { scale: 1.2, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: frame, ...extra } })
      }

      if (wide) {
        const dist = () => track.current.scrollWidth - window.innerWidth
        const tween = gsap.to(track.current, {
          x: () => -dist(), ease: 'none',
          scrollTrigger: { trigger: wall.current, start: 'top top', end: () => `+=${dist()}`, scrub: 0.8, pin: true, anticipatePin: 1, invalidateOnRefresh: true },
        })
        gsap.utils.toArray('.aw-frame').forEach((f) => {
          reveal(f, { containerAnimation: tween, start: 'left 85%' })
          // Bingkai sedikit berayun saat lewat tengah layar.
          gsap.fromTo(f, { rotate: 2.5 }, { rotate: -2.5, ease: 'none', scrollTrigger: { trigger: f, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } })
        })
      } else {
        gsap.utils.toArray('.aw-frame').forEach((f) => reveal(f, { start: 'top 80%' }))
      }
    }, root)
    return () => ctx.revert()
  }, [wide, lang])

  return (
    <div ref={root} className="aw-page" data-theme="dark">
      <section className="aw-hero" data-theme="dark">
        <span className="mono aw-fade">(03) {ui.nav.achievements}</span>
        <h1 className="aw-title aw-fade">{t(lang, sec.lead)} <em>{t(lang, sec.tail)}</em></h1>
        <dl className="aw-stats aw-fade">
          {STATS.map((s) => (
            <div key={s.key} className="aw-stat">
              <b data-n={s.n}>{String(s.n).padStart(2, '0')}</b>
              <dt className="mono">{ui.awardStats[s.key]}{s.note ? ` · ${s.note}` : ''}</dt>
            </div>
          ))}
        </dl>
      </section>

      <section ref={wall} className="aw-wall" data-theme="dark">
        <div ref={track} className="aw-track">
          <p className="aw-intro mono" aria-hidden="true">{ui.scrollSide} →</p>
          {achievements.map((a, i) => (
            <Link key={a.id} to={`/prestasi/${a.id}`} className="aw-frame" data-cursor={ui.caseStudy} style={{ '--i': i }}>
              <span className="aw-light" aria-hidden="true" />
              <span className="aw-mat">
                <img src={a.image} alt={t(lang, a.title)} loading="lazy" />
                <span className="aw-slices" aria-hidden="true">
                  {Array.from({ length: SLICES }, (_, k) => <i key={k} className="aw-slice" />)}
                </span>
              </span>
              <span className="aw-plaque">
                <span className="mono">{String(i + 1).padStart(2, '0')} · {a.date.slice(0, 4)}{a.highlight ? ` · ${ui.highlight}` : ''}</span>
                <strong>{t(lang, a.title)}</strong>
                <span>{t(lang, a.issuer)}</span>
              </span>
            </Link>
          ))}
          <span className="aw-end mono" aria-hidden="true">{ui.moreSoon}</span>
        </div>
      </section>
    </div>
  )
}
