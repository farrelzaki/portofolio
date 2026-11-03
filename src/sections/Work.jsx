import { useEffect, useRef } from 'react'
import { content, t } from '../content/index.js'
import { gsap, prefersReduced } from '../lib/motion.js'
import TwoTone from '../components/TwoTone.jsx'

const { settings, projects, achievements } = content
const highlight = achievements.find((a) => a.highlight)

function Card({ p, lang, ui, onOpen, className = '' }) {
  return (
    <article className={`pcard ${className}`} data-reveal>
      <button type="button" className="pcard-btn" onClick={() => onOpen(p.id)} data-cursor={ui.viewProject} aria-label={`${ui.openProject}: ${p.name}`}>
        <div className="pcard-media">
          <img src={p.cover} alt={t(lang, p.coverAlt)} loading="lazy" />
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
          <span className="pcard-discover mono" aria-hidden="true">{ui.viewProject}</span>
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
      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          y: 80, opacity: 0, duration: 1.2, ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 92%' },
        })
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
