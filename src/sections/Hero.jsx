import { useEffect, useRef } from 'react'
import { content, splitAccent, t } from '../content/index.js'
import { TECH_ICONS } from '../content/icons.js'
import { finePointer, gsap, prefersReduced } from '../lib/motion.js'
import { Link } from '../lib/router.jsx'
import { Avatar } from '../components/Chrome.jsx'
import { introDone } from '../lib/intro.js'

const { settings } = content

// Ikon tools untuk popup kursor (urutan & isi diatur di settings.heroIcons).
const ICONS = settings.heroIcons.map((k) => TECH_ICONS[k]).filter(Boolean)

/** Warna terang (mis. kuning JavaScript) butuh glyph gelap agar tetap terbaca. */
function isLight(hex) {
  const n = parseInt(hex.slice(1), 16)
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255]
  return 0.299 * r + 0.587 * g + 0.114 * b > 170
}

/** Logo tanpa kotak: glyph utama + dua salinan "gema" yang memancar keluar. */
function makePop() {
  const el = document.createElement('div')
  el.className = 'pop'
  el.innerHTML = '<svg class="pop-echo" viewBox="0 0 24 24"><path/></svg><svg class="pop-echo" viewBox="0 0 24 24"><path/></svg><svg class="pop-main" viewBox="0 0 24 24"><path/></svg>'
  return el
}

function paint(el, icon) {
  // Merek berwarna sangat gelap memakai tinta situs; merek sangat terang diberi bayangan tipis.
  const hex = ['#000000', '#181717', '#0A0A0A', '#000'].includes(icon.hex) ? '#0B1220' : icon.hex
  el.querySelectorAll('path').forEach((p) => { p.setAttribute('d', icon.path); p.setAttribute('fill', hex) })
  el.classList.toggle('light', isLight(hex))
  el.setAttribute('data-name', icon.title)
}

/**
 * Popup logo tools yang "terkunci" per zona: hero dibagi menjadi grid tak terlihat, setiap
 * zona punya titik dan kemiringan tetap. Masuk ke zona memunculkan logo besar dengan efek
 * gema; kembali ke zona yang sama selalu menampilkan logo yang berbeda. Zona di dekat teks
 * hero tidak pernah dipakai.
 */
function useIconTrail(ref, title, foot) {
  useEffect(() => {
    const root = ref.current
    if (!root || !finePointer() || prefersReduced() || ICONS.length === 0) return
    const COLS = 6
    const ROWS = 4
    const cells = Array.from({ length: COLS * ROWS }, (_, k) => {
      // Titik & sudut tetap per zona (pseudo-acak dari indeks), supaya terasa tersusun, bukan kaku.
      const r = (n) => ((Math.sin(k * 12.9898 + n * 78.233) * 43758.5453) % 1 + 1) % 1
      const el = makePop()
      root.appendChild(el)
      gsap.set(el, { xPercent: -50, yPercent: -50, autoAlpha: 0 })
      return { el, jx: r(1) - 0.5, jy: r(2) - 0.5, rot: (r(3) - 0.5) * 28, next: Math.floor(r(4) * ICONS.length) }
    })
    const shown = new Set()
    let current = -1

    const blocked = (x, y) => [title, foot].some((r) => {
      if (!r.current) return false
      const b = r.current.getBoundingClientRect()
      const pad = 90
      return x > b.left - pad && x < b.right + pad && y > b.top - pad && y < b.bottom + pad
    })

    const pop = (k) => {
      const b = root.getBoundingClientRect()
      const h = Math.min(b.height, window.innerHeight)
      const cw = b.width / COLS
      const ch = h / ROWS
      const cell = cells[k]
      const x = (k % COLS + 0.5 + cell.jx * 0.5) * cw
      const y = (Math.floor(k / COLS) + 0.5 + cell.jy * 0.5) * ch
      if (blocked(b.left + x, b.top + y)) return
      // Logo berikutnya untuk zona ini, dilewati bila sedang tampil di zona lain.
      let idx = cell.next
      for (let n = 0; n < ICONS.length && shown.has(idx); n++) idx = (idx + 1) % ICONS.length
      cell.next = (idx + 5) % ICONS.length
      shown.add(idx)
      cell.idx = idx
      paint(cell.el, ICONS[idx])
      root.dataset.spawns = String(Number(root.dataset.spawns || 0) + 1)

      const [e1, e2, main] = cell.el.children
      gsap.killTweensOf([cell.el, e1, e2, main])
      gsap.set(cell.el, { x, y, rotate: cell.rot, autoAlpha: 1, zIndex: Number(root.dataset.spawns) })
      gsap.set([e1, e2], { scale: 1, opacity: 0 })
      gsap.timeline({ onComplete: () => shown.delete(idx) })
        .fromTo(main, { scale: 0, rotate: -cell.rot }, { scale: 1, rotate: 0, duration: 0.55, ease: 'back.out(2.2)' })
        .fromTo(e1, { scale: 0.9, opacity: 0.45 }, { scale: 1.7, opacity: 0, duration: 0.8, ease: 'power2.out' }, 0.12)
        .fromTo(e2, { scale: 0.9, opacity: 0.3 }, { scale: 2.4, opacity: 0, duration: 1, ease: 'power2.out' }, 0.24)
        .to(main, { scale: 0.6, opacity: 0, duration: 0.4, ease: 'power3.in' }, 1.5)
        .set(main, { opacity: 1 })
        .set(cell.el, { autoAlpha: 0 })
    }

    const onMove = (e) => {
      const b = root.getBoundingClientRect()
      const h = Math.min(b.height, window.innerHeight)
      const cx = Math.floor(((e.clientX - b.left) / b.width) * COLS)
      const cy = Math.floor(((e.clientY - b.top) / h) * ROWS)
      if (cx < 0 || cy < 0 || cx >= COLS || cy >= ROWS) return
      const k = cy * COLS + cx
      if (k === current) return
      current = k
      pop(k)
    }
    const onLeave = () => { current = -1 }
    const section = root.closest('section')
    section.addEventListener('pointermove', onMove)
    section.addEventListener('pointerleave', onLeave)
    return () => {
      section.removeEventListener('pointermove', onMove)
      section.removeEventListener('pointerleave', onLeave)
      cells.forEach((c) => { gsap.killTweensOf(c.el); c.el.remove() })
    }
  }, [ref, title, foot])
}

export default function Hero({ lang, ui }) {
  const trail = useRef(null)
  const title = useRef(null)
  const foot = useRef(null)
  useIconTrail(trail, title, foot)

  const [a, accent, b] = splitAccent(t(lang, settings.hero.title), t(lang, settings.hero.accent))

  useEffect(() => {
    if (prefersReduced()) return
    const words = title.current.querySelectorAll('.w > span')
    // Tunggu animasi pembuka (bila ada) selesai; sampai saat itu teks disembunyikan.
    const tl = gsap.timeline({ paused: true, delay: 0.05 })
    tl.from(words, { yPercent: 110, duration: 0.8, ease: 'expo.out', stagger: 0.04 })
      .from('.hero-foot > *', { y: 24, opacity: 0, duration: 0.65, ease: 'expo.out', stagger: 0.06 }, '-=0.55')
    tl.progress(0.001).pause()
    let alive = true
    introDone.then(() => { if (alive) tl.restart(true) })
    return () => { alive = false; tl.kill() }
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
          <Link className="hero-cta" to="/kontak">
            <span>{ui.contactCta}</span>
            <Avatar size={28} />
          </Link>
        </div>
      </div>
    </section>
  )
}
