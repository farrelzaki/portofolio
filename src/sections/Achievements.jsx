import { useEffect, useRef } from 'react'
import { content, t } from '../content/index.js'
import { gsap, prefersReduced, useMedia } from '../lib/motion.js'
import TwoTone from '../components/TwoTone.jsx'

const { settings, achievements } = content

/** Kartu sertifikat bertumpuk seperti kipas yang menyebar saat di-scroll (desktop). */
export default function Achievements({ lang, ui }) {
  const root = useRef(null)
  const wide = useMedia('(min-width: 900px)')
  const sec = settings.sections.achievements
  const n = achievements.length

  useEffect(() => {
    if (!wide || prefersReduced()) return
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.acard')
      const mid = (n - 1) / 2
      cards.forEach((c, i) => {
        const o = i - mid
        gsap.fromTo(c,
          { xPercent: -o * 78, rotate: o * 7, y: Math.abs(o) * 18 },
          {
            xPercent: 0, rotate: o * 2.5, y: Math.abs(o) * 10, ease: 'none',
            scrollTrigger: { trigger: '.fan', start: 'top 85%', end: 'center 45%', scrub: 0.8 },
          })
      })
    }, root)
    return () => ctx.revert()
  }, [wide, n, lang])

  return (
    <section ref={root} className="achievements" id="achievements" data-theme="light">
      <header className="sec-head left">
        <TwoTone as="h2" className="small" lead={t(lang, sec.lead)} tail={t(lang, sec.tail)} />
      </header>
      <div className="fan">
        {achievements.map((a, i) => (
          <figure key={a.id} className={`acard ${i % 2 ? 'alt' : ''}`} style={{ zIndex: i + 1 }}>
            <div className="acard-top mono">
              <span>{a.date.slice(0, 4)}</span>
              {a.highlight && <span className="badge">{ui.highlight}</span>}
            </div>
            <div className="acard-img"><img src={a.image} alt={`${t(lang, a.title)}`} loading="lazy" /></div>
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
