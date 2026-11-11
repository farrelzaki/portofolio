import { useEffect, useRef } from 'react'
import { content, t } from '../content/index.js'
import { gsap, prefersReduced, useLenis } from '../lib/motion.js'
import { Link, PAGES } from '../lib/router.jsx'
import TwoTone from '../components/TwoTone.jsx'

const { settings, stack, projects } = content

/** Footer gelap: stiker teknologi jatuh dan memantul, judul raksasa, kontak, sitemap, wordmark. */
export default function Contact({ lang, ui, setLang, asPage = false }) {
  const root = useRef(null)
  const lenis = useLenis()
  const sec = settings.sections.contact

  useEffect(() => {
    if (prefersReduced()) return
    const ctx = gsap.context(() => {
      gsap.from('.sticker', {
        y: () => -window.innerHeight * 0.7,
        rotate: () => gsap.utils.random(-90, 90),
        duration: 1.6,
        ease: 'bounce.out',
        stagger: { each: 0.07, from: 'random' },
        scrollTrigger: { trigger: root.current, start: 'top 75%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  const toTop = (e) => { e.preventDefault(); if (lenis) lenis.scrollTo(0, { duration: 1.4 }); else window.scrollTo({ top: 0 }) }
  const links = [
    settings.links.github && ['GitHub', settings.links.github],
    settings.links.linkedin && ['LinkedIn', settings.links.linkedin],
    settings.links.instagram && ['Instagram', settings.links.instagram],
    settings.links.cv && ['CV', settings.links.cv],
  ].filter(Boolean)

  return (
    <footer ref={root} className={`contact ${asPage ? 'as-page' : ''}`} id="contact" data-theme="dark">
      <div className="stickers" aria-hidden="true">
        {stack.slice(0, 12).map((s, i) => (
          <span
            key={s}
            className={`sticker tone-${['blue', 'paper', 'sky', 'ink'][i % 4]}`}
            style={{ '--x': `${4 + i * 7.9}%`, '--y': `${[18, 58, 30, 76, 12, 50, 84, 26, 64, 10, 44, 72][i]}px`, '--r': `${(i % 2 ? 1 : -1) * (5 + (i * 11) % 22)}deg` }}
          >{s}</span>
        ))}
      </div>

      <div className="contact-main">
        <TwoTone as={asPage ? 'h1' : 'h2'} className="huge" lead={t(lang, sec.lead)} tail={t(lang, sec.tail)} />
        <p className="contact-intro">{t(lang, sec.intro)}</p>
        <a className="contact-mail" href={`mailto:${settings.email}`} data-cursor={ui.sendEmail}>{settings.email}</a>
        <div className="contact-actions">
          <a className="pill pill-light" href={`mailto:${settings.email}`}>{ui.sendEmail}</a>
          <a className="pill pill-ghost" href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer">{ui.whatsapp}</a>
        </div>
      </div>

      <div className="sitemap">
        <div>
          <h3 className="mono">{ui.navigation}</h3>
          <ul>{PAGES.map(({ id, path }) => <li key={id}><Link to={path}>{ui.nav[id]}</Link></li>)}</ul>
        </div>
        <div>
          <h3 className="mono">{ui.projects}</h3>
          <ul>{projects.map((p) => <li key={p.id}><Link to={`/projek/${p.id}`}>{p.name}</Link></li>)}</ul>
        </div>
        <div>
          <h3 className="mono">{ui.contact}</h3>
          <ul>
            <li><a href={`mailto:${settings.email}`}>Email</a></li>
            <li><a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer">WhatsApp</a></li>
            {links.map(([label, href]) => <li key={label}><a href={href} target="_blank" rel="noreferrer">{label}</a></li>)}
          </ul>
        </div>
        <div>
          <h3 className="mono">{ui.language}</h3>
          <div className="lang lang-foot" role="group" aria-label={ui.language}>
            {['id', 'en'].map((l) => (
              <button key={l} type="button" className={lang === l ? 'on' : ''} aria-pressed={lang === l} onClick={() => setLang(l)}>{l.toUpperCase()}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="foot-line mono">
        <span>© 2026 {settings.name}</span>
        <span>{ui.builtWith}</span>
        <a href="#main" onClick={toTop}>{ui.backToTop} ↑</a>
      </div>
      <p className="wordmark" aria-hidden="true">{settings.shortName}</p>
    </footer>
  )
}
