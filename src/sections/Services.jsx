import { useEffect, useRef } from 'react'
import { content, t } from '../content/index.js'
import { gsap, prefersReduced, useMedia } from '../lib/motion.js'
import TwoTone from '../components/TwoTone.jsx'

const { settings, services, projects } = content
const byId = Object.fromEntries(projects.map((p) => [p.id, p]))
const TONES = ['blue', 'sky', 'ink', 'paper']

/**
 * Tumpukan kartu warna. Desktop: section di-pin, kartu depan terbang ke atas sambil
 * miring (rotateX) dan kartu berikutnya naik dari belakang. Ponsel/reduced motion:
 * kartu bertumpuk dengan position: sticky biasa.
 */
export default function Services({ lang, ui, onOpen }) {
  const root = useRef(null)
  const stage = useRef(null)
  const wide = useMedia('(min-width: 900px)')
  const sec = settings.sections.services

  useEffect(() => {
    if (!wide || prefersReduced()) return
    const ctx = gsap.context(() => {
      const tiles = gsap.utils.toArray('.tile')
      const n = tiles.length
      tiles.forEach((tile, i) => {
        gsap.set(tile, { zIndex: n - i, transformPerspective: 1400, transformOrigin: '50% 100%' })
        if (i > 0) gsap.set(tile, { yPercent: 6 * i, z: -40 * i, rotateX: 2 * i, scale: 1 - 0.035 * i })
      })
      const tl = gsap.timeline({
        scrollTrigger: { trigger: stage.current, start: 'top top', end: () => `+=${window.innerHeight * (n - 1) * 0.9}`, scrub: 0.6, pin: true, anticipatePin: 1 },
      })
      tiles.forEach((tile, i) => {
        if (i === n - 1) return
        tl.to(tile, { yPercent: -125, rotateX: 18, ease: 'power2.in', duration: 1 }, i)
        tiles.slice(i + 1).forEach((next, k) => {
          tl.to(next, { yPercent: 6 * k, z: -40 * k, rotateX: 2 * k, scale: 1 - 0.035 * k, ease: 'power2.out', duration: 1 }, i)
        })
      })
    }, root)
    return () => ctx.revert()
  }, [wide, lang])

  return (
    <section ref={root} className="services" id="services" data-theme="light">
      <header className="sec-head center">
        <TwoTone as="h2" className="small" lead={t(lang, sec.lead)} tail={t(lang, sec.tail)} />
      </header>
      <div ref={stage} className="tiles-stage">
        <div className="tiles">
          {services.map((s, i) => (
            <article key={s.id} className={`tile tone-${TONES[i % TONES.length]}`}>
              <div className="tile-top">
                <h3>{t(lang, s.title)}</h3>
                <span className="tile-no mono">({String(i + 1).padStart(2, '0')})</span>
              </div>
              <p className="tile-text">{t(lang, s.description)}</p>
              <div className="tile-bottom">
                <ul className="chips">{s.tags.map((x) => <li key={x}>{x}</li>)}</ul>
                <div className="tile-projects">
                  <span className="mono">{ui.related}</span>
                  <div>
                    {s.projects.map((pid) => byId[pid] && (
                      <button key={pid} type="button" onClick={() => onOpen(pid)} data-cursor={ui.viewProject} aria-label={`${ui.openProject}: ${byId[pid].name}`}>
                        <img src={byId[pid].cover} alt="" loading="lazy" />
                        <span>{byId[pid].name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
