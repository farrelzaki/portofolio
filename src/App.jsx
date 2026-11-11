import { useCallback, useEffect, useRef, useState } from 'react'
import { content, t } from './content/index.js'
import { ui as UI } from './i18n.js'
import { gsap, LenisContext, prefersReduced, ScrollTrigger, useLenisSetup } from './lib/motion.js'
import { matchRoute, navigate, usePath } from './lib/router.jsx'
import Chrome from './components/Chrome.jsx'
import Cursor from './components/Cursor.jsx'
import ProjectPanel from './components/ProjectPanel.jsx'
import Contact from './sections/Contact.jsx'
import { AchievementsPage, ContactPage, HomePage, JourneyPage, NotFoundPage, ServicesPage, WorkPage } from './pages/Pages.jsx'

function readLang() {
  try { return localStorage.getItem('lang') === 'en' ? 'en' : 'id' } catch { return 'id' }
}

export default function App() {
  const lenis = useLenisSetup()
  const [lang, setLang] = useState(readLang)
  const [menuOpen, setMenuOpen] = useState(false)
  const [project, setProject] = useState(null)
  const ui = UI[lang]
  const route = matchRoute(usePath())
  // Halaman yang sedang tampil; tertinggal dari URL selama tirai transisi menutup layar.
  const [shown, setShown] = useState(route.page)
  const shownRef = useRef(shown)
  const curtain = useRef(null)
  const label = useRef(null)
  const page = shown
  const param = route.page === shown ? route.param : undefined

  const close = useCallback(() => setProject(null), [])
  const closeWork = useCallback(() => navigate('/projek'), [])

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

  // Pindah halaman: tirai gelap naik menutup layar, halaman diganti, lalu tirai lanjut naik keluar.
  // Timeline tidak di-kill saat efek berganti (setShown memicu efek ini lagi); navigasi baru
  // di tengah transisi cukup mengambil alih tirai.
  useEffect(() => {
    const target = route.page
    if (target === shownRef.current) return
    const swap = () => { shownRef.current = target; setProject(null); setShown(target) }
    if (prefersReduced()) { gsap.delayedCall(0, swap); return }
    gsap.killTweensOf([curtain.current, label.current])
    if (label.current) label.current.textContent = route.page === 'home' || route.page === 'notfound' ? content.settings.name : ui.nav[route.page]
    const tl = gsap.timeline()
    tl.set(curtain.current, { yPercent: 100, autoAlpha: 1 })
      .to(curtain.current, { yPercent: 0, duration: 0.55, ease: 'power3.inOut' })
      .fromTo(label.current, { yPercent: 120 }, { yPercent: 0, duration: 0.45, ease: 'expo.out' }, 0.3)
      .call(swap)
      .to(label.current, { yPercent: -120, duration: 0.35, ease: 'power3.in' }, '+=0.12')
      .to(curtain.current, { yPercent: -100, duration: 0.6, ease: 'power3.inOut' }, '<0.1')
      .set(curtain.current, { autoAlpha: 0 })
  }, [route.page, ui])

  // Halaman baru selalu mulai dari atas.
  useEffect(() => {
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true })
    window.scrollTo(0, 0)
    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(id)
  }, [page, lenis])

  useEffect(() => {
    const name = content.settings.name
    document.title = page === 'home' ? `${name} — Software Engineer` : `${page === 'notfound' ? ui.notFound : ui.nav[page]} · ${name}`
  }, [page, ui])

  const props = { lang, ui, onOpen: setProject, setLang }
  const views = {
    home: HomePage, work: WorkPage, services: ServicesPage, achievements: AchievementsPage,
    journey: JourneyPage, contact: ContactPage, notfound: NotFoundPage,
  }
  const View = views[page] ?? NotFoundPage

  return (
    <LenisContext.Provider value={lenis}>
      <Chrome lang={lang} setLang={setLang} ui={ui} menuOpen={menuOpen} setMenuOpen={setMenuOpen} page={page} />
      <Cursor />
      <main id="main" key={page}>
        <View {...props} />
      </main>
      {page !== 'contact' && <Contact lang={lang} ui={ui} setLang={setLang} />}
      <ProjectPanel id={page === 'work' ? param : project} lang={lang} ui={ui} onClose={page === 'work' ? closeWork : close} />
      <div ref={curtain} className="curtain" aria-hidden="true">
        <span className="curtain-label"><span ref={label} /></span>
      </div>
    </LenisContext.Provider>
  )
}
