import { useEffect, useRef } from 'react'
import { content, t } from '../content/index.js'
import { TECH_ICONS } from '../content/icons.js'
import { finePointer, gsap, prefersReduced } from '../lib/motion.js'
import { introDone } from '../lib/intro.js'
import ScrollCue from '../components/ScrollCue.jsx'

const { settings } = content
const ROLES = settings.hero.roles.map((r) => r.split(' '))

// Ikon tools untuk popup kursor (urutan & isi diatur di settings.heroIcons).
const ICONS = settings.heroIcons.map((k) => TECH_ICONS[k]).filter(Boolean)

/** Warna terang (mis. kuning JavaScript) butuh bayangan tipis agar tetap terbaca. */
function isLight(hex) {
  const n = parseInt(hex.slice(1), 16)
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255]
  return 0.299 * r + 0.587 * g + 0.114 * b > 170
}

/**
 * Logo tools muncul acak di sekitar kursor: setiap kursor menempuh jarak tertentu, satu logo
 * kecil muncul di titik acak dekat jejaknya, lalu mengecil dan hilang. Area teks hero dilewati.
 */
function useIconTrail(ref, title, foot) {
  useEffect(() => {
    const root = ref.current
    if (!root || !finePointer() || prefersReduced() || ICONS.length === 0) return
    const POOL = 8
    const STEP = 150 // jarak kursor (px) antar-logo
    const GAP = 120 // jeda minimum (ms) antar-logo
    const pool = Array.from({ length: POOL }, () => {
      const el = document.createElement('div')
      el.className = 'pop'
      el.innerHTML = '<svg viewBox="0 0 24 24"><path/></svg>'
      root.appendChild(el)
      gsap.set(el, { xPercent: -50, yPercent: -50, autoAlpha: 0 })
      return el
    })
    let slot = 0
    let z = 1
    let last = null
    let lastAt = 0
    const recent = []

    const blocked = (x, y) => [title, foot].some((r) => {
      if (!r.current) return false
      const b = r.current.getBoundingClientRect()
      const pad = 40
      return x > b.left - pad && x < b.right + pad && y > b.top - pad && y < b.bottom + pad
    })

    const pickIcon = () => {
      let idx
      do idx = Math.floor(Math.random() * ICONS.length)
      while (ICONS.length > 4 && recent.includes(idx))
      recent.push(idx)
      if (recent.length > 4) recent.shift()
      return ICONS[idx]
    }

    const spawn = (cx, cy) => {
      // Titik acak di sekitar kursor; dicoba beberapa kali agar tidak jatuh di atas teks.
      let x, y, ok = false
      for (let n = 0; n < 6 && !ok; n++) {
        const a = Math.random() * Math.PI * 2
        const d = 30 + Math.random() * 70
        x = cx + Math.cos(a) * d
        y = cy + Math.sin(a) * d
        ok = !blocked(x, y)
      }
      if (!ok) return
      const b = root.getBoundingClientRect()
      const icon = pickIcon()
      const hex = ['#000000', '#181717', '#0A0A0A', '#000'].includes(icon.hex) ? '#0B1220' : icon.hex
      const el = pool[slot]
      slot = (slot + 1) % POOL
      const path = el.querySelector('path')
      path.setAttribute('d', icon.path)
      path.setAttribute('fill', hex)
      el.classList.toggle('light', isLight(hex))
      const rot = (Math.random() - 0.5) * 36
      gsap.killTweensOf(el)
      gsap.set(el, { x: x - b.left, y: y - b.top, zIndex: z++, autoAlpha: 1 })
      gsap.timeline()
        .fromTo(el, { scale: 0, rotate: rot - 20 }, { scale: 1, rotate: rot, duration: 0.5, ease: 'back.out(2)' })
        .to(el, { scale: 0.5, autoAlpha: 0, y: '+=14', duration: 0.45, ease: 'power3.in' }, 0.95)
      root.dataset.spawns = String(Number(root.dataset.spawns || 0) + 1)
    }

    const onMove = (e) => {
      const now = performance.now()
      if (!last) { last = { x: e.clientX, y: e.clientY }; return }
      if (Math.hypot(e.clientX - last.x, e.clientY - last.y) < STEP || now - lastAt < GAP) return
      last = { x: e.clientX, y: e.clientY }
      lastAt = now
      spawn(e.clientX, e.clientY)
    }
    const onLeave = () => { last = null }
    const section = root.closest('section')
    section.addEventListener('pointermove', onMove)
    section.addEventListener('pointerleave', onLeave)
    return () => {
      section.removeEventListener('pointermove', onMove)
      section.removeEventListener('pointerleave', onLeave)
      pool.forEach((el) => { gsap.killTweensOf(el); el.remove() })
    }
  }, [ref, title, foot])
}

