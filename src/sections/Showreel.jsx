import { useEffect, useRef, useState } from 'react'
import { content, t } from '../content/index.js'
import { gsap, prefersReduced, ScrollTrigger } from '../lib/motion.js'

const byId = Object.fromEntries(content.projects.map((p) => [p.id, p]))
const SLIDES = content.settings.showreel
  .filter((r) => r.image && byId[r.project])
  .map((r, k) => ({ src: r.image, project: byId[r.project], key: `${r.project}-${k}` }))

/**
 * Showreel: kartu membulat di tengah bawah yang membesar ke layar penuh saat section di-pin
 * (clip-path numerik di-scrub), gambar berganti otomatis. Daftar slide: settings.showreel.
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
      // Saat masuk layar: kartu kecil membulat di tengah. Saat di-pin: membesar dari tengah ke layar penuh.
      gsap.set('.showreel-ui', { opacity: 0, y: 20 })
      gsap.set(media.current, { autoAlpha: 0 })
      const tl = gsap.timeline({
        scrollTrigger: { trigger: section.current, start: 'top top', end: '+=280%', scrub: 0.8, pin: true, anticipatePin: 1 },
      })
      // Nilai awal & akhir eksplisit 4 sisi: browser meringkas inset(a b a b) menjadi 2 nilai,
      // yang membuat interpolasi GSAP tidak simetris.
      tl.fromTo(frame.current,
        { clipPath: 'inset(36.1% 24.1% 36.2% 24.2% round 18px)' },
        { clipPath: 'inset(0.01% 0.02% 0.03% 0.04% round 0px)', ease: 'power2.inOut', duration: 1, immediateRender: true })
        // Selama membesar isinya hitam pekat; foto proyek baru masuk setelah frame penuh.
        .fromTo(media.current, { autoAlpha: 0, scale: 1.14 }, { autoAlpha: 1, scale: 1.02, ease: 'power2.out', duration: 0.45 }, 1)
        .to('.showreel-ui', { opacity: 1, y: 0, ease: 'power2.out', duration: 0.3, stagger: 0.06 }, 1.25)
        // Jeda: section tetap di-pin beberapa gulir agar tidak mudah terlewat.
        .to({}, { duration: 1.15 })
      // Kartu kecil ikut naik pelan saat section masuk dari bawah.
      gsap.fromTo(frame.current, { yPercent: 12 }, {
        yPercent: 0, ease: 'none',
        scrollTrigger: { trigger: section.current, start: 'top bottom', end: 'top top', scrub: true },
      })
      // Saat ditahan, foto bergerak sangat pelan supaya layar tidak terasa membeku.
      tl.to(media.current, { scale: 1.08, ease: 'none', duration: 1.4 }, 1.25)
    }, section)
    ScrollTrigger.refresh()
    return () => ctx.revert()
  }, [])

  const current = SLIDES[index]

  return (
    <section ref={section} className="showreel" data-theme="light" aria-label={ui.showreel}>
      <div className="showreel-sticky">
        <div ref={frame} className="showreel-frame" data-theme="dark">
          <div ref={media} className="showreel-media">
            {SLIDES.map((s, i) => (
              <img key={s.key} src={s.src} alt="" className={i === index ? 'on' : ''} loading={i < 2 ? 'eager' : 'lazy'} />
            ))}
          </div>
          <div className="showreel-caption showreel-ui">
            <span className="mono">{String(index + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}</span>
            <strong>{current.project.name}</strong>
            <span className="mono">{t(lang, current.project.category)}</span>
          </div>
          <div className="showreel-thumbs showreel-ui" role="tablist" aria-label={ui.showreel}>
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
