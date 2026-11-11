import { useEffect, useRef } from 'react'
import { gsap, prefersReduced } from '../lib/motion.js'
import TwoTone from './TwoTone.jsx'

/** Kepala halaman: nomor + nama halaman (mono), judul dua warna raksasa, intro, slot aksi. */
export default function PageHead({ index, label, lead, tail, intro, count, children, theme = 'light' }) {
  const ref = useRef(null)
  useEffect(() => {
    if (prefersReduced()) return
    const tw = gsap.from(ref.current.querySelectorAll('.phead-fade'), { y: 24, opacity: 0, duration: 0.8, ease: 'expo.out', stagger: 0.06, delay: 0.25 })
    return () => tw.kill()
  }, [])
  return (
    <header ref={ref} className="phead" data-theme={theme}>
      <div className="phead-top mono phead-fade">
        <span>({String(index).padStart(2, '0')})</span>
        <span>{label}</span>
        {count != null && <span>{count}</span>}
      </div>
      <TwoTone as="h1" className="phead-title" lead={lead} tail={tail} />
      {intro && <p className="lede phead-fade">{intro}</p>}
      {children && <div className="phead-actions phead-fade">{children}</div>}
    </header>
  )
}
