import { forwardRef } from 'react'
import { useLenis } from '../lib/motion.js'

/**
 * Ajakan gulir: label kecil + garis dengan titik yang turun berulang. Ditaruh di bagian yang
 * sempat terlihat kosong (saat animasi pin berjalan) supaya tidak dikira sudah sampai ujung.
 * Klik menggulir satu layar ke bawah.
 */
const ScrollCue = forwardRef(function ScrollCue({ label, className = '' }, ref) {
  const lenis = useLenis()
  const go = () => {
    const to = window.scrollY + window.innerHeight * 0.85
    if (lenis) lenis.scrollTo(to, { duration: 1.2 })
    else window.scrollTo({ top: to, behavior: 'smooth' })
  }
  return (
    <button ref={ref} type="button" className={`cue ${className}`} onClick={go}>
      <span>{label}</span>
      <i aria-hidden="true" />
    </button>
  )
})

export default ScrollCue