/**
 * Peran yang berganti: hanya kata yang berbeda yang bergulir (lama naik keluar, baru naik
 * masuk), sementara lebar slot kata ikut beranimasi supaya seluruh baris tetap di tengah.
 */
function useRoleRotator(line) {
  useEffect(() => {
    const el = line.current
    if (!el) return
    const slots = [...el.querySelectorAll('.role-slot')]
    let i = 0
    let timer = null
    let visible = true
    const reduced = prefersReduced()

    const swap = () => {
      const next = (i + 1) % ROLES.length
      let j = 0
      ROLES[next].forEach((word, k) => {
        if (word === ROLES[i][k]) return
        const slot = slots[k]
        const old = slot.lastElementChild
        if (reduced) { old.textContent = word; return }
        const nw = document.createElement('span')
        nw.className = 'role-word incoming'
        nw.textContent = word
        slot.appendChild(nw)
        const from = slot.getBoundingClientRect().width
        const to = nw.getBoundingClientRect().width
        const delay = j++ * 0.1
        gsap.fromTo(slot, { width: from }, { width: to, duration: 0.9, ease: 'expo.inOut', delay })
        gsap.to(old, { yPercent: -135, duration: 0.8, ease: 'expo.inOut', delay, onComplete: () => old.remove() })
        gsap.fromTo(nw, { yPercent: 135 }, {
          yPercent: 0, duration: 0.8, ease: 'expo.inOut', delay,
          onComplete: () => { nw.classList.remove('incoming'); gsap.set(slot, { clearProps: 'width' }) },
        })
      })
      i = next
    }
    const tick = () => { if (visible && !document.hidden) swap(); timer = setTimeout(tick, 2600) }
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting })
    io.observe(el)
    let alive = true
    introDone.then(() => { if (alive) timer = setTimeout(tick, 2200) })
    return () => { alive = false; clearTimeout(timer); io.disconnect(); gsap.killTweensOf(el.querySelectorAll('*')) }
  }, [line])
}

export default function Hero({ lang, ui }) {
  const trail = useRef(null)
  const title = useRef(null)
  const foot = useRef(null)
  const line = useRef(null)
  useIconTrail(trail, title, foot)
  useRoleRotator(line)

  useEffect(() => {
    if (prefersReduced()) return
    // Tunggu animasi pembuka (bila ada) selesai; sampai saat itu teks disembunyikan.
    const tl = gsap.timeline({ paused: true, delay: 0.05 })
    tl.from('.hero-hi > span', { yPercent: 110, duration: 0.8, ease: 'expo.out' })
      .from('.role-slot > span', { yPercent: 110, duration: 0.9, ease: 'expo.out', stagger: 0.06 }, '-=0.65')
      .from('.hero-foot > *', { y: 24, opacity: 0, duration: 0.65, ease: 'expo.out', stagger: 0.08 }, '-=0.55')
    tl.progress(0.001).pause()
    let alive = true
    introDone.then(() => { if (alive) tl.restart(true) })
    return () => { alive = false; tl.kill() }
  }, [lang])

  return (
    <section className="hero" id="top" data-theme="light">
      <div className="hero-trail" ref={trail} aria-hidden="true" />
      <div ref={title} className="hero-head">
        <p className="hero-hi"><span>{t(lang, settings.hero.greeting)}</span></p>
        <h1 className="hero-role" aria-label={settings.hero.roles.join(', ')}>
          <span ref={line} className="role-line" aria-hidden="true">
            {ROLES[0].map((w, k) => (
              <span key={k} className="role-slot"><span className="role-word">{w}</span></span>
            ))}
          </span>
        </h1>
      </div>

      <div className="hero-bottom">
        <div ref={foot} className="hero-foot">
          <p className="hero-intro">{t(lang, settings.hero.intro)}</p>
          <ScrollCue label={ui.scrollCue} />
        </div>
      </div>
    </section>
  )
}
