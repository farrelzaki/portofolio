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

  // Hover: kartu ditarik keluar dari tumpukan (naik), lalu diletakkan di depan semua kartu.
  // Kartu itu tetap di depan sampai kartu lain di-hover; barulah ia dimasukkan kembali ke
  // tempatnya sementara kartu baru ditarik keluar.
  useEffect(() => {
    if (!wide || prefersReduced() || !finePointer()) return
    const slots = [...root.current.querySelectorAll('.acard-slot')]
    let active = -1
    const base = (i) => i + 1
    const pullOut = (i) => {
      const slot = slots[i]
      const card = slot.firstElementChild
      gsap.killTweensOf(card)
      gsap.timeline()
        .to(card, { yPercent: -62, rotate: (i - (n - 1) / 2) * -3, duration: 0.38, ease: 'power3.out' })
        .call(() => { slot.style.zIndex = 50 })
        .to(card, { yPercent: -6, y: 0, rotate: 0, scale: 1.12, duration: 0.6, ease: 'expo.out' })
      card.classList.add('is-out')
    }
    const putBack = (i) => {
      const slot = slots[i]
      const card = slot.firstElementChild
      gsap.killTweensOf(card)
      card.classList.remove('is-out')
      gsap.timeline()
        .to(card, { yPercent: -62, scale: 1, rotate: (i - (n - 1) / 2) * 3, duration: 0.36, ease: 'power3.in' })
        .call(() => { slot.style.zIndex = 40 })
        .to(card, { yPercent: 0, rotate: 0, duration: 0.55, ease: 'expo.out' })
        .call(() => { slot.style.zIndex = base(i) })
    }
    const handlers = slots.map((slot, i) => {
      const on = () => {
        if (active === i) return
        if (active >= 0) putBack(active)
        active = i
        pullOut(i)
      }
      slot.addEventListener('pointerenter', on)
      return on
    })
    return () => {
      slots.forEach((slot, i) => {
        slot.removeEventListener('pointerenter', handlers[i])
        gsap.killTweensOf(slot.firstElementChild)
        gsap.set(slot.firstElementChild, { clearProps: 'transform' })
        slot.firstElementChild.classList.remove('is-out')
        slot.style.zIndex = base(i)
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
