// Pintu masuk konten. Isi berasal dari content/*.json dan dibaca saat build (situs tetap statis).
import settings from '../../content/settings.json'
import projectsAll from '../../content/projects.json'
import servicesAll from '../../content/services.json'
import stack from '../../content/stack.json'
import experiencesAll from '../../content/experiences.json'
import achievementsAll from '../../content/achievements.json'

const published = (list) => list.filter((x) => x.published)

export const content = {
  settings,
  projects: published(projectsAll),
  services: published(servicesAll),
  stack,
  experiences: published(experiencesAll),
  achievements: published(achievementsAll),
}

/** Ambil teks sesuai bahasa; jika versi EN kosong, pakai ID. */
export function t(lang, value) {
  if (value == null) return ''
  if (typeof value === 'string') return value
  return (lang === 'en' && value.en?.trim()) ? value.en : (value.id ?? '')
}

const MONTHS = {
  id: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
}

function formatMonth(lang, ym) {
  const [y, m] = ym.split('-').map(Number)
  return `${MONTHS[lang === 'en' ? 'en' : 'id'][m - 1]} ${y}`
}

/** "2024-10" + "2025-11" → "Okt 2024 — Nov 2025"; end kosong → "… — Sekarang". */
export function formatPeriod(lang, start, end) {
  const now = lang === 'en' ? 'Present' : 'Sekarang'
  return `${formatMonth(lang, start)} — ${end ? formatMonth(lang, end) : now}`
}

/** Pecah judul menjadi bagian biasa dan bagian aksen (case-insensitive). */
export function splitAccent(title, accent) {
  if (!accent) return [title, '', '']
  const i = title.toLowerCase().indexOf(accent.toLowerCase())
  if (i < 0) return [title, '', '']
  return [title.slice(0, i), title.slice(i, i + accent.length), title.slice(i + accent.length)]
}
