import { useEffect, useRef } from 'react'
import { prefersReduced } from '../lib/motion.js'

/** Video tidak dimuat sama sekali bila pengguna mengurangi animasi atau memakai mode hemat data. */
function canPlay() {
  if (typeof window === 'undefined' || prefersReduced()) return false
  return !navigator.connection?.saveData
}

/**
 * Video demo proyek: bisu, tanpa kontrol, poster tampil lebih dulu. Berkasnya baru diunduh
 * saat pertama kali perlu diputar.
 * - mode "inview": diputar selama terlihat di layar, dijeda saat keluar layar.
 * - mode "manual": diputar selama `active` bernilai true (mis. saat kartu di-hover).
 * `loop` false + `onEnded` dipakai showreel untuk pindah slide setelah video selesai.
 */
export default function DemoVideo({ src, poster, className = '', mode = 'inview', active = true, loop = true, onEnded }) {
  const ref = useRef(null)
  const visible = useRef(false)
  const loaded = useRef(false)
  const allowed = canPlay()

  const sync = () => {
    const v = ref.current
    if (!v || !allowed) return
    const want = active && (mode === 'manual' || visible.current)
    if (want) {
      if (!loaded.current) { v.src = src; loaded.current = true }
      const p = v.play()
      if (p) p.catch(() => {})
    } else if (!v.paused) v.pause()
  }

  useEffect(() => {
    const v = ref.current
    if (!v || !allowed || mode !== 'inview') return
    const io = new IntersectionObserver(([e]) => { visible.current = e.isIntersecting; sync() }, { threshold: 0.25 })
    io.observe(v)
    return () => io.disconnect()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, allowed, src])

  // Video baru: muat ulang saat diputar berikutnya (efek ini sengaja ditulis sebelum `sync`).
  useEffect(() => { loaded.current = false }, [src])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(sync, [active, mode, allowed, src])

  return (
    <video
      ref={ref}
      className={className}
      poster={poster}
      muted
      playsInline
      loop={loop}
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
      onEnded={onEnded}
    />
  )
}
