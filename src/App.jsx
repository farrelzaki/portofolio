import { useCallback, useEffect, useState } from 'react'
import { content, t } from './content/index.js'
import { ui as UI } from './i18n.js'
import { LenisContext, ScrollTrigger, useLenisSetup } from './lib/motion.js'
import Chrome from './components/Chrome.jsx'
import Cursor from './components/Cursor.jsx'
import ProjectPanel from './components/ProjectPanel.jsx'
import Hero from './sections/Hero.jsx'
import Showreel from './sections/Showreel.jsx'
import Work from './sections/Work.jsx'
import Ring from './sections/Ring.jsx'
import Services from './sections/Services.jsx'
import Achievements from './sections/Achievements.jsx'
import Stack from './sections/Stack.jsx'
import Journey from './sections/Journey.jsx'
import Contact from './sections/Contact.jsx'

function readLang() {
  try { return localStorage.getItem('lang') === 'en' ? 'en' : 'id' } catch { return 'id' }
}

export default function App() {
  const lenis = useLenisSetup()
  const [lang, setLang] = useState(readLang)
  const [menuOpen, setMenuOpen] = useState(false)
  const [project, setProject] = useState(null)
  const ui = UI[lang]
  const close = useCallback(() => setProject(null), [])

  useEffect(() => {
    document.documentElement.lang = lang
    document.querySelector('meta[name="description"]')?.setAttribute('content', t(lang, content.settings.meta.description))
    try { localStorage.setItem('lang', lang) } catch { /* penyimpanan diblokir: abaikan */ }
    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(id)
  }, [lang])

  useEffect(() => {
    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad)
    return () => window.removeEventListener('load', onLoad)
  }, [])

  return (
    <LenisContext.Provider value={lenis}>
      <Chrome lang={lang} setLang={setLang} ui={ui} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <Cursor />
      <main>
        <Hero lang={lang} ui={ui} />
        <Showreel lang={lang} ui={ui} />
        <Work lang={lang} ui={ui} onOpen={setProject} />
        <Ring lang={lang} ui={ui} />
        <Services lang={lang} ui={ui} onOpen={setProject} />
        <Achievements lang={lang} ui={ui} />
        <Stack lang={lang} />
        <Journey lang={lang} />
      </main>
      <Contact lang={lang} ui={ui} setLang={setLang} />
      <ProjectPanel id={project} lang={lang} ui={ui} onClose={close} />
    </LenisContext.Provider>
  )
}
