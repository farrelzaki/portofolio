import { useEffect, useRef, useState } from 'react'
import { content, t } from '../content/index.js'
import { finePointer, gsap, prefersReduced, ScrollTrigger, useMedia } from '../lib/motion.js'
import { Link, navigate } from '../lib/router.jsx'
import Icon from '../components/Icon.jsx'
import './pages.css'

// Slide show memuat 5 proyek teratas (urutan di projects.json); indeks di bawahnya memuat semua.
const ALL = content.projects
const projects = ALL.slice(0, 5)

/** Gelapkan warna aksen supaya teks putih selalu terbaca sebagai latar penuh. */
function deepen(hex, k = 0.38) {
  const n = parseInt(hex.slice(1), 16)
  const mix = (c, ink) => Math.round(c * (1 - k) + ink * k)
  const [r, g, b] = [mix((n >> 16) & 255, 11), mix((n >> 8) & 255, 18), mix(n & 255, 32)]
  return `rgb(${r}, ${g}, ${b})`
}

/**
 * Halaman Projek (ref. robin-noguier.com): layar di-pin, setiap gulir berpindah ke projek
 * berikutnya. Latar berganti ke warna aksen projek, judul bergulir, kover masuk dengan
 * tirai dan melengkung mengikuti kecepatan gulir. Di bawahnya indeks semua projek.
 */
export default function WorkPage({ lang, ui }) {
  const root = useRef(null)
  const stage = useRef(null)
  const [active, setActive] = useState(0)
  const wide = useMedia('(min-width: 900px)')
  const n = projects.length
  const animated = wide && !prefersReduced()

  // Pin + pindah projek berdasarkan progres gulir.
  useEffect(() => {
    if (!animated) return
    const ctx = gsap.context(() => {
      gsap.set('.wk-covers', { transformPerspective: 1200 })
      const bend = gsap.quickTo('.wk-covers', 'rotateY', { duration: 0.6, ease: 'power3' })
      const skew = gsap.quickTo('.wk-covers', 'skewY', { duration: 0.6, ease: 'power3' })
      let settle = null
      ScrollTrigger.create({
        trigger: stage.current,
        start: 'top top',
        end: () => `+=${window.innerHeight * (n - 1) * 0.9}`,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        snap: { snapTo: 1 / (n - 1), duration: { min: 0.25, max: 0.6 }, ease: 'power2.inOut', delay: 0.05 },
        onUpdate: (self) => {
          setActive(Math.round(self.progress * (n - 1)))
          const v = gsap.utils.clamp(-1, 1, self.getVelocity() / 2500)
          bend(v * -14)
          skew(v * 3)
          settle?.kill()
          settle = gsap.delayedCall(0.12, () => { bend(0); skew(0) })
        },
      })
    }, root)
    return () => ctx.revert()
  }, [animated, n])

  // Transisi tiap kali projek aktif berganti. Tidak di-revert antar-langkah (revert akan
  // mengembalikan kover ke keadaan awal); tween baru cukup menimpa yang lama.
  const shown = useRef(0)
  useEffect(() => {
    if (!animated || !root.current) return
    const q = gsap.utils.selector(root)
    const prev = shown.current
    shown.current = active
    gsap.to(stage.current, { backgroundColor: deepen(projects[active].accent), duration: 0.8, ease: 'power2.out', overwrite: true })
    q('.wk-name').forEach((el, i) => gsap.to(el, { y: 0, yPercent: (i - active) * 104, duration: prev === active ? 0 : 0.9, ease: 'expo.out', overwrite: true }))
    q('.wk-cover').forEach((el, i) => {
      if (i === active) {
        gsap.set(el, { zIndex: 3 })
        if (prev !== active) {
          gsap.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'expo.out', overwrite: true })
          gsap.fromTo(el.querySelector('img'), { scale: 1.25 }, { scale: 1, duration: 1.3, ease: 'expo.out', overwrite: true })
        } else gsap.set(el, { clipPath: 'inset(0% 0% 0% 0%)' })
      } else if (i === prev) {
        gsap.set(el, { zIndex: 2 })
        gsap.to(el, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.9, ease: 'expo.inOut', delay: 0.2, overwrite: true })
      } else {
        gsap.set(el, { zIndex: 1, clipPath: 'inset(100% 0% 0% 0%)', overwrite: true })
      }
    })
    if (prev !== active) gsap.fromTo(q('.wk-copy > *'), { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'expo.out', stagger: 0.05 })
  }, [active, animated])
  useEffect(() => () => { if (root.current) gsap.killTweensOf(gsap.utils.selector(root)('.wk-name, .wk-cover, .wk-cover img')) }, [])

  const jump = (i) => {
    const st = ScrollTrigger.getAll().find((s) => s.trigger === stage.current)
    if (!st) return
    window.scrollTo({ top: st.start + (st.end - st.start) * (i / (n - 1)), behavior: 'smooth' })
  }

  const p = projects[active]
  const year = [p.year, t(lang, p.category)].filter(Boolean).join(' · ')

  return (
    <div ref={root} className="wk-page">
      {animated ? (
        <section ref={stage} className="wk-stage" data-theme="dark" style={{ backgroundColor: deepen(projects[0].accent) }}>
          <div className="wk-left">
            <span className="wk-count" aria-hidden="true"><b>{String(active + 1).padStart(2, '0')}</b> / {String(n).padStart(2, '0')}</span>
            <h1 className="wk-names" aria-live="polite">
              {projects.map((x, i) => (
                <span key={x.id} className="wk-name" style={{ opacity: i === 0 ? 1 : undefined }} aria-hidden={i !== active}>{x.name}</span>
              ))}
            </h1>
            <div className="wk-copy" key={p.id}>
              <span className="wk-meta">{year}</span>
              <p>{t(lang, p.description)}</p>
              <Link to={`/proyek/${p.id}`} className="wk-open">{ui.caseStudy} <Icon name="right" /></Link>
            </div>
          </div>

          <button type="button" className="wk-covers" onClick={() => navigate(`/proyek/${p.id}`)} data-cursor={ui.viewProject} aria-label={`${ui.openProject}: ${p.name}`}>
            {projects.map((x, i) => (
              <span key={x.id} className="wk-cover" style={{ clipPath: i === 0 ? 'inset(0% 0% 0% 0%)' : 'inset(100% 0% 0% 0%)', background: x.accent }}>
                <img src={x.cover} alt="" />
              </span>
            ))}
          </button>

          <nav className="wk-dots" aria-label={ui.nav.work}>
            {projects.map((x, i) => (
              <button key={x.id} type="button" className={i === active ? 'on' : ''} onClick={() => jump(i)} aria-label={x.name} aria-current={i === active}>
                <span>{x.name}</span>
              </button>
            ))}
          </nav>

          {p.gallery[0] && (
            <span className="wk-thumb" key={`t-${p.id}`}><img src={p.gallery[0]} alt="" /></span>
          )}
        </section>
      ) : (
        <section className="wk-stack" data-theme="dark">
          <h1 className="wk-stack-title">{ui.nav.work}</h1>
          {projects.map((x) => (
            <Link key={x.id} to={`/proyek/${x.id}`} className="wk-card" style={{ backgroundColor: deepen(x.accent) }}>
              <span className="wk-card-img"><img src={x.cover} alt="" loading="lazy" /></span>
              <strong>{x.name}</strong>
              <span className="wk-meta">{[x.year, t(lang, x.category)].filter(Boolean).join(' · ')}</span>
              <span className="wk-open">{ui.caseStudy} <Icon name="right" /></span>
            </Link>
          ))}
        </section>
      )}

      <WorkIndex lang={lang} ui={ui} />
    </div>
  )
}

