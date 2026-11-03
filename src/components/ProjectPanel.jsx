import { useEffect, useRef } from 'react'
import { content, t } from '../content/index.js'
import { useLenis } from '../lib/motion.js'

/** Panel detail projek yang muncul dari kanan. Esc / klik latar menutup; fokus dikembalikan. */
export default function ProjectPanel({ id, lang, ui, onClose }) {
  const p = content.projects.find((x) => x.id === id)
  const panel = useRef(null)
  const lastFocus = useRef(null)
  const lenis = useLenis()
  const open = !!p

  useEffect(() => {
    if (!open) return
    lastFocus.current = document.activeElement
    panel.current?.querySelector('.panel-close')?.focus({ preventScroll: true })
    lenis?.stop()
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      lenis?.start()
      lastFocus.current?.focus?.({ preventScroll: true })
    }
  }, [open, lenis, onClose])

  return (
    <>
      <div className={`scrim scrim-panel ${open ? 'show' : ''}`} onClick={onClose} aria-hidden="true" />
      <aside ref={panel} className={`ppanel ${open ? 'open' : ''}`} aria-hidden={!open} role="dialog" aria-modal="true" aria-label={p?.name} data-lenis-prevent>
        {p && (
          <>
            <button type="button" className="panel-close mono" onClick={onClose}>{ui.close} ✕</button>
            <div className="ppanel-media">
              <img src={p.cover} alt={t(lang, p.coverAlt)} />
              {p.illustration && <span className="mono ppanel-note">{ui.illustration}</span>}
            </div>
            <div className="ppanel-body">
              <span className="mono">{[p.year, t(lang, p.category)].filter(Boolean).join(' · ')}</span>
              <h2>{p.name}</h2>
              <p>{t(lang, p.description)}</p>
              <dl>
                {t(lang, p.role) && (<><dt className="mono">{ui.role}</dt><dd>{t(lang, p.role)}</dd></>)}
                <dt className="mono">{ui.tech}</dt>
                <dd><ul className="chips">{p.tags.map((x) => <li key={x}>{x}</li>)}</ul></dd>
              </dl>
              <div className="ppanel-links">
                {p.repoUrl && <a className="pill pill-dark" href={p.repoUrl} target="_blank" rel="noreferrer">{ui.repo} ↗</a>}
                {p.demoUrl && <a className="pill pill-line" href={p.demoUrl} target="_blank" rel="noreferrer">{ui.demo} ↗</a>}
              </div>
              {p.gallery.length > 0 && (
                <div className="ppanel-gallery">
                  {p.gallery.map((g) => <img key={g} src={g} alt="" loading="lazy" />)}
                </div>
              )}
            </div>
          </>
        )}
      </aside>
    </>
  )
}
