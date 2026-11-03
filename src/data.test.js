import { describe, expect, it } from 'vitest'
import { achievements, experience, profile, projects, services, ui } from './data.js'

// Kumpulkan semua jalur kunci dari objek bertingkat, mis. "nav.projects".
function keys(obj, prefix = '') {
  return Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === 'object' && !Array.isArray(v) ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`],
  )
}

const filled = (v) => typeof v === 'string' && v.trim().length > 0

describe('konten dua bahasa', () => {
  it('teks antarmuka ID dan EN punya kunci yang sama', () => {
    expect(keys(ui.en).sort()).toEqual(keys(ui.id).sort())
  })

  it('setiap teks bilingual terisi di ID dan EN', () => {
    const fields = [
      ...projects.flatMap((p) => [p.cat, p.text]),
      ...services.flatMap((s) => [s.title, s.text]),
      ...experience.flatMap((e) => [e.title, e.text]),
      ...achievements.flatMap((a) => [a.title, a.meta, a.text]),
    ]
    for (const f of fields) {
      expect(filled(f.id), JSON.stringify(f)).toBe(true)
      expect(filled(f.en), JSON.stringify(f)).toBe(true)
    }
  })
})

describe('data projek', () => {
  it('id projek unik', () => {
    const ids = projects.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('projek bergambar punya gambar', () => {
    for (const p of projects.filter((p) => p.cover === 'image')) expect(p.image).toBeTruthy()
  })

  it('email profil berformat benar', () => {
    expect(profile.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
  })
})
