import { useEffect, useRef } from 'react'
import { gsap, prefersReduced } from '../lib/motion.js'

/**
 * Judul dua warna (bagian depan tinta, bagian belakang abu) dengan kata-kata yang naik
 * satu per satu saat masuk layar.
 */
export default function TwoTone({ as: Tag = 'h2', lead, tail, className = '', breakLine = true }) {
  const ref = useRef(null)

  useEffect(() => {
    if (prefersReduced()) return
    const words = ref.current.querySelectorAll('.w > span')
    const tw = gsap.from(words, {
      yPercent: 110, duration: 1, ease: 'expo.out', stagger: 0.05,
      scrollTrigger: { trigger: ref.current, start: 'top 85%' },
    })
    return () => { tw.scrollTrigger?.kill(); tw.kill() }
  }, [lead, tail])

  const split = (str, cls) => str.split(/\s+/).filter(Boolean).flatMap((w, i) => [
    i > 0 ? ' ' : null,
    <span key={cls + i} className={`w ${cls}`}><span>{w}</span></span>,
  ])

  return (
    <Tag ref={ref} className={`twotone ${className}`} aria-label={`${lead} ${tail}`}>
      <span aria-hidden="true">
        {split(lead, 'lead')}
        {breakLine ? <br /> : ' '}
        {split(tail, 'tail')}
      </span>
    </Tag>
  )
}
