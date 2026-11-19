import { useEffect, useRef } from 'react'
import { gsap, prefersReduced } from '../lib/motion.js'
import TwoTone from './TwoTone.jsx'

/** Kepala halaman sederhana: judul dua warna, intro, slot aksi (dipakai halaman 404). */
export default function PageHead({ lead, tail, intro, children, theme = 'light' }) {
  const ref = useRef(null)
  useEffect(() => {
    if (prefersReduced()) return
    const tw = gsap.from(ref.current.querySelectorAll('.phead-fade'), { y: 24, opacity: 0, duration: 0.8, ease: 'expo.out', stagger: 0.06, delay: 0.25 })
    return () => tw.kill()
  }, [])
  return (
    <header ref={ref} className="phead" data-theme={theme}>
      <TwoTone as="h1" className="phead-title" lead={lead} tail={tail} />
      {intro && <p className="lede phead-fade">{intro}</p>}
      {children && <div className="phead-actions phead-fade">{children}</div>}
    </header>
  )
}
