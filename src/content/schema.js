// Skema bersama untuk semua file di content/. Dipakai oleh test (dan nanti oleh admin lokal).
import { z } from 'zod'

const text = z.object({ id: z.string(), en: z.string() })
const textRequired = z.object({ id: z.string().min(1), en: z.string() })
const url = z.union([z.literal(''), z.url()])
const media = z.union([z.literal(''), z.string().regex(/^\/media\/[a-z0-9/_.-]+\.(jpg|jpeg|png|webp|pdf)$/i)])
const slug = z.string().regex(/^[a-z0-9-]+$/)
const month = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/)

const pair = z.object({ lead: textRequired, tail: textRequired })

/** Studi kasus. Semua bagian boleh kosong; bagian kosong tidak ditampilkan. */
const story = z.object({
  problem: text,
  contribution: text,
  process: z.array(textRequired),
  decisions: z.array(textRequired),
  results: z.array(textRequired),
  reflection: text,
})

export const settingsSchema = z.object({
  name: z.string().min(1),
  shortName: z.string().min(1),
  role: textRequired,
  email: z.email(),
  whatsapp: z.string().regex(/^\d{8,15}$/),
  location: z.string(),
  timezone: z.string(),
  photo: media,
  links: z.object({ github: url, linkedin: url, instagram: url, cv: z.union([url, media]) }),
  meta: z.object({ description: textRequired }),
  // Setiap peran tepat dua kata; animasi hero hanya mengganti kata yang berbeda.
  hero: z.object({ greeting: textRequired, roles: z.array(z.string().regex(/^\S+ \S+$/)).min(2), intro: textRequired }),
  sections: z.object({
    work: pair.extend({ intro: textRequired }),
    ring: pair,
    services: pair.extend({ statement: textRequired }),
    achievements: pair.extend({ intro: textRequired }),
    stack: pair,
    journey: pair,
    contact: pair.extend({ intro: textRequired }),
  }),
  floatingCta: textRequired,
  showreel: z.array(z.object({ image: media, project: slug })).min(1),
  heroIcons: z.array(z.string().regex(/^[a-z0-9]+$/)).min(3),
})

export const projectSchema = z.object({
  id: slug,
  name: z.string().min(1),
  year: z.union([z.literal(''), z.string().regex(/^\d{4}$/)]),
  category: textRequired,
  description: textRequired,
  story,
  role: text,
  tags: z.array(z.string().min(1)),
  cover: media,
  gallery: z.array(media),
  coverAlt: text,
  illustration: z.boolean(),
  accent: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  demoUrl: url,
  repoUrl: url,
  published: z.boolean(),
})

export const serviceSchema = z.object({
  id: slug,
  title: textRequired,
  description: textRequired,
  tags: z.array(z.string().min(1)),
  projects: z.array(slug),
  published: z.boolean(),
})

export const experienceSchema = z.object({
  id: slug,
  title: textRequired,
  organization: z.string().min(1),
  description: textRequired,
  start: month,
  end: z.union([z.literal(''), month]),
  // 'education' untuk pendidikan formal, 'work' untuk organisasi/pekerjaan (default).
  kind: z.enum(['education', 'work']).optional(),
  // Opsional: id proyek dan prestasi yang ditampilkan di halaman detail /pengalaman/:id.
  projects: z.array(slug).optional(),
  achievements: z.array(slug).optional(),
  published: z.boolean(),
})

export const achievementSchema = z.object({
  id: slug,
  title: textRequired,
  issuer: textRequired,
  description: text,
  project: z.union([z.literal(''), slug]),
  story,
  image: media,
  date: z.string().regex(/^\d{4}(-(0[1-9]|1[0-2]))?$/),
  highlight: z.boolean(),
  published: z.boolean(),
})

export const schemas = {
  'settings.json': settingsSchema,
  'projects.json': z.array(projectSchema),
  'services.json': z.array(serviceSchema),
  'stack.json': z.array(z.string().min(1)),
  'experiences.json': z.array(experienceSchema),
  'achievements.json': z.array(achievementSchema),
}
