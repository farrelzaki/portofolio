import { useEffect, useRef } from 'react'
import { finePointer, prefersReduced } from '../lib/motion.js'

/**
 * Kursor kustom: titik kecil (mix-blend difference) dan label yang muncul di atas
 * elemen ber-atribut data-cursor="Teks label". Hanya untuk pointer halus (mouse).
 */
export default function Cursor() {
  const dot = useRef(null)
  const label = useRef(null)

  useEffect(() => {
    if (!finePointer()) return
    const reduce = prefersReduced()
    const pos = { x: -100, y: -100 }
    const d = { x: -100, y: -100 }
    const l = { x: -100, y: -100 }
    let raf = 0
    let current = ''

    const onMove = (e) => {
      pos.x = e.clientX
      pos.y = e.clientY
      const target = e.target.closest?.('[data-cursor]')
      const text = target?.getAttribute('data-cursor') || ''
      if (text !== current) {
        current = text
        if (label.current) {
          label.current.firstChild.textContent = text
          label.current.classList.toggle('show', !!text)
        }
        dot.current?.classList.toggle('hide', !!text)
      }
    }
    const onLeave = () => { pos.x = -100; pos.y = -100 }

    const tick = () => {
      const k = reduce ? 1 : 0.35
      const kl = reduce ? 1 : 0.16
      d.x += (pos.x - d.x) * k; d.y += (pos.y - d.y) * k
      l.x += (pos.x - l.x) * kl; l.y += (pos.y - l.y) * kl
      if (dot.current) dot.current.style.transform = `translate3d(${d.x}px, ${d.y}px, 0)`
      if (label.current) label.current.style.transform = `translate3d(${l.x + 14}px, ${l.y + 18}px, 0)`
      raf = requestAnimationFrame(tick)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <>
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
      <div ref={label} className="cursor-label" aria-hidden="true">
        <span />
        <svg viewBox="0 0 12 12" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6h8M7 3l3 3-3 3" /></svg>
      </div>
    </>
  )
}
