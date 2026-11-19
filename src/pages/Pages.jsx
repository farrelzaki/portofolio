import { Link } from '../lib/router.jsx'
import PageHead from '../components/PageHead.jsx'
import Hero from '../sections/Hero.jsx'
import Showreel from '../sections/Showreel.jsx'
import Work from '../sections/Work.jsx'
import Ring from '../sections/Ring.jsx'
import Services from '../sections/Services.jsx'
import Achievements from '../sections/Achievements.jsx'
import Journey from '../sections/Journey.jsx'

/** Beranda: ringkasan semua bagian, masing-masing punya tautan ke halaman lengkapnya. */
export function HomePage({ lang, ui, onOpen }) {
  return (
    <>
      <Hero lang={lang} ui={ui} />
      <Showreel lang={lang} ui={ui} />
      <Work lang={lang} ui={ui} onOpen={onOpen} />
      <Ring lang={lang} ui={ui} />
      <Services lang={lang} ui={ui} onOpen={onOpen} />
      <Achievements lang={lang} ui={ui} />
      <Journey lang={lang} ui={ui} />
    </>
  )
}

export function NotFoundPage({ ui }) {
  return (
    <section className="page page-404" data-theme="light">
      <PageHead lead="404" tail={ui.notFound} intro={ui.notFoundText}>
        <Link to="/" className="pill pill-dark">{ui.backHome}</Link>
      </PageHead>
    </section>
  )
}
