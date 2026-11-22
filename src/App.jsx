import { useEffect, useRef, useState } from 'react'
import { content, t } from './content/index.js'
import { ui as UI } from './i18n.js'
import { gsap, LenisContext, prefersReduced, ScrollTrigger, useLenisSetup } from './lib/motion.js'
import { matchRoute, navigate, usePath } from './lib/router.jsx'
import Chrome from './components/Chrome.jsx'
import Cursor from './components/Cursor.jsx'
import Intro from './components/Intro.jsx'
import Contact, { FooterLite } from './sections/Contact.jsx'
import { HomePage, NotFoundPage } from './pages/Pages.jsx'
import WorkPage from './pages/WorkPage.jsx'
import SkillsPage from './pages/SkillsPage.jsx'
import AwardsPage from './pages/AwardsPage.jsx'
import JourneyPage from './pages/JourneyPage.jsx'
import ContactPage from './pages/ContactPage.jsx'
import { AwardPage, ExperiencePage, ProjectPage } from './pages/CaseStudy.jsx'

const projectById = Object.fromEntries(content.projects.map((p) => [p.id, p]))
const awardById = Object.fromEntries(content.achievements.map((a) => [a.id, a]))
const expById = Object.fromEntries(content.experiences.map((e) => [e.id, e]))
const DETAIL = { work: projectById, achievements: awardById, journey: expById }

/** Kunci tampilan: halaman + id (mis. 'work/sudepi'). Id yang tidak dikenal menjadi 404. */
function keyOf(route) {
  if (!route.param) return route.page
  const known = DETAIL[route.page]?.[route.param]
  return known ? `${route.page}/${route.param}` : 'notfound'
}
const openProject = (id) => navigate(`/proyek/${id}`)

function readLang() {
  try { return localStorage.getItem('lang') === 'en' ? 'en' : 'id' } catch { return 'id' }
}

export default function App() {
  const lenis = useLenisSetup()
  const [lang, setLang] = useState(readLang)
  const [menuOpen, setMenuOpen] = useState(false)
  const ui = UI[lang]
  const target = keyOf(matchRoute(usePath()))
  // Tampilan yang sedang tampil; tertinggal dari URL selama tirai transisi menutup layar.
  const [shown, setShown] = useState(target)
  const shownRef = useRef(shown)
  const curtain = useRef(null)
  const label = useRef(null)
  const bar = useRef(null)
  const [page, param] = shown.split('/')

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

  /** Ganti teks tirai; kata peran tampil redup, nama tujuan tampil terang. */
  const say = (text, final = false) => {
    if (!label.current) return
    label.current.textContent = text
    label.current.classList.toggle('final', final)
  }

  // Pindah halaman: tirai gelap naik menutup layar, halaman diganti, lalu tirai lanjut naik keluar.
  // Timeline tidak di-kill saat efek berganti (setShown memicu efek ini lagi); navigasi baru
  // di tengah transisi cukup mengambil alih tirai.
  useEffect(() => {
    if (target === shownRef.current) return
    const swap = () => { shownRef.current = target; setShown(target) }
    if (prefersReduced()) { gsap.delayedCall(0, swap); return }
    gsap.killTweensOf([curtain.current, label.current, bar.current])
    const [tp, tid] = target.split('/')
    const final = tid
      ? (tp === 'work' ? projectById[tid].name : tp === 'journey' ? t(lang, expById[tid].title) : ui.nav[tp])
      : (tp === 'home' || tp === 'notfound' ? content.settings.shortName : ui.nav[tp])
    const words = ui.loaderWords
    const step = 0.16
    const tl = gsap.timeline()
    tl.set(curtain.current, { yPercent: 100, autoAlpha: 1 })
      .set(bar.current, { scaleX: 0, transformOrigin: '0% 50%' })
      .to(curtain.current, { yPercent: 0, duration: 0.5, ease: 'power3.inOut' })
      .to(bar.current, { scaleX: 1, duration: step * words.length + 0.35, ease: 'power2.inOut' }, 0.3)
    // Kata-kata peran berkedip cepat, lalu berhenti di nama halaman tujuan.
    words.forEach((w, i) => {
      tl.call(() => say(w), null, 0.3 + i * step)
        .fromTo(label.current, { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: step, ease: 'power2.out' }, 0.3 + i * step)
    })
    tl.call(() => say(final, true), null, 0.3 + words.length * step)
      .fromTo(label.current, { yPercent: 110, opacity: 1 }, { yPercent: 0, duration: 0.5, ease: 'expo.out' }, '<')
      .call(swap)
      .to(label.current, { yPercent: -120, duration: 0.35, ease: 'power3.in' }, '+=0.12')
      .to(bar.current, { scaleX: 0, transformOrigin: '100% 50%', duration: 0.35, ease: 'power3.in' }, '<')
      .to(curtain.current, { yPercent: -100, duration: 0.6, ease: 'power3.inOut' }, '<0.1')
      .set(curtain.current, { autoAlpha: 0 })
  }, [target, ui, lang])

  // Halaman baru selalu mulai dari atas.
  useEffect(() => {
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true })
    window.scrollTo(0, 0)
    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(id)
  }, [shown, lenis])

  useEffect(() => {
    const name = content.settings.name
    const sub = param && (page === 'work' ? projectById[param]?.name : t(lang, (page === 'journey' ? expById : awardById)[param]?.title))
    document.title = page === 'home'
      ? `${name} — Software Engineer`
      : `${sub || (page === 'notfound' ? ui.notFound : ui.nav[page])} · ${name}`
  }, [page, param, ui, lang])

  const props = { lang, ui, onOpen: openProject, setLang, id: param }
  const views = {
    home: HomePage, work: WorkPage, services: SkillsPage, achievements: AwardsPage,
    journey: JourneyPage, contact: ContactPage, notfound: NotFoundPage,
  }
  const details = { work: ProjectPage, achievements: AwardPage, journey: ExperiencePage }
  const View = param ? (details[page] ?? NotFoundPage) : (views[page] ?? NotFoundPage)

  return (
    <LenisContext.Provider value={lenis}>
      <Chrome lang={lang} setLang={setLang} ui={ui} menuOpen={menuOpen} setMenuOpen={setMenuOpen} page={page} />
      <Cursor />
      <main id="main" key={shown}>
        <View {...props} />
      </main>
      {page === 'home' ? <Contact lang={lang} ui={ui} setLang={setLang} /> : <FooterLite lang={lang} ui={ui} setLang={setLang} page={page} />}
      <Intro words={ui.loaderWords} />
      <div ref={curtain} className="curtain" aria-hidden="true">
        <span className="curtain-label"><span ref={label} /></span>
        <span className="curtain-bar"><i ref={bar} /></span>
      </div>
    </LenisContext.Provider>
  )
}
