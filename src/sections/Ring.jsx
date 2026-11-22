import { useEffect, useRef } from 'react'
import { content, t } from '../content/index.js'
import { gsap, prefersReduced } from '../lib/motion.js'
import TwoTone from '../components/TwoTone.jsx'
import Icon from '../components/Icon.jsx'
import ScrollCue from '../components/ScrollCue.jsx'

const { settings, projects } = content
// Hanya gambar proyek (kover + galeri): bagian ini tentang kode, bukan sertifikat.
const ITEMS = [
  ...projects.map((p) => ({ src: p.cover, label: p.name })),
  ...projects.flatMap((p) => p.gallery.map((g) => ({ src: g, label: p.name }))),
].slice(0, 12)

/** Transisi masuk gelap + cincin kartu proyek di sekitar judul GitHub. */
export default function Ring({ lang, ui }) {
  const root = useRef(null)
  const ring = useRef(null)
  const sec = settings.sections.ring
  const next = settings.sections.services

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
      gsap.set('.ring-cue', { opacity: 0 })
      gsap.set('.ring-next', { autoAlpha: 0 })
      // Di-pin: (1) lingkaran gelap melebar dari tengah layar, (2) kartu proyek berputar keluar dari
      // tengah ke orbitnya, (3) judul muncul, (4) cincin berputar pelan, (5) keluar: kartu berputar
      // kembali ke tengah, judul memudar, lingkaran gelap menyusut sampai layar putih lagi.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current, start: 'top top', end: '+=330%', scrub: 0.8, pin: true, anticipatePin: 1,
          // Tema kerangka (nama, tombol, jam) gelap hanya selama lingkaran gelap menutupi layar.
          onUpdate: (self) => {
            const at = self.progress * tl.duration()
            root.current.dataset.theme = at > 0.8 && at < 4.35 ? 'dark' : 'light'
          },
          onLeaveBack: () => { root.current.dataset.theme = 'light' },
          // Disembunyikan langsung (bukan lewat timeline yang ter-scrub) supaya tidak ada salinan
          // judul yang ikut bergeser saat section Keahlian mulai di-pin.
          onLeave: () => gsap.set(root.current, { autoAlpha: 0 }),
          onEnterBack: () => gsap.set(root.current, { autoAlpha: 1 }),
        },
      })
      tl.to('.ring-dark', { clipPath: 'circle(75% at 50% 50%)', ease: 'power2.in', duration: 1 })
        .fromTo(ring.current, { rotate: -200 }, { rotate: 0, ease: 'power3.out', duration: 1.3 }, 0.85)
        .to(items, { '--k': 1, ease: 'power3.out', duration: 1, stagger: 0.025 }, 0.85)
        .to(imgs, { opacity: 1, scale: 1, ease: 'power3.out', duration: 0.8, stagger: 0.025 }, 0.85)
        .to('.ring-link', { opacity: 1, y: 0, ease: 'power2.out', duration: 0.45 }, 1.9)
        .to('.ring-cue', { opacity: 1, ease: 'power2.out', duration: 0.3 }, 2.1)
        .to(ring.current, { rotate: 60, ease: 'none', duration: 1.2 }, 2.15)
        // Keluar.
        .to('.ring-cue', { opacity: 0, duration: 0.2 }, 3.35)
        .to('.ring-link', { opacity: 0, y: -40, scale: 0.94, ease: 'power2.in', duration: 0.45 }, 3.35)
        .to(ring.current, { rotate: 200, ease: 'power2.in', duration: 1 }, 3.35)
        .to(items, { '--k': 0, ease: 'power3.in', duration: 0.9, stagger: { each: 0.02, from: 'end' } }, 3.35)
        .to(imgs, { opacity: 0, scale: 0.3, ease: 'power3.in', duration: 0.8, stagger: { each: 0.02, from: 'end' } }, 3.45)
        // Judul "Dari data sampai layar" baru disiapkan di balik lingkaran gelap yang menutup layar,
        // lalu tersingkap saat lingkaran menyusut. Posisinya sama persis dengan judul asli di
        // section Keahlian (yang ditarik naik satu layar), jadi pergantiannya tidak terlihat.
        .set('.ring-next', { autoAlpha: 1 }, 3.85)
        .to('.ring-dark', { clipPath: 'circle(0% at 50% 50%)', ease: 'power2.inOut', duration: 1 }, 3.9)
        // Jeda agar animasi ter-scrub sudah selesai sebelum pin dilepas.
        .to({}, { duration: 0.6 })
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
        <span className="ring-hint">{ui.ringHint} <Icon name="external" /></span>
      </a>
      <ScrollCue className="ring-cue" label={ui.scrollCue} />
      <div className="ring-next" aria-hidden="true">
        <TwoTone as="span" className="small svc-heading" lead={t(lang, next.lead)} tail={t(lang, next.tail)} />
      </div>
    </section>
  )
}
