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
      const fan = root.current.querySelector('.fan')
      const cards = gsap.utils.toArray('.acard')
      const mid = (n - 1) / 2
      // Jarak tiap kartu ke titik tengah kipas (px), dihitung ulang saat ukuran layar berubah.
      const toCenter = (el) => {
        const f = fan.getBoundingClientRect()
        const r = el.getBoundingClientRect()
        const cur = gsap.getProperty(el, 'x')
        return f.left + f.width / 2 - (r.left - cur + r.width / 2)
      }
      cards.forEach((c, i) => {
        const o = i - mid
        gsap.fromTo(c,
          { x: () => toCenter(c) + o * 26, rotate: o * 6, y: Math.abs(o) * 14 },
          {
            x: 0, rotate: o * 2.2, y: Math.abs(o) * 8, ease: 'power2.inOut', immediateRender: true,
            scrollTrigger: { trigger: fan, start: 'top 80%', end: 'center 50%', scrub: 0.8, invalidateOnRefresh: true },
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
