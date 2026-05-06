/**
 * Seed Payload from the local scrape/ snapshot of hualien.cloud.
 *
 * Run after Payload schema is migrated and DB/MinIO are reachable:
 *   pnpm seed
 *
 * - Creates an initial admin user (uses ADMIN_EMAIL / ADMIN_PASSWORD env vars,
 *   defaults: admin@hualien.cloud / change-me-now)
 * - Imports 205 media items from scrape/files/* into MinIO via Payload
 * - Imports 6 pages (slug-mapped) and 1 post into the CMS
 * - Stores original WP HTML in `legacyHtml`; rewrites old image URLs to new URLs
 */

import 'dotenv/config'

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import payloadConfig from '../src/payload.config.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const SCRAPE = path.resolve(__dirname, '..', 'scrape')

interface WpRendered {
  rendered?: string
}
interface WpMedia {
  id: number
  source_url: string
  mime_type: string
  alt_text?: string
  title?: WpRendered | string
  date?: string
}
interface WpPage {
  id: number
  slug: string
  status: string
  date?: string
  title?: WpRendered | string
  content?: WpRendered | string
  excerpt?: WpRendered | string
  featured_media?: number
}

const SLUG_MAP: Record<string, string> = {
  '%e9%80%b2%e9%a7%90': 'move-in',
  '%e5%a0%b4%e5%9c%b0%e7%a7%9f%e7%94%a8': 'venue-rental',
  '%e5%a6%82%e4%bd%95%e5%89%8d%e5%be%80': 'how-to-arrive',
  cloudcoffee: 'cloudcoffee',
  home: 'home',
}
const SKIP_PAGE_SLUGS = new Set(['news'])

function rendered(v: WpRendered | string | undefined): string {
  if (!v) return ''
  if (typeof v === 'string') return v
  return v.rendered ?? ''
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&hellip;/g, '…')
}

function findLocalFile(sourceUrl: string): string | null {
  // sourceUrl: https://www.hualien.cloud/wp-content/uploads/2025/06/foo.jpg
  const m = sourceUrl.match(/\/wp-content\/uploads\/(.+)$/)
  if (!m) return null
  const local = path.join(SCRAPE, 'files', m[1])
  if (fs.existsSync(local)) return local
  return null
}

function slugify(input: string, fallback: string): string {
  const s = input
    .toLowerCase()
    .replace(/[^\w一-鿿-]+/g, '-')
    .replace(/^-+|-+$/g, '')
  if (!s) return fallback
  if (/^[\x00-\x7F]+$/.test(s)) return s
  return fallback
}

