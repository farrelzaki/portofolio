import { prefersReduced } from './motion.js'

/**
 * Animasi pembuka diputar setiap kali situs dimuat (bukan saat berpindah halaman di dalam
 * situs; perpindahan itu memakai tirai transisi). Komponen lain (mis. Hero) menunggu
 * `introDone` sebelum memulai animasinya sendiri, supaya tidak berjalan di balik tirai.
 */
export const PLAY_INTRO = typeof window !== 'undefined' && !prefersReduced()
let resolveIntro
export const introDone = PLAY_INTRO ? new Promise((r) => { resolveIntro = r }) : Promise.resolve()
export const finishIntro = () => resolveIntro?.()