/** Indeks: daftar semua projek dengan pratinjau yang mengikuti kursor (ref. dennissnellenberg.com/work). */
function WorkIndex({ lang, ui }) {
  const root = useRef(null)
  const preview = useRef(null)
  const [hover, setHover] = useState(null)

  useEffect(() => {
    const el = preview.current
    if (!el || !finePointer() || prefersReduced()) return
    const x = gsap.quickTo(el, 'x', { duration: 0.55, ease: 'power3' })
    const y = gsap.quickTo(el, 'y', { duration: 0.55, ease: 'power3' })
    const on = (e) => { x(e.clientX); y(e.clientY) }
    window.addEventListener('pointermove', on)
    return () => window.removeEventListener('pointermove', on)
  }, [])

  useEffect(() => {
    if (prefersReduced()) return
    const ctx = gsap.context(() => {
      gsap.from('.wi-row', { y: 50, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.06, scrollTrigger: { trigger: root.current, start: 'top 75%' } })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="wi" data-theme="light">
      <header className="wi-head">
        <h2>{ui.allWork.join(' ')}</h2>
        <div className="wi-cols" aria-hidden="true"><span>{ui.category}</span><span>{ui.role}</span><span>{ui.year}</span></div>
      </header>
      <ol className="wi-list" onPointerLeave={() => setHover(null)}>
        {ALL.map((x) => (
          <li key={x.id} className="wi-row" style={{ '--accent': x.accent }}>
            <Link to={`/proyek/${x.id}`} onPointerEnter={() => setHover(x.id)} onFocus={() => setHover(x.id)} data-cursor={ui.viewProject}>
              <span className="wi-name">{x.name}</span>
              <span className="wi-cat">{t(lang, x.category)}</span>
              <span className="wi-role">{t(lang, x.role)}</span>
              <span className="wi-year mono">{x.year || '—'}</span>
            </Link>
          </li>
        ))}
      </ol>
      <div ref={preview} className={`wi-preview ${hover ? 'show' : ''}`} aria-hidden="true">
        <div className="wi-preview-inner">
          <div className="wi-preview-track" style={{ transform: `translateY(${-100 * Math.max(0, ALL.findIndex((x) => x.id === hover))}%)` }}>
            {ALL.map((x) => <span key={x.id} style={{ background: x.accent }}><img src={x.cover} alt="" loading="lazy" /></span>)}
          </div>
        </div>
      </div>
    </section>
  )
}
