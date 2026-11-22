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

/** Kata kunci tool untuk dicocokkan dengan tag proyek ("Google Gemini" -> "gemini", "Next.js" -> "next"). */
const keyOf = (label) => label.toLowerCase().replace(/^google /, '').split(/[\s.]/)[0]
const matches = (label) => {
  const k = keyOf(label)
  return projects.filter((p) => p.tags.some((tag) => {
    const t2 = tag.toLowerCase()
    return t2.startsWith(k) && !/[a-z]/.test(t2.charAt(k.length))
  }))
}

/** Baris proyek kecil: gambar, nama, kategori & tahun, panah. */
function ProjectRow({ p, lang, tabIndex }) {
  return (
    <Link to={`/proyek/${p.id}`} className="sk-proj" tabIndex={tabIndex} style={{ '--accent': p.accent }}>
      <span className="sk-proj-img"><img src={p.cover} alt="" loading="lazy" /></span>
      <span className="sk-proj-text">
        <strong>{p.name}</strong>
        <span>{[t(lang, p.category), p.year].filter(Boolean).join(' · ')}</span>
      </span>
      <Icon name="right" />
    </Link>
  )
}

/** Keahlian sebagai dropdown; setiap keahlian membuka daftar proyek yang memakainya. */
function Capabilities({ lang, ui }) {
  const root = useRef(null)
  const [open, setOpen] = useState(-1)
  useEffect(() => {
    if (prefersReduced()) return
    const ctx = gsap.context(() => {
      gsap.from('.sk-title > span', { yPercent: 105, duration: 1, ease: 'expo.out', stagger: 0.08, delay: 0.2 })
      gsap.from('.sk-row', { y: 50, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.07, delay: 0.35 })
    }, root)
    return () => ctx.revert()
  }, [lang])
  return (
    <section ref={root} className="sk-caps" data-theme="light">
      <header className="sk-head">
        <h1 className="sk-title"><span>{ui.nav.services}</span></h1>
        <p>{ui.skillsHint}</p>
      </header>
      <ol>
        {services.map((s, i) => {
          const on = open === i
          const list = s.projects.map((pid) => byId[pid]).filter(Boolean)
          return (
            <li key={s.id} className={`sk-row ${on ? 'on' : ''}`}>
              <button type="button" className="sk-row-head" aria-expanded={on} aria-controls={`sk-${s.id}`} onClick={() => setOpen(on ? -1 : i)}>
                <span className="sk-row-title">{t(lang, s.title)}</span>
                <span className="sk-row-count">{list.length} {list.length === 1 ? ui.projectWord : ui.projectsWord}</span>
                <i aria-hidden="true"><Icon name="plus" /></i>
              </button>
              <div id={`sk-${s.id}`} className="sk-row-body" role="region">
                <div>
                  <div className="sk-row-info">
                    <p>{t(lang, s.description)}</p>
                    <ul className="sk-chips">{s.tags.map((x) => <li key={x}>{x}</li>)}</ul>
                  </div>
                  <div className="sk-proj-list">
                    {list.map((p) => <ProjectRow key={p.id} p={p} lang={lang} tabIndex={on ? 0 : -1} />)}
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

/** Grid tools gelap dengan sorotan kursor; tool yang dipakai di proyek bisa dipilih untuk menyaring. */
function Toolbox({ lang, ui }) {
  const root = useRef(null)
  const grid = useRef(null)
  const [pick, setPick] = useState(null)
  useEffect(() => {
    if (prefersReduced()) return
    const ctx = gsap.context(() => {
      gsap.from('.sk-tool', {
        opacity: 0, scale: 0.92, duration: 0.7, ease: 'expo.out',
        stagger: { each: 0.025, from: 'start' },
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
  const picked = pick ? matches(pick) : []
  return (
    <section ref={root} className="sk-tools" data-theme="dark">
      <header>
        <h2>{ui.stackTitle}</h2>
        <p>{ui.toolsHint}</p>
      </header>
      <ul ref={grid} className="sk-grid" onPointerMove={finePointer() ? onMove : undefined}>
        {TOOLS.map(({ label, icon }) => {
          const n = matches(label).length
          const inner = (
            <>
              {icon
                ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d={icon.path} /></svg>
                : <b aria-hidden="true">{label.replace(/[^A-Za-z]/g, '').slice(0, 2)}</b>}
              <span>{label}</span>
              {n > 0 && <em>{n}</em>}
            </>
          )
          return (
            <li key={label} className={`sk-tool ${n ? 'has' : ''} ${pick === label ? 'on' : ''}`} style={{ '--brand': icon?.hex ?? '#2563EB' }}>
              {n ? <button type="button" aria-pressed={pick === label} onClick={() => setPick(pick === label ? null : label)}>{inner}</button> : <div>{inner}</div>}
            </li>
          )
        })}
      </ul>
      <div className={`sk-pick ${pick ? 'show' : ''}`} aria-live="polite">
        {pick && (
          <>
            <p><strong>{pick}</strong> {ui.usedIn} {picked.length} {picked.length === 1 ? ui.projectWord : ui.projectsWord}</p>
            <div className="sk-proj-list dark">{picked.map((p) => <ProjectRow key={p.id} p={p} lang={lang} />)}</div>
          </>
        )}
      </div>
    </section>
  )
}

export default function SkillsPage({ lang, ui }) {
  return (
    <>
      <Capabilities lang={lang} ui={ui} />
      <Toolbox lang={lang} ui={ui} />
    </>
  )
}
