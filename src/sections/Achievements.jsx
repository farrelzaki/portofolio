import { useEffect, useRef } from 'react'
import { content, t } from '../content/index.js'
import { finePointer, gsap, prefersReduced, useMedia } from '../lib/motion.js'
import TwoTone from '../components/TwoTone.jsx'
import MoreLink from '../components/MoreLink.jsx'

const { settings, achievements } = content

/** Kartu sertifikat bertumpuk seperti kipas yang menyebar saat di-scroll (desktop). */
export default function Achievements({ lang, ui }) {
  const root = useRef(null)
  const wide = useMedia('(min-width: 900px)')
  const sec = settings.sections.achievements
  const n = achievements.length

  useEffect(() => {
    if (!wide || prefersReduced()) return
    const ctx = gsap.context(() => {
      const fan = root.current.querySelector('.fan')
      const cards = gsap.utils.toArray('.acard-slot')
      const mid = (n - 1) / 2
      // Jarak tiap kartu ke titik tengah kipas (px), dihitung ulang saat ukuran layar berubah.
      const toCenter = (el) => {
        const f = fan.getBoundingClientRect()
        const r = el.getBoundingClientRect()
        const cur = gsap.getProperty(el, 'x')
        return f.left + f.width / 2 - (r.left - cur + r.width / 2)
      }
      cards.forEach((c, i) => {
        const o = i - mid
        gsap.fromTo(c,
          { x: () => toCenter(c) + o * 26, rotate: o * 6, y: Math.abs(o) * 14 },
          {
            x: 0, rotate: o * 2.2, y: Math.abs(o) * 8, ease: 'power2.inOut', immediateRender: true,
            scrollTrigger: { trigger: fan, start: 'top 80%', end: 'center 50%', scrub: 0.8, invalidateOnRefresh: true },
          })
      })
    }, root)
    return () => ctx.revert()
  }, [wide, n, lang])

  // Hover = mengambil kartu dari kipas: kartu naik keluar dari tumpukan, pindah ke lapisan
  // paling depan, lalu turun sedikit ke posisi "dipegang" (tegak, sedikit lebih besar). Kartu
  // itu tetap di depan sampai kartu lain diambil; saat itu ia naik lagi, kembali ke lapisannya,
  // dan turun ke tempatnya. Ada jeda niat (hover intent) agar menyapu kursor melintasi kipas
  // tidak memicu rentetan kartu naik-turun.
  useEffect(() => {
    if (!wide || !finePointer()) return
    const reduce = prefersReduced()
    const slots = [...root.current.querySelectorAll('.acard-slot')]
    const cards = slots.map((s) => s.firstElementChild)
    const baseZ = (i) => i + 1
    let active = -1
    let intent = null

    const take = (i) => {
      const slot = slots[i]
      const card = cards[i]
      card.classList.add('is-out')
      if (reduce) { slot.style.zIndex = 50; return }
      // Luruskan kartu terhadap kemiringan kipas pada slot.
      const tilt = -(gsap.getProperty(slot, 'rotate') || 0)
      gsap.killTweensOf(card)
      gsap.timeline()
        .to(card, { yPercent: -24, rotate: tilt * 0.5, duration: 0.22, ease: 'power2.out' })
        .call(() => { slot.style.zIndex = 50 })
        .to(card, { yPercent: -7, rotate: tilt, scale: 1.06, duration: 0.34, ease: 'power3.inOut' })
    }
    const release = (i) => {
      const slot = slots[i]
      const card = cards[i]
      card.classList.remove('is-out')
      if (reduce) { slot.style.zIndex = baseZ(i); return }
      slot.style.zIndex = 45
      gsap.killTweensOf(card)
      gsap.timeline()
        .to(card, { yPercent: -24, scale: 1, duration: 0.2, ease: 'power2.out' })
        .call(() => { slot.style.zIndex = baseZ(i) })
        .to(card, { yPercent: 0, rotate: 0, duration: 0.34, ease: 'expo.out' })
    }
    const select = (i) => {
      if (active === i) return
      if (active >= 0) release(active)
      active = i
      take(i)
    }

    const offs = slots.map((slot, i) => {
      const enter = () => { clearTimeout(intent); intent = setTimeout(() => select(i), 90) }
      const leave = () => clearTimeout(intent)
      slot.addEventListener('pointerenter', enter)
      slot.addEventListener('pointerleave', leave)
      return () => { slot.removeEventListener('pointerenter', enter); slot.removeEventListener('pointerleave', leave) }
    })
    return () => {
      clearTimeout(intent)
      offs.forEach((off) => off())
      cards.forEach((card, i) => {
        gsap.killTweensOf(card)
        gsap.set(card, { clearProps: 'transform' })
        card.classList.remove('is-out')
        slots[i].style.zIndex = baseZ(i)
      })
    }
  }, [wide, n])

  return (
    <section ref={root} className="achievements" id="achievements" data-theme="light">
      <header className="sec-head left">
        <TwoTone as="h2" className="small" lead={t(lang, sec.lead)} tail={t(lang, sec.tail)} />
      </header>
      <MoreLink to="/prestasi" label={ui.seeAll.achievements} align="left" />
      <div className="fan">
        {achievements.map((a, i) => (
          <div key={a.id} className="acard-slot" style={{ zIndex: i + 1 }}>
          <figure className={`acard ${i % 2 ? 'alt' : ''}`}>
            <div className="acard-top mono">
              <span>{a.date.slice(0, 4)}</span>
              {a.highlight && <span className="badge">{ui.highlight}</span>}
            </div>
            <div className="acard-img"><img src={a.image} alt={`${t(lang, a.title)}`} loading="lazy" /></div>
            <figcaption>
              <strong>{t(lang, a.title)}</strong>
              <span className="acard-issuer">{t(lang, a.issuer)}</span>
              {t(lang, a.description) && <p>{t(lang, a.description)}</p>}
            </figcaption>
          </figure>
          </div>
        ))}
      </div>
    </section>
  )
}
