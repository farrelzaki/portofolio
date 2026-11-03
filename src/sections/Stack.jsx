import { useEffect, useRef } from 'react'
import { content, t } from '../content/index.js'
import { gsap, prefersReduced, ScrollTrigger } from '../lib/motion.js'

const { settings, stack, projects } = content
const TONES = ['blue', 'ink', 'sky', 'paper']
const CARDS = stack.slice(0, 10).map((name, i) => ({
  name,
  tone: TONES[i % TONES.length],
  img: i % 3 === 1 ? projects[(i / 3 | 0) % projects.length]?.cover : '',
}))

/**
 * "Tornado": cincin 3D kartu yang berputar terus mengelilingi judul raksasa.
 * Kartu di depan menutupi judul, kartu di belakang tertutup judul (preserve-3d).
 * Kecepatan putar bertambah mengikuti kecepatan scroll.
 */
export default function Stack({ lang }) {
  const root = useRef(null)
  const ring = useRef(null)
  const sec = settings.sections.stack

  useEffect(() => {
    if (prefersReduced()) return
    const state = { rot: 0, boost: 0 }
    let visible = false
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting })
    io.observe(root.current)
    const st = ScrollTrigger.create({
      trigger: root.current, start: 'top bottom', end: 'bottom top',
      onUpdate: (self) => { state.boost = Math.min(Math.abs(self.getVelocity()) / 400, 6) },
    })
    const tick = (_, dt) => {
      if (!visible) return
      state.boost *= 0.94
      state.rot += (0.012 + state.boost * 0.02) * dt
      ring.current.style.transform = `rotateX(-6deg) rotateY(${state.rot}deg)`
    }
    gsap.ticker.add(tick)
    return () => { gsap.ticker.remove(tick); st.kill(); io.disconnect() }
  }, [])

  return (
    <section ref={root} className="stack" data-theme="light" aria-label={`${t(lang, sec.lead)} ${t(lang, sec.tail)}`}>
      <p className="stack-lead">{t(lang, sec.lead)}</p>
      <div className="stack-scene">
        <p className="stack-big" aria-hidden="true">
          <span>{t(lang, sec.tail).split(/\s+/).map((w, i) => <span key={i} className="stack-word">{w}</span>)}</span>
        </p>
        <div ref={ring} className="stack-ring">
          {CARDS.map((c, i) => (
            <div key={c.name} className={`stack-card tone-${c.tone}`} style={{ '--a': `${(360 / CARDS.length) * i}deg` }}>
              {c.img ? <img src={c.img} alt="" loading="lazy" /> : null}
              <span>{c.name}</span>
            </div>
          ))}
        </div>
      </div>
      <ul className="sr-only">{stack.map((s) => <li key={s}>{s}</li>)}</ul>
    </section>
  )
}
