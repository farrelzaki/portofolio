import { useEffect, useRef } from 'react'
import { content, splitAccent, t } from '../content/index.js'
import { finePointer, gsap, prefersReduced, scrollToTarget, useLenis } from '../lib/motion.js'
import { Avatar } from '../components/Chrome.jsx'

const { settings, projects, achievements, stack } = content

// Gambar untuk jejak kursor: cover projek, galeri, dan sertifikat.
const TRAIL = [
  ...projects.flatMap((p) => [p.cover, ...p.gallery]),
  ...achievements.map((a) => a.image),
].filter(Boolean)

/**
 * Jejak gambar mengikuti kursor (meniru brandappart.com): gambar muncul hanya setelah kursor
 * bergerak cukup jauh DAN cukup lama sejak gambar terakhir, dengan ukuran, sudut, dan posisi
 * acak. Gambar "pop" masuk, diam sebentar, lalu jatuh sedikit sambil mengecil dan memudar.
 */
const MIN_DIST = 170 // px antar kemunculan
const MIN_GAP = 160 // ms antar kemunculan

function useImageTrail(ref) {
  useEffect(() => {
    const root = ref.current
    if (!root || !finePointer() || prefersReduced() || TRAIL.length === 0) return
    const order = gsap.utils.shuffle([...TRAIL])
    const pool = order.map((src) => {
      const img = document.createElement('img')
      img.src = src
      img.alt = ''
      img.decoding = 'async'
      root.appendChild(img)
      gsap.set(img, { xPercent: -50, yPercent: -50, autoAlpha: 0 })
      return img
    })
    let i = 0
    let z = 1
    let last = null
    let lastTime = 0
    const rnd = gsap.utils.random

    const onMove = (e) => {
      const b = root.getBoundingClientRect()
      const x = e.clientX - b.left
      const y = e.clientY - b.top
      if (!last) { last = { x, y }; return }
      const now = performance.now()
      if (Math.hypot(x - last.x, y - last.y) < MIN_DIST || now - lastTime < MIN_GAP) return
      const dx = x - last.x
      const dy = y - last.y
      last = { x, y }
      lastTime = now

      const img = pool[i++ % pool.length]
      const rot = rnd(-38, 38)
      const size = rnd(0.82, 1.18)
      gsap.killTweensOf(img)
      gsap.set(img, {
        x: x + rnd(-40, 40), y: y + rnd(-40, 40), zIndex: z++,
        rotate: rot - Math.sign(dx || 1) * 14, scale: 0.35 * size, autoAlpha: 1,
      })
      gsap.timeline()
        .to(img, { scale: size, rotate: rot, x: `+=${dx * 0.25}`, y: `+=${dy * 0.25}`, duration: 0.55, ease: 'back.out(1.6)' })
        .to(img, { scale: 0, autoAlpha: 0, y: '+=70', rotate: rot + rnd(-25, 25), duration: 0.75, ease: 'power3.in' }, '+=0.55')
    }
    const section = root.closest('section')
    section.addEventListener('pointermove', onMove)
    return () => {
      section.removeEventListener('pointermove', onMove)
      pool.forEach((img) => { gsap.killTweensOf(img); img.remove() })
    }
  }, [ref])
}

export default function Hero({ lang, ui }) {
  const trail = useRef(null)
  const title = useRef(null)
  const lenis = useLenis()
  useImageTrail(trail)

  const [a, accent, b] = splitAccent(t(lang, settings.hero.title), t(lang, settings.hero.accent))

  useEffect(() => {
    if (prefersReduced()) return
    const words = title.current.querySelectorAll('.w > span')
    const tl = gsap.timeline({ delay: 0.15 })
    tl.from(words, { yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: 0.06 })
      .from('.hero-foot > *', { y: 24, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.08 }, '-=0.7')
      .from('.hero-marquee', { opacity: 0, duration: 1 }, '-=0.6')
    return () => tl.kill()
  }, [lang])

  const words = (str, cls = '') => str.split(/(\s+)/).filter(Boolean).map((w, k) =>
    /\s+/.test(w) ? ' ' : <span key={cls + k} className={`w ${cls}`}><span>{w}</span></span>,
  )

  return (
    <section className="hero" id="top" data-theme="light">
      <div className="hero-trail" ref={trail} aria-hidden="true" />
      <h1 ref={title} className="hero-title" aria-label={t(lang, settings.hero.title)}>
        <span aria-hidden="true">
          {words(a)}
          {accent && <>{words(accent, 'accent')}</>}
          {words(b)}
        </span>
      </h1>

      <div className="hero-marquee" aria-label="Tech stack">
        <div className="marquee-track">
          {[...stack, ...stack].map((s, i) => <span key={i} aria-hidden={i >= stack.length}>{s}</span>)}
        </div>
      </div>

      <div className="hero-foot">
        <p className="hero-intro">{t(lang, settings.hero.intro)}</p>
        <a className="hero-cta" href="#contact" onClick={(e) => { e.preventDefault(); scrollToTarget(lenis, '#contact') }}>
          <span>{ui.contactCta}</span>
          <Avatar size={28} />
        </a>
      </div>
    </section>
  )
}
