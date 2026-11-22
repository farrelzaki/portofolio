import { useEffect, useRef } from 'react'
import { content, t } from '../content/index.js'
import { gsap, prefersReduced } from '../lib/motion.js'
import { useHeroField } from './heroField.js'
import { introDone } from '../lib/intro.js'
import ScrollCue from '../components/ScrollCue.jsx'

const { settings } = content
const ROLES = settings.hero.roles.map((r) => r.split(' '))

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
  useHeroField(trail, title, foot)
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
