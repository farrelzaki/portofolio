import { describe, expect, it } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { schemas } from './schema.js'
import { formatPeriod, splitAccent, t } from './index.js'

const dir = path.resolve(__dirname, '../../content')
const read = (f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'))

describe('file konten valid terhadap skema', () => {
  for (const [file, schema] of Object.entries(schemas)) {
    it(file, () => {
      const r = schema.safeParse(read(file))
      expect(r.success, r.success ? '' : JSON.stringify(r.error.issues, null, 2)).toBe(true)
    })
  }

  it('tidak ada file konten tanpa skema', () => {
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json')).sort()
    expect(files).toEqual(Object.keys(schemas).sort())
  })

  it('semua file media yang dirujuk ada di public/', () => {
    const json = fs.readdirSync(dir).map((f) => fs.readFileSync(path.join(dir, f), 'utf8')).join('\n')
    const paths = [...json.matchAll(/"(\/media\/[^"]+)"/g)].map((m) => m[1])
    for (const p of paths) expect(fs.existsSync(path.resolve(__dirname, '../../public' + p)), p).toBe(true)
  })

  it('id unik di setiap daftar', () => {
    for (const f of ['projects.json', 'services.json', 'experiences.json', 'achievements.json']) {
      const ids = read(f).map((x) => x.id)
      expect(new Set(ids).size, f).toBe(ids.length)
    }
  })

  it('projek yang dirujuk kartu keahlian memang ada', () => {
    const ids = new Set(read('projects.json').map((p) => p.id))
    for (const s of read('services.json')) for (const p of s.projects) expect(ids.has(p), `${s.id} → ${p}`).toBe(true)
  })
})

describe('t()', () => {
  it('memilih bahasa dan jatuh ke ID bila EN kosong', () => {
    expect(t('en', { id: 'Halo', en: 'Hello' })).toBe('Hello')
    expect(t('id', { id: 'Halo', en: 'Hello' })).toBe('Halo')
    expect(t('en', { id: 'Halo', en: '  ' })).toBe('Halo')
    expect(t('en', 'teks biasa')).toBe('teks biasa')
    expect(t('en', undefined)).toBe('')
  })
})

describe('formatPeriod()', () => {
  it('memformat bulan per bahasa', () => {
    expect(formatPeriod('id', '2024-10', '2025-11')).toBe('Okt 2024 — Nov 2025')
    expect(formatPeriod('en', '2024-10', '2025-11')).toBe('Oct 2024 — Nov 2025')
  })
  it('end kosong berarti masih berjalan', () => {
    expect(formatPeriod('id', '2024-08', '')).toBe('Agu 2024 — Sekarang')
    expect(formatPeriod('en', '2024-08', '')).toBe('Aug 2024 — Present')
  })
})

describe('splitAccent()', () => {
  it('memisahkan kata aksen', () => {
    expect(splitAccent('Software yang bisa diandalkan', 'diandalkan')).toEqual(['Software yang bisa ', 'diandalkan', ''])
  })
  it('aksen tidak ditemukan atau kosong', () => {
    expect(splitAccent('Halo dunia', 'x')).toEqual(['Halo dunia', '', ''])
    expect(splitAccent('Halo dunia', '')).toEqual(['Halo dunia', '', ''])
  })
})
