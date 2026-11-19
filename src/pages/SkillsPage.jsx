import { useEffect, useRef, useState } from 'react'
import { content, t } from '../content/index.js'
import { TECH_ICONS } from '../content/icons.js'
import { finePointer, gsap, prefersReduced } from '../lib/motion.js'
import { Link } from '../lib/router.jsx'
import Icon from '../components/Icon.jsx'
import './pages.css'

const { services, stack, projects, settings } = content
const byId = Object.fromEntries(projects.map((p) => [p.id, p]))

// Semua tools: stack di content/stack.json + ikon tools di settings.heroIcons, tanpa duplikat.
const ALIAS = { gemini: 'googlegemini', 'next.js': 'nextdotjs' }
const byTitle = Object.fromEntries(Object.entries(TECH_ICONS).map(([k, v]) => [v.title.toLowerCase(), k]))
const TOOLS = (() => {
  const out = []
  const seen = new Set()
  const add = (name, key) => {
    const id = key || byTitle[name.toLowerCase()] || ALIAS[name.toLowerCase()]
    const icon = id ? TECH_ICONS[id] : null
    const label = icon?.title ?? name
    if (seen.has(label.toLowerCase())) return
    seen.add(label.toLowerCase())
    out.push({ label, icon })
  }
  stack.forEach((s) => add(s))
  settings.heroIcons.forEach((k) => TECH_ICONS[k] && add(TECH_ICONS[k].title, k))
  return out
})()

/** Pernyataan besar yang menyala per kata saat digulir (ref. locomotive.ca/en/about). */
function Statement({ lang }) {
  const root = useRef(null)
  const words = t(lang, settings.sections.services.statement).split(' ')
  useEffect(() => {
    if (prefersReduced()) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.sk-word', { opacity: 0.14 }, {
        opacity: 1, ease: 'none', stagger: 0.1,
        scrollTrigger: { trigger: root.current, start: 'top 70%', end: 'bottom 45%', scrub: true },
      })
    }, root)
    return () => ctx.revert()
  }, [lang])
  return (
    <section ref={root} className="sk-hero" data-theme="light">
      <h1 className="sk-statement" aria-label={words.join(' ')}>
        {words.map((w, i) => <span key={i} className="sk-word" aria-hidden="true">{w} </span>)}
      </h1>
    </section>
  )
}

/** Daftar keahlian bernomor yang membuka seperti akordeon (ref. daftar Capabilities Locomotive). */
function Capabilities({ lang, ui }) {
  const root = useRef(null)
  const [open, setOpen] = useState(0)
  useEffect(() => {
    if (prefersReduced()) return
    const ctx = gsap.context(() => {
      gsap.from('.sk-row', { y: 60, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: root.current, start: 'top 78%' } })
    }, root)
    return () => ctx.revert()
  }, [])
  return (
    <section ref={root} className="sk-caps" data-theme="light">
      <h2 className="sk-label">{ui.services}</h2>
      <ol>
        {services.map((s, i) => {
          const on = open === i
          return (
            <li key={s.id} className={`sk-row ${on ? 'on' : ''}`}>
              <button type="button" className="sk-row-head" aria-expanded={on} aria-controls={`sk-${s.id}`} onClick={() => setOpen(on ? -1 : i)} onMouseEnter={() => finePointer() && setOpen(i)}>
                <span className="sk-row-title">{t(lang, s.title)}</span>
                <i aria-hidden="true"><Icon name="plus" /></i>
              </button>
              <div id={`sk-${s.id}`} className="sk-row-body" role="region">
                <div>
                  <p>{t(lang, s.description)}</p>
                  <ul className="sk-chips">{s.tags.map((x) => <li key={x}>{x}</li>)}</ul>
                  <div className="sk-related">
                    <span className="sk-related-label">{ui.related}</span>
                    {s.projects.map((pid) => byId[pid] && (
                      <Link key={pid} to={`/proyek/${pid}`} tabIndex={on ? 0 : -1} style={{ '--accent': byId[pid].accent }}>
                        <img src={byId[pid].cover} alt="" loading="lazy" />
                        <span>{byId[pid].name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

/** Grid tools gelap dengan sorotan yang mengikuti kursor (ref. grid logo basement.studio). */
function Toolbox({ ui }) {
  const root = useRef(null)
  const grid = useRef(null)
  useEffect(() => {
    if (prefersReduced()) return
    const ctx = gsap.context(() => {
      gsap.from('.sk-tool', {
        opacity: 0, scale: 0.92, duration: 0.7, ease: 'expo.out',
        stagger: { each: 0.03, grid: 'auto', from: 'start' },
        scrollTrigger: { trigger: grid.current, start: 'top 80%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])
  const onMove = (e) => {
    const r = grid.current.getBoundingClientRect()
    grid.current.style.setProperty('--sx', `${e.clientX - r.left}px`)
    grid.current.style.setProperty('--sy', `${e.clientY - r.top}px`)
  }
  return (
    <section ref={root} className="sk-tools" data-theme="dark">
      <header>
        <h2 className="sk-label">{ui.stack}</h2>
        <span className="sk-tools-count">{String(TOOLS.length).padStart(2, '0')}</span>
      </header>
      <ul ref={grid} className="sk-grid" onPointerMove={finePointer() ? onMove : undefined}>
        {TOOLS.map(({ label, icon }) => (
          <li key={label} className="sk-tool" style={{ '--brand': icon?.hex ?? '#2563EB' }}>
            {icon
              ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d={icon.path} /></svg>
              : <b aria-hidden="true">{label.replace(/[^A-Za-z]/g, '').slice(0, 2)}</b>}
            <span>{label}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default function SkillsPage({ lang, ui }) {
  return (
    <>
      <Statement lang={lang} />
      <Capabilities lang={lang} ui={ui} />
      <Toolbox ui={ui} />
    </>
  )
}