async function seed() {
  // eslint-disable-next-line no-console
  console.log('→ booting Payload')
  const payload = await getPayload({ config: payloadConfig as any })

  // 1) admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@hualien.cloud'
  const adminPassword = process.env.ADMIN_PASSWORD || 'change-me-now'
  const existingAdmin = await payload.find({
    collection: 'users',
    where: { email: { equals: adminEmail } },
    limit: 1,
  })
  if (existingAdmin.docs.length === 0) {
    await payload.create({
      collection: 'users',
      data: { email: adminEmail, password: adminPassword, name: '管理員' } as any,
    })
    console.log(`✓ admin created: ${adminEmail} (password: ${adminPassword})`)
  } else {
    console.log(`✓ admin exists: ${adminEmail}`)
  }

  // 2) media
  const mediaJson = JSON.parse(
    fs.readFileSync(path.join(SCRAPE, 'api', 'media-all.json'), 'utf8'),
  ) as WpMedia[]

  const urlMap = new Map<string, string>() // old source_url → new MinIO url
  let imported = 0
  let skipped = 0
  console.log(`→ importing ${mediaJson.length} media items`)

  for (const m of mediaJson) {
    const local = findLocalFile(m.source_url)
    if (!local) {
      skipped++
      continue
    }
    try {
      const data = fs.readFileSync(local)
      const filename = path.basename(local)
      const created = await payload.create({
        collection: 'media',
        data: {
          alt: m.alt_text || decodeEntities(rendered(m.title) || filename),
        },
        file: {
          data,
          mimetype: m.mime_type,
          name: filename,
          size: data.length,
        },
      })
      const newUrl = (created as any).url as string | undefined
      if (newUrl) urlMap.set(m.source_url, newUrl)
      imported++
      if (imported % 25 === 0) console.log(`  … ${imported}/${mediaJson.length}`)
    } catch (err: any) {
      // Skip duplicates (filename uniqueness) and continue
      if (err?.message?.includes('duplicate') || err?.code === '23505') {
        skipped++
      } else {
        console.warn(`  ! failed ${m.source_url}: ${err?.message ?? err}`)
        skipped++
      }
    }
  }
  console.log(`✓ media: ${imported} imported, ${skipped} skipped`)

  // Build a regex to rewrite old asset URLs in HTML
  function rewriteUrls(html: string): string {
    let out = html
    for (const [oldUrl, newUrl] of urlMap.entries()) {
      // also strip the query string variant
      const escaped = oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      out = out.replace(new RegExp(escaped, 'g'), newUrl)
    }
    // generic cleanup: any remaining hualien.cloud uploads URL we leave for editors to fix
    return out
  }

  // 3) pages
  const pagesJson = JSON.parse(
    fs.readFileSync(path.join(SCRAPE, 'api', 'pages.json'), 'utf8'),
  ) as WpPage[]

  let pagesCreated = 0
  for (const p of pagesJson) {
    const decodedSlug = decodeURIComponent(p.slug)
    if (SKIP_PAGE_SLUGS.has(decodedSlug)) {
      console.log(`  - skip page slug=${decodedSlug}`)
      continue
    }
    const newSlug = SLUG_MAP[p.slug] ?? slugify(decodedSlug, `page-${p.id}`)
    const title = decodeEntities(rendered(p.title)) || newSlug
    const html = rewriteUrls(decodeEntities(rendered(p.content)))

    const exists = await payload.find({
      collection: 'pages',
      where: { slug: { equals: newSlug } },
      limit: 1,
    })
    if (exists.docs.length > 0) {
      console.log(`  - page exists: ${newSlug}`)
      continue
    }

    await payload.create({
      collection: 'pages',
      data: {
        title,
        slug: newSlug,
        legacyHtml: html,
        status: p.status === 'publish' ? 'published' : 'draft',
      } as any,
    })
    pagesCreated++
    console.log(`  + page: ${newSlug} (${title})`)
  }
  console.log(`✓ pages: ${pagesCreated} created`)

  // 4) posts
  const postsJson = JSON.parse(
    fs.readFileSync(path.join(SCRAPE, 'api', 'posts.json'), 'utf8'),
  ) as WpPage[]

  let postsCreated = 0
  for (const p of postsJson) {
    const title = decodeEntities(rendered(p.title)) || `post-${p.id}`
    const newSlug = slugify(p.slug || title, `post-${p.id}`)
    const html = rewriteUrls(decodeEntities(rendered(p.content)))
    const excerpt = decodeEntities(rendered(p.excerpt)).replace(/<[^>]+>/g, '').trim().slice(0, 200)

    const exists = await payload.find({
      collection: 'posts',
      where: { slug: { equals: newSlug } },
      limit: 1,
    })
    if (exists.docs.length > 0) {
      console.log(`  - post exists: ${newSlug}`)
      continue
    }

    await payload.create({
      collection: 'posts',
      data: {
        title,
        slug: newSlug,
        excerpt,
        legacyHtml: html,
        publishedAt: p.date,
        status: p.status === 'publish' ? 'published' : 'draft',
      } as any,
    })
    postsCreated++
    console.log(`  + post: ${newSlug} (${title})`)
  }
  console.log(`✓ posts: ${postsCreated} created`)

  // 5) navigation seed (basic top-level)
  await payload.updateGlobal({
    slug: 'navigation',
    data: {
      items: [
        { label: '活動', type: 'page' as const },
        { label: '進駐', type: 'page' as const },
        { label: '場地租用', type: 'page' as const },
        { label: '如何前往', type: 'page' as const },
      ],
    } as any,
  })
  console.log('✓ navigation initialized')

  // 6) site settings defaults
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      siteName: '花蓮雲基地',
      tagline: '共創、共學、共生',
      footer: { copyright: `© ${new Date().getFullYear()} 花蓮雲基地` },
    } as any,
  })
  console.log('✓ site settings initialized')

  console.log('\n🎉 seed complete')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
