import { useEffect, useRef } from 'react'
import { content, t } from '../content/index.js'
import { gsap, prefersReduced } from '../lib/motion.js'
import { Link } from '../lib/router.jsx'
import TwoTone from '../components/TwoTone.jsx'
import Icon from '../components/Icon.jsx'

const { projects, achievements } = content
const ORDER = ['problem', 'contribution', 'process', 'decisions', 'results', 'reflection']

/** Bagian studi kasus yang terisi saja, dalam urutan tetap. */
function filled(story, lang) {
  if (!story) return []
  return ORDER.filter((k) => (Array.isArray(story[k]) ? story[k].length > 0 : t(lang, story[k])))
}

function useReveal(root, key) {
  useEffect(() => {
    if (prefersReduced()) return
    const ctx = gsap.context(() => {
      gsap.from('.cs-hero .cs-fade', { y: 30, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.07, delay: 0.2 })
      const cover = root.current.querySelector('.cs-cover')
      if (cover) {
        gsap.fromTo(cover, { clipPath: 'inset(18% 6% 0% 6% round 18px)' }, {
          clipPath: 'inset(0% 0% 0% 0% round 18px)', ease: 'none',
          scrollTrigger: { trigger: cover, start: 'top 95%', end: 'top 25%', scrub: 0.6 },
        })
        gsap.fromTo(cover.querySelector('img'), { scale: 1.18 }, {
          scale: 1, ease: 'none',
          scrollTrigger: { trigger: cover, start: 'top bottom', end: 'bottom top', scrub: true },
        })
      }
      gsap.utils.toArray('.cs-sec').forEach((sec) => {
        gsap.from(sec.querySelectorAll('.cs-sec-label, .cs-sec-body > *'), {
          y: 40, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.06,
          scrollTrigger: { trigger: sec, start: 'top 82%' },
        })
      })
    }, root)
    return () => ctx.revert()
  }, [root, key])
}

/** Isi studi kasus: Masalah, Peran, Proses, Keputusan, Hasil, Refleksi. */
function Story({ story, lang, ui }) {
  const keys = filled(story, lang)
  if (keys.length === 0) return null
  return keys.map((k) => {
    const v = story[k]
    return (
      <section key={k} className={`cs-sec cs-k-${k}`}>
        <h2 className="cs-sec-label">
          {ui.story[k]}
        </h2>
        <div className="cs-sec-body">
          {!Array.isArray(v) && <p className={k === 'problem' || k === 'reflection' ? 'cs-big' : 'cs-text'}>{t(lang, v)}</p>}
          {k === 'process' && (
            <ol className="cs-steps">{v.map((x, j) => <li key={j}><span className="cs-step-n" aria-hidden="true">{j + 1}</span><p>{t(lang, x)}</p></li>)}</ol>
          )}
          {k === 'decisions' && (
            <ul className="cs-decisions">{v.map((x, j) => <li key={j}><p>{t(lang, x)}</p></li>)}</ul>
          )}
          {k === 'results' && (
            <ul className="cs-results">{v.map((x, j) => <li key={j}><i aria-hidden="true"><Icon name="check" /></i><p>{t(lang, x)}</p></li>)}</ul>
          )}
        </div>
      </section>
    )
  })
}

