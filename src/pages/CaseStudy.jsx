import { useEffect, useRef } from 'react'
import { content, formatPeriod, t } from '../content/index.js'
import { gsap, prefersReduced } from '../lib/motion.js'
import { Link } from '../lib/router.jsx'
import Icon from '../components/Icon.jsx'

const { projects, achievements, experiences } = content
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
        // Bingkai melebar dan gambar zoom-out dalam satu timeline: keduanya selesai tepat saat
        // bingkai penuh, lalu gambar diam (tidak terus mengecil setelah bingkai terbuka).
        gsap.timeline({ scrollTrigger: { trigger: cover, start: 'top 95%', end: 'top 25%', scrub: 0.6 } })
          .fromTo(cover, { clipPath: 'inset(18% 6% 0% 6% round 18px)' }, { clipPath: 'inset(0% 0% 0% 0% round 18px)', ease: 'none' }, 0)
          .fromTo(cover.querySelector('img'), { scale: 1.18 }, { scale: 1, ease: 'none' }, 0)
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
          <span className="cs-next-title">{next.name}</span>
          <span className="cs-next-cat">{t(lang, next.category)}</span>
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

/** Halaman satu pengalaman/pendidikan: /pengalaman/:id */
export function ExperiencePage({ id, lang, ui }) {
  const root = useRef(null)
  const i = experiences.findIndex((x) => x.id === id)
  const e = experiences[i]
  useReveal(root, `${id}-${lang}`)
  if (!e) return null
  const work = (e.projects ?? []).map((pid) => projects.find((p) => p.id === pid)).filter(Boolean)
  const awards = (e.achievements ?? []).map((aid) => achievements.find((a) => a.id === aid)).filter(Boolean)
  const next = experiences[(i + 1) % experiences.length]
  const period = formatPeriod(lang, e.start, e.end)

  return (
    <article ref={root} className="cs cs-exp" data-theme="light" style={{ '--accent': '#1D4ED8' }}>
      <header className="cs-hero">
        <Link to="/pengalaman" className="cs-back cs-fade"><Icon name="left" /> {ui.nav.journey}</Link>
        <span className="cs-meta cs-fade">{e.kind === 'education' ? ui.education : ui.workExp} · {period}</span>
        <h1 className="cs-title cs-title-sm">{t(lang, e.title)}</h1>
        <p className="lede cs-fade">{t(lang, e.description)}</p>
        <dl className="cs-facts cs-fade">
          <div><dt>{ui.organization}</dt><dd>{e.organization}</dd></div>
          <div><dt>{ui.period}</dt><dd>{period}</dd></div>
        </dl>
      </header>

      {(work.length > 0 || awards.length > 0) && (
        <div className="cs-body">
          {work.length > 0 && (
            <section className="cs-sec">
              <h2 className="cs-sec-label">{ui.relatedWork}</h2>
              <div className="cs-sec-body sk-proj-list">
                {work.map((p) => (
                  <Link key={p.id} to={`/proyek/${p.id}`} className="sk-proj" style={{ '--accent': p.accent }}>
                    <span className="sk-proj-img"><img src={p.cover} alt="" loading="lazy" /></span>
                    <span className="sk-proj-text">
                      <strong>{p.name}</strong>
                      <span>{[t(lang, p.category), p.year].filter(Boolean).join(' · ')}</span>
                    </span>
                    <Icon name="right" />
                  </Link>
                ))}
              </div>
            </section>
          )}
          {awards.length > 0 && (
            <section className="cs-sec cs-award">
              <h2 className="cs-sec-label">{ui.relatedAwards}</h2>
              <div className="cs-sec-body">
                {awards.map((a) => (
                  <Link key={a.id} to={`/prestasi/${a.id}`} className="cs-award-card">
                    <img src={a.image} alt="" loading="lazy" />
                    <span>
                      <strong>{t(lang, a.title)}</strong>
                      <span className="cs-award-issuer">{t(lang, a.issuer)}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {next && next.id !== e.id && (
        <Link to={`/pengalaman/${next.id}`} className="cs-next cs-next-plain" data-theme="dark">
          <span className="cs-next-label">{ui.otherJourney} <Icon name="right" /></span>
          <span className="cs-next-title">{t(lang, next.title)}</span>
          <span className="cs-next-cat">{next.organization}</span>
        </Link>
      )}
    </article>
  )
}
