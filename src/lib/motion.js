import { createContext, useContext, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }

const query = (q) => typeof window !== 'undefined' && window.matchMedia(q).matches
export const prefersReduced = () => query('(prefers-reduced-motion: reduce)')
export const finePointer = () => query('(hover: hover) and (pointer: fine)')

/** Status media query yang ikut berubah saat jendela diubah. */
export function useMedia(q) {
  const [match, setMatch] = useState(() => query(q))
  useEffect(() => {
    const m = window.matchMedia(q)
    const on = () => setMatch(m.matches)
    on()
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [q])
  return match
}

export const LenisContext = createContext(null)
export const useLenis = () => useContext(LenisContext)

/** Smooth scroll Lenis yang disinkronkan dengan ticker GSAP dan ScrollTrigger. */
export function useLenisSetup() {
  const [lenis] = useState(() => (typeof window === 'undefined' || prefersReduced() ? null : new Lenis({ lerp: 0.1 })))
  useEffect(() => {
    if (!lenis) return
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [lenis])
  return lenis
}

/** Gulir ke elemen (pakai Lenis bila aktif). */
export function scrollToTarget(lenis, target) {
  const el = typeof target === 'string' ? document.querySelector(target) : target
  if (!el) return
  if (lenis) lenis.scrollTo(el, { duration: 1.4 })
  else el.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth' })
}