/** Halaman studi kasus satu projek: /proyek/:id */
export function ProjectPage({ id, lang, ui }) {
  const root = useRef(null)
  const i = projects.findIndex((x) => x.id === id)
  const p = projects[i]
  useReveal(root, `${id}-${lang}`)
  if (!p) return null
  const next = projects[(i + 1) % projects.length]
  const awards = achievements.filter((a) => a.project === p.id)
  const role = t(lang, p.role)

  return (
    <article ref={root} className="cs" data-theme="light" style={{ '--accent': p.accent }}>
      <header className="cs-hero">
        <Link to="/proyek" className="cs-back cs-fade"><Icon name="left" /> {ui.allWork.join(' ')}</Link>
        <span className="cs-meta cs-fade">{[p.year, t(lang, p.category)].filter(Boolean).join(' · ')}</span>
        <h1 className="cs-title">{p.name}</h1>
        <p className="lede cs-fade">{t(lang, p.description)}</p>
        <dl className="cs-facts cs-fade">
          {role && <div><dt>{ui.role}</dt><dd>{role}</dd></div>}
          {p.year && <div><dt>{ui.year}</dt><dd>{p.year}</dd></div>}
          <div className="cs-facts-tech"><dt>{ui.tech}</dt><dd><ul className="chips">{p.tags.map((x) => <li key={x}>{x}</li>)}</ul></dd></div>
        </dl>
        {(p.repoUrl || p.demoUrl) && (
          <div className="cs-links cs-fade">
            {p.repoUrl && <a className="pill pill-dark" href={p.repoUrl} target="_blank" rel="noreferrer">{ui.repo} <Icon name="external" /></a>}
            {p.demoUrl && <a className="pill pill-line" href={p.demoUrl} target="_blank" rel="noreferrer">{ui.demo} <Icon name="external" /></a>}
          </div>
        )}
      </header>

      <figure className="cs-cover">
        <img src={p.cover} alt={t(lang, p.coverAlt)} />
        {p.illustration && <figcaption className="cs-note">{ui.illustration}</figcaption>}
      </figure>

      <div className="cs-body">
        <Story story={p.story} lang={lang} ui={ui} />

        {awards.map((a) => (
          <section key={a.id} className="cs-sec cs-award">
            <h2 className="cs-sec-label">{ui.competition}</h2>
            <div className="cs-sec-body">
              <Link to={`/prestasi/${a.id}`} className="cs-award-card">
                <img src={a.image} alt="" loading="lazy" />
                <span>
                  <strong>{t(lang, a.title)}</strong>
                  <span className="cs-award-issuer">{t(lang, a.issuer)}</span>
                </span>
              </Link>
            </div>
          </section>
        ))}

        {p.gallery.length > 0 && (
          <div className="cs-gallery">{p.gallery.map((g) => <img key={g} src={g} alt="" loading="lazy" />)}</div>
        )}
      </div>

      {next && next.id !== p.id && (
        <Link to={`/proyek/${next.id}`} className="cs-next" style={{ '--accent': next.accent }} data-theme="dark">
          <span className="cs-next-label">{ui.nextProject} <Icon name="right" /></span>
          <TwoTone as="span" className="cs-next-title" lead={next.name} tail={t(lang, next.category)} />
          <img src={next.cover} alt="" loading="lazy" />
        </Link>
      )}
    </article>
  )
}

/** Halaman satu prestasi/lomba: /prestasi/:id */
export function AwardPage({ id, lang, ui }) {
  const root = useRef(null)
  const a = achievements.find((x) => x.id === id)
  useReveal(root, `${id}-${lang}`)
  if (!a) return null
  const p = projects.find((x) => x.id === a.project)
  const hasStory = filled(a.story, lang).length > 0

  return (
    <article ref={root} className="cs" data-theme="light" style={{ '--accent': p?.accent ?? '#1D4ED8' }}>
      <header className="cs-hero">
        <Link to="/prestasi" className="cs-back cs-fade"><Icon name="left" /> {ui.nav.achievements}</Link>
        <span className="cs-meta cs-fade">{[a.date.slice(0, 4), t(lang, a.issuer)].filter(Boolean).join(' · ')}</span>
        <h1 className="cs-title cs-title-sm">{t(lang, a.title)}</h1>
        {t(lang, a.description) && <p className="lede cs-fade">{t(lang, a.description)}</p>}
        {p && (
          <div className="cs-links cs-fade">
            <Link className="pill pill-dark" to={`/proyek/${p.id}`}>{ui.caseStudy}: {p.name} <Icon name="right" /></Link>
          </div>
        )}
      </header>

      <figure className="cs-cover cs-cert">
        <img src={a.image} alt={`${ui.certificate}: ${t(lang, a.title)}`} />
      </figure>

      {(hasStory || !p) && (
        <div className="cs-body"><Story story={a.story} lang={lang} ui={ui} /></div>
      )}
    </article>
  )
}
