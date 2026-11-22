import { useEffect, useRef } from 'react'
import { content, t } from '../content/index.js'
import { gsap, prefersReduced, useMedia } from '../lib/motion.js'
import { Link } from '../lib/router.jsx'
import { useTilt } from '../lib/tilt.js'
import './pages.css'

const { achievements, settings } = content
const SLICES = 7

/**
 * Halaman Prestasi sebagai ruang pameran gelap: dinding
 * sertifikat bergeser horizontal saat digulir. Tiap bingkai terbuka lewat potongan strip
 * vertikal (ref. aristidebenoist.com) dan disorot lampu dari atas.
 */
export default function AwardsPage({ lang, ui }) {
  const root = useRef(null)
  const track = useRef(null)
  const wall = useRef(null)
  const wide = useMedia('(min-width: 900px)')
  const sec = settings.sections.achievements
  useTilt(root, '.aw-mat')

  useEffect(() => {
    if (prefersReduced()) return
    const ctx = gsap.context(() => {
      gsap.from('.aw-hero .aw-fade', { y: 30, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.07, delay: 0.25 })

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
        <h1 className="aw-title aw-fade">{t(lang, sec.lead)} <em>{t(lang, sec.tail)}</em></h1>
        <p className="aw-lede aw-fade">{t(lang, sec.intro)}</p>
      </section>

      <section ref={wall} className="aw-wall" data-theme="dark">
        <div ref={track} className="aw-track">
          {achievements.map((a, i) => (
            <Link key={a.id} to={`/prestasi/${a.id}`} className="aw-frame" data-cursor={ui.certificate} style={{ '--i': i }}>
              <span className="aw-light" aria-hidden="true" />
              <span className="aw-mat tilt-card">
                <img src={a.image} alt={t(lang, a.title)} loading="lazy" />
                <span className="aw-slices" aria-hidden="true">
                  {Array.from({ length: SLICES }, (_, k) => <i key={k} className="aw-slice" />)}
                </span>
              </span>
              <span className="aw-plaque">
                <span className="aw-date">{a.date.slice(0, 4)}{a.highlight && <em>{ui.highlight}</em>}</span>
                <strong>{t(lang, a.title)}</strong>
                <span>{t(lang, a.issuer)}</span>
              </span>
            </Link>
          ))}
          <span className="aw-end" aria-hidden="true" />
        </div>
      </section>
    </div>
  )
}
