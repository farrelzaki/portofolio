import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from '../lib/motion.js'
import { finishIntro, PLAY_INTRO } from '../lib/intro.js'

// Kalimat pembuka; kata terakhir berwarna biru muda.
const TITLE = 'Welcome to my portfolio'.split(' ')

/**
 * Pembuka situs, diputar setiap kali situs dimuat:
 * 1. Sapaan "Welcome to my portfolio" naik huruf demi huruf di layar gelap, peran-peran berganti cepat di bawahnya
 *    dan garis progres terisi.
 * 2. Sapaan naik keluar, lalu tiga lapis tirai (gelap, biru, biru muda) terangkat bergantian
 *    sehingga beranda tersingkap dengan kesan berlapis.
 * Beranda mulai beranimasi (finishIntro) saat lapisan terakhir sedang terangkat.
 */
export default function Intro({ words }) {
  const root = useRef(null)
  const role = useRef(null)
  const [done, setDone] = useState(!PLAY_INTRO)

  useLayoutEffect(() => {
    if (!PLAY_INTRO) return
    const q = gsap.utils.selector(root)
    const say = (w) => { if (role.current) role.current.textContent = w }
    document.documentElement.classList.add('intro-lock')
    const step = 0.28
    const tl = gsap.timeline({
      delay: 0.15,
      onComplete: () => { document.documentElement.classList.remove('intro-lock'); setDone(true) },
    })
    tl.from(q('.intro-ch'), { yPercent: 110, duration: 1, ease: 'expo.out', stagger: 0.035 }, 0)
      .fromTo(q('.intro-bar i'), { scaleX: 0 }, { scaleX: 1, duration: step * words.length + 0.4, ease: 'power2.inOut' }, 0.3)
    words.forEach((w, i) => {
      tl.call(() => say(w), null, 0.35 + i * step)
        .fromTo(role.current, { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.24, ease: 'power3.out' }, 0.35 + i * step)
    })
    const out = 0.35 + words.length * step + 0.25
    tl.to(q('.intro-role, .intro-bar'), { opacity: 0, duration: 0.3, ease: 'power2.out' }, out)
      .to(q('.intro-ch'), { yPercent: -110, duration: 0.6, ease: 'power3.inOut', stagger: 0.02 }, out)
      .to(q('.intro-layer'), { yPercent: -100, duration: 1.05, ease: 'expo.inOut', stagger: { each: 0.09, from: 'end' } }, out + 0.45)
      .call(finishIntro, null, out + 1.05)
    return () => { tl.kill(); document.documentElement.classList.remove('intro-lock'); finishIntro() }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (done) return null
  return (
    <div ref={root} className="intro" aria-hidden="true">
      {/* Urutan DOM: lapisan bawah dulu, yang paling atas (gelap, berisi teks) terakhir. */}
      <span className="intro-layer l-sky" />
      <span className="intro-layer l-blue" />
      <div className="intro-layer l-ink">
        <p className="intro-name">
          {TITLE.map((part, k) => (
            <span key={k} className="intro-word">
              {part.split('').map((c, i) => <span key={i} className="intro-ch">{c}</span>)}
            </span>
          ))}
        </p>
        <span className="intro-role"><span ref={role}>{words[0]}</span></span>
        <span className="intro-bar"><i /></span>
      </div>
    </div>
  )
}
