import { prefersReduced } from './motion.js'

/**
 * Animasi pembuka hanya diputar sekali per sesi browser. Komponen lain (mis. Hero) menunggu
 * `introDone` sebelum memulai animasinya sendiri, supaya tidak berjalan di balik tirai.
 */
function shouldPlay() {
  if (typeof window === 'undefined' || prefersReduced()) return false
  try {
    if (sessionStorage.getItem('intro-seen')) return false
    sessionStorage.setItem('intro-seen', '1')
  } catch { /* penyimpanan diblokir: tetap putar */ }
  return true
}

export const PLAY_INTRO = shouldPlay()
let resolveIntro
export const introDone = PLAY_INTRO ? new Promise((r) => { resolveIntro = r }) : Promise.resolve()
export const finishIntro = () => resolveIntro?.()
