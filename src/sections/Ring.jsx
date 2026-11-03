import { useEffect, useRef } from 'react'
import { content, t } from '../content/index.js'
import { gsap, prefersReduced } from '../lib/motion.js'
import TwoTone from '../components/TwoTone.jsx'

const { settings, projects, achievements } = content
const ITEMS = [
  ...projects.map((p) => ({ src: p.cover, label: p.name })),
  ...achievements.map((a) => ({ src: a.image, label: '' })),
  ...projects.flatMap((p) => p.gallery.map((g) => ({ src: g, label: p.name }))),
].slice(0, 12)

/** Cincin kartu yang berputar mengikuti scroll di sekitar judul raksasa (section gelap). */
export default function Ring({ lang, ui }) {
  const root = useRef(null)
  const ring = useRef(null)
  const sec = settings.sections.ring

  useEffect(() => {
    if (prefersReduced()) return
    const ctx = gsap.context(() => {
      gsap.fromTo(ring.current, { rotate: -40 }, {
        rotate: 140, ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
      })
      gsap.from('.ring-item', {
        scale: 0.4, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.04,
        scrollTrigger: { trigger: root.current, start: 'top 70%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  const href = settings.links.github || `mailto:${settings.email}`

  return (
    <section ref={root} className="ring" data-theme="dark">
      <div ref={ring} className="ring-track" aria-hidden="true">
        {ITEMS.map((it, i) => (
          <div key={i} className="ring-item" style={{ '--a': `${(360 / ITEMS.length) * i}deg` }}>
            <img src={it.src} alt="" loading="lazy" />
          </div>
        ))}
      </div>
      <a className="ring-link" href={href} target="_blank" rel="noreferrer" data-cursor={ui.seeCode}>
        <TwoTone as="span" className="ring-title" lead={t(lang, sec.lead)} tail={t(lang, sec.tail)} />
      </a>
    </section>
  )
}
