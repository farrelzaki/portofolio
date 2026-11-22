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

/** Transisi masuk gelap + cincin kartu proyek di sekitar judul GitHub. */
export default function Ring({ lang, ui }) {
  const root = useRef(null)
  const ring = useRef(null)
  const sec = settings.sections.ring

  useEffect(() => {
    if (prefersReduced()) return
    const ctx = gsap.context(() => {
      // --k (jarak dari pusat) di elemen orbit; skala & opacity di gambar agar transform orbit tetap utuh.
      const items = gsap.utils.toArray('.ring-item')
      const imgs = gsap.utils.toArray('.ring-item img')
      gsap.set('.ring-dark', { clipPath: 'circle(0% at 50% 50%)' })
      gsap.set(items, { '--k': 0 })
      gsap.set(imgs, { opacity: 0, scale: 0.3 })
      gsap.set('.ring-link', { opacity: 0, y: 40 })
      // Di-pin: (1) lingkaran gelap melebar dari tengah layar, (2) kartu proyek berputar keluar dari
      // tengah ke orbitnya, (3) judul muncul, (4) cincin terus berputar pelan mengikuti gulir.
      gsap.timeline({
        scrollTrigger: {
          trigger: root.current, start: 'top top', end: '+=230%', scrub: 0.8, pin: true, anticipatePin: 1,
          // Tema kerangka (nama, tombol, jam) ikut berganti saat lingkaran gelap sudah menutupi layar.
          onUpdate: (self) => { root.current.dataset.theme = self.progress > 0.18 ? 'dark' : 'light' },
          onLeaveBack: () => { root.current.dataset.theme = 'light' },
        },
      })
        .to('.ring-dark', { clipPath: 'circle(75% at 50% 50%)', ease: 'power2.in', duration: 1 })
        .fromTo(ring.current, { rotate: -200 }, { rotate: 0, ease: 'power3.out', duration: 1.3 }, 0.85)
        .to(items, { '--k': 1, ease: 'power3.out', duration: 1, stagger: 0.025 }, 0.85)
        .to(imgs, { opacity: 1, scale: 1, ease: 'power3.out', duration: 0.8, stagger: 0.025 }, 0.85)
        .to('.ring-link', { opacity: 1, y: 0, ease: 'power2.out', duration: 0.45 }, 1.9)
        .to(ring.current, { rotate: 60, ease: 'none', duration: 1.2 }, 2.15)
    }, root)
    return () => ctx.revert()
  }, [])

  const href = settings.links.github || `mailto:${settings.email}`

  return (
    <section ref={root} className="ring" data-theme={prefersReduced() ? 'dark' : 'light'}>
      <div className="ring-dark" aria-hidden="true" />
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
