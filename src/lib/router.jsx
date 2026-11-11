/* eslint-disable react-refresh/only-export-components */
import { useSyncExternalStore } from 'react'

/**
 * Router kecil berbasis History API (tanpa dependensi). Halaman:
 * /, /projek, /projek/:id, /keahlian, /prestasi, /pengalaman, /kontak.
 * Vercel mengarahkan semua path ke index.html (vercel.json).
 */
export const PAGES = [
  { id: 'home', path: '/' },
  { id: 'work', path: '/projek' },
  { id: 'services', path: '/keahlian' },
  { id: 'achievements', path: '/prestasi' },
  { id: 'journey', path: '/pengalaman' },
  { id: 'contact', path: '/kontak' },
]
export const pathOf = (id) => PAGES.find((p) => p.id === id)?.path ?? '/'

const listeners = new Set()
const emit = () => listeners.forEach((f) => f())
function subscribe(f) {
  listeners.add(f)
  window.addEventListener('popstate', f)
  return () => { listeners.delete(f); window.removeEventListener('popstate', f) }
}

export function navigate(to, { replace = false } = {}) {
  if (to === window.location.pathname) return
  window.history[replace ? 'replaceState' : 'pushState']({}, '', to)
  emit()
}

export const usePath = () => useSyncExternalStore(subscribe, () => window.location.pathname, () => '/')

/** Mencocokkan path ke halaman. Mengembalikan { page, param } atau page 'notfound'. */
export function matchRoute(path) {
  const clean = path.replace(/\/+$/, '') || '/'
  if (clean === '/') return { page: 'home' }
  const [, first, second] = clean.split('/')
  const hit = PAGES.find((p) => p.path === `/${first}`)
  if (!hit) return { page: 'notfound' }
  if (second && hit.id !== 'work') return { page: 'notfound' }
  return { page: hit.id, param: second }
}

/** <a> biasa yang berpindah halaman tanpa memuat ulang (klik tengah/Ctrl tetap membuka tab baru). */
export function Link({ to, onClick, ...rest }) {
  const handle = (e) => {
    onClick?.(e)
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    navigate(to)
  }
  return <a href={to} onClick={handle} {...rest} />
}
