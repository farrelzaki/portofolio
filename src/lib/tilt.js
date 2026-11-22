import { useEffect } from 'react'
import { finePointer, prefersReduced } from './motion.js'

/**
 * Kartu yang terasa nyata saat di-hover: elemen `selector` di dalam `ref` mendapat variabel
 * --rx/--ry (miring mengikuti kursor) dan --gx/--gy (posisi kilau). CSS yang mengatur
 * gerak maju-mundurnya; tanpa kursor halus atau dengan reduced motion, hook ini tidak aktif.
 */
export function useTilt(ref, selector) {
  useEffect(() => {
    const root = ref.current
    if (!root || !finePointer() || prefersReduced()) return
    const move = (e) => {
      const el = e.target.closest(selector)
      if (!el || !root.contains(el)) return
      const r = el.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width
      const py = (e.clientY - r.top) / r.height
      el.style.setProperty('--ry', `${(px - 0.5) * 14}deg`)
      el.style.setProperty('--rx', `${(0.5 - py) * 12}deg`)
      el.style.setProperty('--gx', `${px * 100}%`)
      el.style.setProperty('--gy', `${py * 100}%`)
    }
    const out = (e) => {
      const el = e.target.closest(selector)
      if (!el || el.contains(e.relatedTarget)) return
      ;['--rx', '--ry'].forEach((k) => el.style.removeProperty(k))
    }
    root.addEventListener('pointermove', move)
    root.addEventListener('pointerout', out)
    return () => { root.removeEventListener('pointermove', move); root.removeEventListener('pointerout', out) }
  }, [ref, selector])
}
