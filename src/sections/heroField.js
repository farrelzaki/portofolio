import { useEffect } from 'react'
import { TECH_ICONS } from '../content/icons.js'
import { content } from '../content/index.js'
import { finePointer, prefersReduced } from '../lib/motion.js'
import { introDone } from '../lib/intro.js'

const DARK = ['#000000', '#181717', '#0A0A0A', '#000']
const ICONS = content.settings.heroIcons.map((k) => TECH_ICONS[k]).filter(Boolean)

function isLight(hex) {
  const n = parseInt(hex.slice(1), 16)
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255]
  return 0.299 * r + 0.587 * g + 0.114 * b > 170
}

/**
 * Logo tools melayang tanpa gravitasi di hero (matter-js, dimuat saat dibutuhkan).
 * Logo turun dari atas setelah pembuka, lalu melayang pelan, memantul dari tepi dan blok teks
 * (teks tidak pernah tertutup). Kursor mendorong logo menjauh; di desktop logo bisa ditarik
 * dan dilempar. Simulasi berhenti saat hero tidak terlihat.
 */
export function useHeroField(layer, head, foot) {
  useEffect(() => {
    const root = layer.current
    if (!root || prefersReduced() || ICONS.length === 0) return
    let alive = true
    let teardown = () => {}

    const start = async () => {
      const M = (await import('matter-js')).default
      if (!alive) return
      const { Engine, Bodies, Body, Composite, Mouse, MouseConstraint, Events } = M
      const section = root.closest('section')
      const fine = finePointer()

      const build = () => {
        const base0 = root.getBoundingClientRect()
        const W = root.clientWidth
        const H = Math.min(root.clientHeight, window.innerHeight)
        const mobile = W < 700
        const count = Math.min(ICONS.length, mobile ? 9 : 16)
        const r = Math.round(Math.max(20, Math.min(W * 0.019, 32)))
        const engine = Engine.create({ gravity: { x: 0, y: 0.9 }, enableSleeping: false })
        const T = 400
        const wall = (x, y, w, h) => Bodies.rectangle(x, y, w, h, { isStatic: true, restitution: 0.9 })
        // Tepi kiri desktop dimulai setelah dock agar logo tidak masuk ke bawah tombol navigasi.
        const left = mobile ? 0 : (document.querySelector('.dock')?.getBoundingClientRect().right ?? 0) - base0.left + 12
        const walls = [wall(W / 2, H + T / 2, W + 2 * T, T), wall(left - T / 2, H / 2, T, H * 4), wall(W + T / 2, H / 2, T, H * 4)]
        const roof = wall(W / 2, -T / 2, W + 2 * T, T)
        // Blok teks sebagai rintangan tak terlihat.
        const base = root.getBoundingClientRect()
        const blocks = [head, foot].map((ref) => ref.current).filter(Boolean).map((el) => {
          const b = el.getBoundingClientRect()
          const pad = 14
          return Bodies.rectangle(b.left - base.left + b.width / 2, b.top - base.top + b.height / 2, b.width + pad * 2, b.height + pad * 2, { isStatic: true, chamfer: { radius: 24 }, restitution: 0.9 })
        })
        Composite.add(engine.world, [...walls, ...blocks])

        // Urutan acak, lalu turun bergantian dari atas layar.
        const pick = [...ICONS].sort(() => Math.random() - 0.5).slice(0, count)
        const items = pick.map((icon, i) => {
          const x = left + r + Math.random() * (W - left - 2 * r)
          const body = Bodies.circle(x, -r * 2 - i * (H / count) * 0.55, r, {
            restitution: 0.85, frictionAir: 0.025, friction: 0.02, density: 0.002,
          })
          Body.setAngle(body, (Math.random() - 0.5) * 1.2)
          const hex = DARK.includes(icon.hex) ? '#0B1220' : icon.hex
          const el = document.createElement('div')
          el.className = `float-ico${isLight(hex) ? ' light' : ''}`
          el.style.width = el.style.height = `${r * 2}px`
          el.innerHTML = `<svg viewBox="0 0 24 24"><path d="${icon.path}" fill="${hex}"/></svg>`
          el.title = icon.title
          root.appendChild(el)
          return { body, el, seed: Math.random() * 1000 }
        })
        Composite.add(engine.world, items.map((it) => it.body))

        // Setelah semua masuk: atap ditutup, gravitasi dilepas pelan sampai melayang.
        let t0 = performance.now()
        let roofed = false
        let kicked = false
        const pointer = { x: -9999, y: -9999 }
        const onMove = (e) => { const b = root.getBoundingClientRect(); pointer.x = e.clientX - b.left; pointer.y = e.clientY - b.top }
        const onLeave = () => { pointer.x = pointer.y = -9999 }
        section.addEventListener('pointermove', onMove)
        section.addEventListener('pointerleave', onLeave)

        let drag = null
        if (fine) {
          const mouse = Mouse.create(section)
          // matter-js memblokir scroll (roda mouse & sentuh); listener itu dilepas.
          section.removeEventListener('wheel', mouse.mousewheel)
          section.removeEventListener('touchmove', mouse.mousemove)
          section.removeEventListener('touchstart', mouse.mousedown)
          section.removeEventListener('touchend', mouse.mouseup)
          drag = MouseConstraint.create(engine, { mouse, constraint: { stiffness: 0.18, damping: 0.1 } })
          Composite.add(engine.world, drag)
          Events.on(drag, 'startdrag', () => section.classList.add('dragging'))
          Events.on(drag, 'enddrag', () => section.classList.remove('dragging'))
        }

        let raf = 0
        let last = performance.now()
        let running = true
        const tick = (now) => {
          raf = requestAnimationFrame(tick)
          if (!running) { last = now; return }
          const dt = Math.min(now - last, 32)
          last = now
          const age = (now - t0) / 1000
          if (!roofed && age > 1.9) { Composite.add(engine.world, roof); roofed = true }
          engine.gravity.y = age < 2 ? 0.9 : 0
          if (!kicked && age >= 2) {
            // Gravitasi dilepas: setiap logo didorong ke arah acak supaya menyebar ke seluruh hero.
            kicked = true
            for (const it of items) {
              const a = Math.random() * Math.PI * 2
              const v = 3 + Math.random() * 3
              Body.setVelocity(it.body, { x: Math.cos(a) * v, y: Math.sin(a) * v - 2 })
              Body.setAngularVelocity(it.body, (Math.random() - 0.5) * 0.08)
            }
          }
          for (const it of items) {
            const { body } = it
            // Dorongan kursor + arus pelan agar tidak pernah diam.
            const dx = body.position.x - pointer.x
            const dy = body.position.y - pointer.y
            const d = Math.hypot(dx, dy)
            if (d < 150 && d > 0.1 && drag?.body !== body) {
              const f = (1 - d / 150) * 0.0016 * body.mass
              Body.applyForce(body, body.position, { x: (dx / d) * f, y: (dy / d) * f })
            }
            if (age > 3) {
              const s = it.seed + now / 2400
              Body.applyForce(body, body.position, { x: Math.sin(s) * 0.00006 * body.mass, y: Math.cos(s * 1.3) * 0.00006 * body.mass })
            }
            const v = body.velocity
            const sp = Math.hypot(v.x, v.y)
            if (sp > 14) Body.setVelocity(body, { x: (v.x / sp) * 14, y: (v.y / sp) * 14 })
          }
          Engine.update(engine, dt)
          for (const it of items) {
            const { x, y } = it.body.position
            it.el.style.transform = `translate3d(${x - r}px, ${y - r}px, 0) rotate(${it.body.angle}rad)`
          }
        }
        raf = requestAnimationFrame(tick)

        const io = new IntersectionObserver(([e]) => { running = e.isIntersecting })
        io.observe(section)
        const onVis = () => { running = !document.hidden }
        document.addEventListener('visibilitychange', onVis)

        return () => {
          cancelAnimationFrame(raf)
          io.disconnect()
          document.removeEventListener('visibilitychange', onVis)
          section.removeEventListener('pointermove', onMove)
          section.removeEventListener('pointerleave', onLeave)
          if (drag) {
            const m = drag.mouse
            section.removeEventListener('mousemove', m.mousemove)
            section.removeEventListener('mousedown', m.mousedown)
            section.removeEventListener('mouseup', m.mouseup)
            Events.off(drag)
          }
          Composite.clear(engine.world, false)
          Engine.clear(engine)
          items.forEach((it) => it.el.remove())
          section.classList.remove('dragging')
          t0 = 0
        }
      }

      let destroy = build()
      let w = root.clientWidth
      let timer = null
      const onResize = () => {
        clearTimeout(timer)
        timer = setTimeout(() => {
          if (Math.abs(root.clientWidth - w) < 40) return
          w = root.clientWidth
          destroy(); destroy = build()
        }, 300)
      }
      window.addEventListener('resize', onResize)
      teardown = () => { clearTimeout(timer); window.removeEventListener('resize', onResize); destroy() }
    }

    introDone.then(() => { if (alive) start() })
    return () => { alive = false; teardown() }
  }, [layer, head, foot])
}
