import { useEffect, useRef } from 'react'
import { content, splitAccent, t } from '../content/index.js'
import { TECH_ICONS } from '../content/icons.js'
import { finePointer, gsap, prefersReduced, scrollToTarget, useLenis } from '../lib/motion.js'
import { Avatar } from '../components/Chrome.jsx'

const { settings } = content

// Ikon tools untuk popup kursor (urutan & isi diatur di settings.heroIcons).
const ICONS = settings.heroIcons.map((k) => TECH_ICONS[k]).filter(Boolean)

/** Warna terang (mis. kuning JavaScript) butuh glyph gelap agar tetap terbaca. */
function isLight(hex) {
  const n = parseInt(hex.slice(1), 16)
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255]
  return 0.299 * r + 0.587 * g + 0.114 * b > 170
}

function makeTile(icon, i) {
  const el = document.createElement('div')
  // Sebagian kartu putih dengan glyph berwarna merek, sebagian kartu berwarna merek dengan glyph kontras.
  const filled = i % 3 !== 0 && icon.hex !== '#000000' && icon.hex !== '#181717' && icon.hex !== '#0A0A0A'
  const glyph = filled ? (isLight(icon.hex) ? '#0B1220' : '#FFFFFF') : icon.hex
  el.className = `trail-tile ${filled ? 'filled' : ''}`
  if (filled) el.style.background = icon.hex
  el.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="${glyph}" d="${icon.path}"/></svg><span style="color:${filled ? glyph : '#0B1220'}">${icon.title}</span>`
  return el
}

/**
 * Popup ikon tools mengikuti kursor (meniru jejak gantungan kunci brandappart.com), dibuat jarang
 * dan acak: jarak & jeda minimum diacak tiap kali, ada peluang dilewati, maksimal 2 ikon sekaligus,
 * dan tidak pernah muncul di atas atau dekat teks hero.
 */
function useIconTrail(ref, title, foot) {
  useEffect(() => {
    const root = ref.current
    if (!root || !finePointer() || prefersReduced() || ICONS.length === 0) return
    const rnd = gsap.utils.random
    const pool = gsap.utils.shuffle(ICONS.map((icon, i) => {
      const el = makeTile(icon, i)
      root.appendChild(el)
      gsap.set(el, { xPercent: -50, yPercent: -50, autoAlpha: 0 })
      return el
    }))
    let i = 0
    let z = 1
    let alive = 0
    let last = null
    let lastTime = 0
    let needDist = rnd(320, 560)
    let needGap = rnd(700, 1400)

    // Zona larangan: kotak teks hero diperbesar setengah ukuran ikon + jarak aman.
    const textRefs = [title, foot]
    const blocked = (x, y) => textRefs.some((r) => {
      const els = r.current ? [r.current] : []
      return els.some((el) => {
        const b = el.getBoundingClientRect()
        const pad = 110
        return x > b.left - pad && x < b.right + pad && y > b.top - pad && y < b.bottom + pad
      })
    })

    const onMove = (e) => {
      const now = performance.now()
      if (!last) { last = { x: e.clientX, y: e.clientY }; return }
      if (Math.hypot(e.clientX - last.x, e.clientY - last.y) < needDist || now - lastTime < needGap) return
      const dx = e.clientX - last.x
      const dy = e.clientY - last.y
      last = { x: e.clientX, y: e.clientY }
      lastTime = now
      needDist = rnd(320, 560)
      needGap = rnd(700, 1400)
      if (alive >= 2 || Math.random() < 0.35 || blocked(e.clientX, e.clientY)) return

      const b = root.getBoundingClientRect()
      // Jaga ikon tetap utuh di dalam layar (tidak terpotong tepi atau tertutup kerangka tetap).
      const m = 110
      const x = gsap.utils.clamp(m, b.width - m, e.clientX - b.left + rnd(-50, 50))
      const y = gsap.utils.clamp(m, Math.min(b.height, window.innerHeight) - m, e.clientY - b.top + rnd(-50, 50))
      const el = pool[i++ % pool.length]
      const rot = rnd(-40, 40)
      const size = rnd(0.78, 1.25)
      alive++
      root.dataset.spawns = String(Number(root.dataset.spawns || 0) + 1)
      gsap.killTweensOf(el)
      gsap.set(el, { x, y, zIndex: z++, rotate: rot - Math.sign(dx || 1) * 18, scale: 0.3 * size, autoAlpha: 1 })
      gsap.timeline({ onComplete: () => { alive-- } })
        .to(el, { scale: size, rotate: rot, x: `+=${dx * 0.18}`, y: `+=${dy * 0.18}`, duration: 0.6, ease: 'back.out(1.7)' })
        .to(el, { scale: 0, autoAlpha: 0, y: '+=80', rotate: rot + rnd(-30, 30), duration: 0.7, ease: 'power3.in' }, `+=${rnd(0.5, 0.9)}`)
    }
    const section = root.closest('section')
    section.addEventListener('pointermove', onMove)
    return () => {
      section.removeEventListener('pointermove', onMove)
      pool.forEach((el) => { gsap.killTweensOf(el); el.remove() })
    }
  }, [ref, title, foot])
}

export default function Hero({ lang, ui }) {
  const trail = useRef(null)
  const title = useRef(null)
  const foot = useRef(null)
  const lenis = useLenis()
  useIconTrail(trail, title, foot)

  const [a, accent, b] = splitAccent(t(lang, settings.hero.title), t(lang, settings.hero.accent))

  useEffect(() => {
    if (prefersReduced()) return
    const words = title.current.querySelectorAll('.w > span')
    const tl = gsap.timeline({ delay: 0.15 })
    tl.from(words, { yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: 0.06 })
      .from('.hero-foot > *', { y: 24, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.08 }, '-=0.7')
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

      <div className="hero-bottom">
        <div ref={foot} className="hero-foot">
          <p className="hero-intro">{t(lang, settings.hero.intro)}</p>
          <a className="hero-cta" href="#contact" onClick={(e) => { e.preventDefault(); scrollToTarget(lenis, '#contact') }}>
            <span>{ui.contactCta}</span>
            <Avatar size={28} />
          </a>
        </div>
      </div>
    </section>
  )
}
