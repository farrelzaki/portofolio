import { useEffect, useRef } from 'react'
import { content, t } from '../content/index.js'
import { gsap, prefersReduced, useMedia } from '../lib/motion.js'
import TwoTone from '../components/TwoTone.jsx'
import MoreLink from '../components/MoreLink.jsx'
import ScrollCue from '../components/ScrollCue.jsx'

const { settings, services, projects } = content
const byId = Object.fromEntries(projects.map((p) => [p.id, p]))
const TONES = ['blue', 'sky', 'ink', 'paper']

/**
 * Tumpukan kartu warna. Desktop: section di-pin, kartu depan terbang ke atas sambil
 * miring (rotateX) dan kartu berikutnya naik dari belakang. Ponsel/reduced motion:
 * kartu bertumpuk dengan position: sticky biasa.
 */
export default function Services({ lang, ui, onOpen, bare = false }) {
  const root = useRef(null)
  const stage = useRef(null)
  const wide = useMedia('(min-width: 900px)')
  const sec = settings.sections.services
  const animated = wide && !prefersReduced()

  useEffect(() => {
    if (!animated) return
    const ctx = gsap.context(() => {
      const tiles = gsap.utils.toArray('.tile')
      const shades = gsap.utils.toArray('.tile-shade')
      const n = tiles.length
      tiles.forEach((tile, i) => {
        gsap.set(tile, { zIndex: i + 1, transformPerspective: 1600, transformOrigin: '50% 0%' })
      })
      // Saat di-pin, tepi atas stage = tepi atas layar; kartu baru mulai tepat di bawah layar.
      const below = () => window.innerHeight - tiles[0].parentElement.offsetTop + 24
      gsap.set(shades, { opacity: 0 })
      gsap.set('.svc-more', { opacity: 0, y: 30 })
      // Judul "Dari data sampai layar" menunggu di tengah layar; kartu keahlian naik satu per satu
      // menimpanya, lalu tombol "Semua keahlian" muncul di akhir.
      const tl = gsap.timeline({
        scrollTrigger: { trigger: stage.current, start: 'top top', end: () => `+=${window.innerHeight * (n + 0.6)}`, scrub: 0.7, pin: true, anticipatePin: 1, invalidateOnRefresh: true },
      })
      tl.to('.svc-cue', { opacity: 0, duration: 0.25 }, 0)
        .to('.svc-intro .twotone', { scale: 0.92, opacity: 0.4, ease: 'power2.out', duration: 1 }, 0)
      for (let i = 0; i < n; i++) {
        const at = i
        // Kartu baru naik dari bawah dan menutup kartu sebelumnya.
        tl.fromTo(tiles[i],
          { y: below, rotateX: -10 },
          { y: 0, rotateX: 0, ease: 'power3.out', duration: 1, immediateRender: true }, at)
        // Semua kartu di bawahnya mundur sedikit, mengecil, dan meredup.
        for (let k = 0; k < i; k++) {
          const depth = i - k
          tl.to(tiles[k], { yPercent: -3.2 * depth, scale: 1 - 0.05 * depth, ease: 'power3.out', duration: 1 }, at)
          tl.to(shades[k], { opacity: Math.min(0.28 * depth, 0.6), ease: 'none', duration: 1 }, at)
        }
      }
      tl.to('.svc-more', { opacity: 1, y: 0, ease: 'power3.out', duration: 0.5 }, n)
        .to({}, { duration: 0.4 })
    }, root)
    return () => ctx.revert()
  }, [animated, lang])

  return (
    <section ref={root} className={`services ${bare ? 'bare' : ''} ${animated ? 'animated' : ''}`} id="services" data-theme="light">
      <div ref={stage} className="tiles-stage">
        {!bare && (
          <header className="svc-intro">
            <TwoTone as="h2" className="small svc-heading" lead={t(lang, sec.lead)} tail={t(lang, sec.tail)} />
            {animated && <ScrollCue className="svc-cue" label={ui.scrollCue} />}
          </header>
        )}
        <div className="tiles">
          {services.map((s, i) => (
            <article key={s.id} className={`tile tone-${TONES[i % TONES.length]}`}>
              <span className="tile-shade" aria-hidden="true" />
              <div className="tile-top">
                <h3>{t(lang, s.title)}</h3>
              </div>
              <p className="tile-text">{t(lang, s.description)}</p>
              <div className="tile-bottom">
                <ul className="chips">{s.tags.map((x) => <li key={x}>{x}</li>)}</ul>
                <div className="tile-projects">
                  <span className="tile-label">{ui.related}</span>
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
        {!bare && <div className="svc-more"><MoreLink to="/keahlian" label={ui.seeAll.services} /></div>}
      </div>
    </section>
  )
}
