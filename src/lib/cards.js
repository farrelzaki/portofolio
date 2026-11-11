import { useEffect } from 'react'
import { gsap, prefersReduced } from './motion.js'

/** Animasi masuk + parallax kartu proyek di dalam root (dipakai beranda dan halaman Projek). */
export function useCardReveal(root, ...deps) {
  useEffect(() => {
    if (prefersReduced()) return
    const ctx = gsap.context(() => {
      // Kartu proyek: tirai clip-path terbuka dari bawah, gambar turun skala dari 1.3,
      // label menyusul. Lalu parallax halus di dalam kartu selama digulir.
      gsap.utils.toArray('.pcard').forEach((card) => {
        const img = card.querySelector('.pcard-shift')
        const label = card.querySelector('.pcard-pill')
        const tl = gsap.timeline({ scrollTrigger: { trigger: card, start: 'top 88%' } })
        tl.fromTo(card, { clipPath: 'inset(100% 0% 0% 0% round 10px)', y: 60 },
          { clipPath: 'inset(0% 0% 0% 0% round 10px)', y: 0, duration: 1.3, ease: 'expo.out', clearProps: 'clipPath' })
          .fromTo(img, { scale: 1.3 }, { scale: 1, duration: 1.6, ease: 'expo.out' }, 0)
          .fromTo(label, { yPercent: -140, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.8, ease: 'expo.out' }, 0.45)
        gsap.fromTo(card.querySelector('.pcard-media'), { yPercent: -4 }, {
          yPercent: 4, ease: 'none',
          scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true },
        })
      })
      gsap.utils.toArray('.hcard').forEach((el) => {
        gsap.from(el, { y: 80, opacity: 0, rotate: -2, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%' } })
      })
    }, root)
    return () => ctx.revert()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
