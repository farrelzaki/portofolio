// Skema bersama untuk semua file di content/. Dipakai oleh test (dan nanti oleh admin lokal).
import { z } from 'zod'

const text = z.object({ id: z.string(), en: z.string() })
const textRequired = z.object({ id: z.string().min(1), en: z.string() })
const url = z.union([z.literal(''), z.url()])
const media = z.union([z.literal(''), z.string().regex(/^\/media\/[a-z0-9/_.-]+\.(jpg|jpeg|png|webp|pdf)$/i)])
const slug = z.string().regex(/^[a-z0-9-]+$/)
const month = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/)

const pair = z.object({ lead: textRequired, tail: textRequired })

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
  hero: z.object({ title: textRequired, accent: text, intro: textRequired, cta: textRequired }),
  sections: z.object({
    work: pair.extend({ intro: textRequired }),
    ring: pair,
    services: pair,
    achievements: pair,
    stack: pair,
    journey: pair,
    contact: pair.extend({ intro: textRequired }),
  }),
  floatingCta: textRequired,
  showreel: z.array(z.object({ image: media, project: slug })).min(1),
})

export const projectSchema = z.object({
  id: slug,
  name: z.string().min(1),
  year: z.union([z.literal(''), z.string().regex(/^\d{4}$/)]),
  category: textRequired,
  description: textRequired,
  role: text,
  tags: z.array(z.string().min(1)),
  cover: media,
  gallery: z.array(media),
  coverAlt: text,
  illustration: z.boolean(),
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
  published: z.boolean(),
})

export const achievementSchema = z.object({
  id: slug,
  title: textRequired,
  issuer: textRequired,
  description: text,
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
