import { useEffect, useRef } from 'react'
import { content, t } from '../content/index.js'
import { finePointer, gsap, prefersReduced } from '../lib/motion.js'
import TwoTone from '../components/TwoTone.jsx'

const { settings, projects, achievements } = content
const highlight = achievements.find((a) => a.highlight)

/** Teks di atas warna aksen: gelap untuk aksen terang, putih untuk aksen gelap. */
function inkOn(hex) {
  const n = parseInt(hex.slice(1), 16)
  const lum = 0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)
  return lum > 160 ? '#0B1220' : '#FFFFFF'
}

/** Gambar mengikuti kursor sedikit (pointer halus saja), ditulis ke variabel CSS. */
function onTilt(e) {
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--mx', ((e.clientX - r.left) / r.width - 0.5).toFixed(3))
  e.currentTarget.style.setProperty('--my', ((e.clientY - r.top) / r.height - 0.5).toFixed(3))
}
function offTilt(e) {
  e.currentTarget.style.setProperty('--mx', 0)
  e.currentTarget.style.setProperty('--my', 0)
}

function Card({ p, lang, ui, onOpen, className = '' }) {
  const alt = p.gallery?.[0]
  const accent = p.accent || '#0B1220'
  return (
    <article className={`pcard ${className}`} data-reveal style={{ '--accent': accent, '--on-accent': inkOn(accent) }}>
      <button
        type="button" className="pcard-btn" onClick={() => onOpen(p.id)} data-cursor={ui.viewProject} aria-label={`${ui.openProject}: ${p.name}`}
        onPointerMove={finePointer() ? onTilt : undefined} onPointerLeave={finePointer() ? offTilt : undefined}
      >
        <div className="pcard-media">
          <div className="pcard-shift">
            <img className="pcard-img" src={p.cover} alt={t(lang, p.coverAlt)} loading="lazy" />
            {alt && <img className="pcard-alt" src={alt} alt="" loading="lazy" aria-hidden="true" />}
          </div>
        </div>
        <div className="pcard-label">
          <span className="pcard-bar" aria-hidden="true" />
          <span className="pcard-pill">
            <span className="pcard-name">{p.name}</span>
            <span className="pcard-meta mono">
              {p.year && <span>{p.year}</span>}
              <span>{t(lang, p.category)}</span>
            </span>
          </span>
          <span className="pcard-discover mono" aria-hidden="true">{ui.viewProject} <i>→</i></span>
        </div>
      </button>
    </article>
  )
}

export default function Work({ lang, ui, onOpen }) {
  const root = useRef(null)
  const sec = settings.sections.work

  useEffect(() => {
    if (prefersReduced()) return
    const ctx = gsap.context(() => {
      // Kartu proyek: tirai clip-path terbuka dari bawah, gambar turun skala dari 1.3,
      // label menyusul. Lalu parallax halus di dalam kartu selama digulir.
      gsap.utils.toArray('.pcard').forEach((card) => {
        const img = card.querySelector('.pcard-shift')
        const label = card.querySelector('.pcard-pill')
        const tl = gsap.timeline({ scrollTrigger: { trigger: card, start: 'top 88%' } })
        tl.fromTo(card, { clipPath: 'inset(100% 0% 0% 0% round 10px)', y: 60 },
          { clipPath: 'inset(0% 0% 0% 0% round 10px)', y: 0, duration: 1.3, ease: 'expo.out', clearProps: 'clipPath' })
          .fromTo(img, { scale: 1.3 }, { scale: 1, duration: 1.6, ease: 'expo.out' }, 0)
          .fromTo(label, { yPercent: -140, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.8, ease: 'expo.out' }, 0.45)
        gsap.fromTo(card.querySelector('.pcard-media'), { yPercent: -4 }, {
          yPercent: 4, ease: 'none',
          scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true },
        })
      })
      gsap.utils.toArray('.hcard').forEach((el) => {
        gsap.from(el, { y: 80, opacity: 0, rotate: -2, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%' } })
      })
    }, root)
    return () => ctx.revert()
  }, [lang])

  const [first, ...rest] = projects

  return (
    <section ref={root} className="work" id="work" data-theme="light">
      <header className="sec-head center">
        <TwoTone as="h2" lead={t(lang, sec.lead)} tail={t(lang, sec.tail)} />
        <span className="arrow" aria-hidden="true">↓</span>
        <p className="lede">{t(lang, sec.intro)}</p>
      </header>

      <div className="mosaic">
        {first && <Card p={first} lang={lang} ui={ui} onOpen={onOpen} className="wide" />}
        {rest[0] && <Card p={rest[0]} lang={lang} ui={ui} onOpen={onOpen} />}
        {rest[1] && <Card p={rest[1]} lang={lang} ui={ui} onOpen={onOpen} className="tall" />}
        {highlight && (
          <article className="hcard" data-reveal>
            <span className="mono">{ui.highlight}</span>
            <p className="hcard-quote">{t(lang, highlight.title)}</p>
            <div className="hcard-foot">
              <img src={highlight.image} alt="" loading="lazy" />
              <span>
                <strong>{t(lang, highlight.issuer)}</strong>
                <span>{t(lang, highlight.description)}</span>
              </span>
            </div>
          </article>
        )}
        {rest.slice(2).map((p) => <Card key={p.id} p={p} lang={lang} ui={ui} onOpen={onOpen} />)}
      </div>
    </section>
  )
}
