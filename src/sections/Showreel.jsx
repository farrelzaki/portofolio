import { useEffect, useRef, useState } from 'react'
import { content, t } from '../content/index.js'
import { gsap, prefersReduced, ScrollTrigger } from '../lib/motion.js'

const SLIDES = content.projects.flatMap((p) =>
  [p.cover, ...p.gallery].filter(Boolean).map((src, k) => ({ src, project: p, key: `${p.id}-${k}` })),
)

/**
 * Showreel: bingkai mulai sebagai garis tipis membulat lalu membesar ke layar penuh
 * mengikuti scroll (clip-path di-scrub), isinya bergeser parallax dan berganti otomatis.
 */
export default function Showreel({ lang, ui }) {
  const section = useRef(null)
  const frame = useRef(null)
  const media = useRef(null)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 3200)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (prefersReduced()) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: section.current, start: 'top bottom', end: 'top top', scrub: true },
      })
      tl.fromTo(frame.current,
        { clipPath: 'inset(calc(50% - 3px) 16% calc(50% - 3px) 16% round 10px)' },
        { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none' })
      gsap.fromTo(media.current, { yPercent: -8, scale: 1.18 }, {
        yPercent: 8, scale: 1.04, ease: 'none',
        scrollTrigger: { trigger: section.current, start: 'top bottom', end: 'bottom top', scrub: true },
      })
    }, section)
    ScrollTrigger.refresh()
    return () => ctx.revert()
  }, [])

  const current = SLIDES[index]

  return (
    <section ref={section} className="showreel" data-theme="dark" aria-label={ui.showreel}>
      <div className="showreel-sticky">
        <div ref={frame} className="showreel-frame">
          <div ref={media} className="showreel-media">
            {SLIDES.map((s, i) => (
              <img key={s.key} src={s.src} alt="" className={i === index ? 'on' : ''} loading={i < 2 ? 'eager' : 'lazy'} />
            ))}
          </div>
          <div className="showreel-caption">
            <span className="mono">{String(index + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}</span>
            <strong>{current.project.name}</strong>
            <span className="mono">{t(lang, current.project.category)}</span>
          </div>
          <div className="showreel-thumbs" role="tablist" aria-label={ui.showreel}>
            {SLIDES.map((s, i) => (
              <button
                key={s.key}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`${s.project.name} ${i + 1}`}
                className={i === index ? 'on' : ''}
                onClick={() => setIndex(i)}
              >
                <img src={s.src} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
