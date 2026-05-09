/**
 * Upload selected photos from `花蓮雲基地 — 全球行銷策略簡報 0505.pdf` (staged
 * in `public/marketing/*.png`) to Payload Media, then attach them as hero
 * images to the pages that currently have no hero photo (cloudcoffee,
 * how-to-arrive, friendly-shops). Also embeds the Qingshui Cliffs image as a
 * lead-in figure on the friendly-shops page body.
 *
 *   pnpm tsx scripts/seed-marketing-photos.ts
 *
 * Idempotent: re-uploads are deduped by filename (Payload returns the existing
 * doc).
 */

import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { getPayload } from 'payload'
import payloadConfig from '../src/payload.config.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const SRC = path.join(ROOT, 'public', 'marketing')

interface PhotoEntry {
  src: string // png filename in public/marketing
  outName: string // saved filename in Media
  altZh: string
  altEn: string
  width?: number // resize width cap
}

const PHOTOS: PhotoEntry[] = [
  {
    src: 'qingshui-cliffs.png',
    outName: 'qingshui-cliffs-hualien.jpg',
    altZh: '清水斷崖，花蓮東海岸的標誌風景',
    altEn: 'Qingshui Cliffs, Hualien east coast',
    width: 1800,
  },
  {
    src: 'workshop-meetup.png',
    outName: 'workshop-meetup-hualien.jpg',
    altZh: '花蓮雲基地 33 小聚／工作坊現場',
    altEn: 'Workshop and 33 Meetup at Hualien Cloud Hub',
    width: 1800,
  },
  {
    src: 'nomad-portrait.png',
    outName: 'nomad-portrait-hualien.jpg',
    altZh: '在花蓮的數位遊牧者',
    altEn: 'A digital nomad in Hualien',
    width: 1200,
  },
  {
    src: 'coffee-bar.png',
    outName: 'cloud-coffee-bar.jpg',
    altZh: 'Cloud Coffee 吧台與長桌',
    altEn: 'Cloud Coffee — bar and long table',
    width: 1600,
  },
  {
    src: 'local-host.png',
    outName: 'hualien-local-host.jpg',
    altZh: '在地夥伴',
    altEn: 'Local host in Hualien',
    width: 1200,
  },
]

async function uploadOrFind(payload: any, entry: PhotoEntry): Promise<number | null> {
  const existing = await payload.find({
    collection: 'media',
    where: { filename: { equals: entry.outName } },
    limit: 1,
    depth: 0,
  })
  if (existing.docs.length > 0) {
    console.log(`  · media already exists: ${entry.outName} (id=${existing.docs[0].id})`)
    return existing.docs[0].id as number
  }
  const srcPath = path.join(SRC, entry.src)
  if (!fs.existsSync(srcPath)) {
    console.warn(`  ! source missing: ${srcPath}`)
    return null
  }
  const buf = await sharp(srcPath)
    .resize({ width: entry.width ?? 1600, withoutEnlargement: true })
    .jpeg({ quality: 80, mozjpeg: true })
    .toBuffer()
  const created = await payload.create({
    collection: 'media',
    data: { alt: entry.altZh } as any,
    file: { data: buf, mimetype: 'image/jpeg', name: entry.outName, size: buf.length },
    locale: 'zh-TW',
  })
  await payload.update({
    collection: 'media',
    id: (created as any).id,
    locale: 'en',
    data: { alt: entry.altEn } as any,
  })
  console.log(
    `  ✓ uploaded ${entry.outName} (${Math.round(buf.length / 1024)} kB, id=${(created as any).id})`,
  )
  return (created as any).id as number
}

async function setPageHero(payload: any, slug: string, mediaId: number) {
  const res = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  })
  const page = res.docs[0]
  if (!page) {
    console.warn(`  ! page '${slug}' not found`)
    return
  }
  await payload.update({
    collection: 'pages',
    id: page.id,
    data: { hero: { ...(page as any).hero, image: mediaId } } as any,
  })
  console.log(`  ✓ ${slug}: hero.image set → media ${mediaId}`)
}

async function appendIntroFigure(
  payload: any,
  slug: string,
  filename: string,
  zhCaption: string,
  enCaption: string,
) {
  const res = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  })
  const page = res.docs[0]
  if (!page) return
  for (const [locale, caption] of [
    ['zh-TW', zhCaption],
    ['en', enCaption],
  ] as const) {
    const cur = await payload.findByID({ collection: 'pages', id: page.id, locale, depth: 0 })
    const legacy = (cur as any).legacyHtml as string | null
    if (!legacy) continue
    const figure = `<figure><img src="/api/media/file/${filename}?prefix=media" alt="${caption}" /><figcaption>${caption}</figcaption></figure>\n\n`
    if (legacy.includes(filename)) continue
    const next = figure + legacy
    await payload.update({
      collection: 'pages',
      id: page.id,
      locale,
      data: { legacyHtml: next, body: null } as any,
    })
    console.log(`  ✓ ${slug} [${locale}] inline figure prepended`)
  }
}

async function main() {
  const payload = await getPayload({ config: payloadConfig as any })

  console.log('→ uploading marketing photos to Payload Media')
  const mediaIds: Record<string, number> = {}
  for (const p of PHOTOS) {
    const id = await uploadOrFind(payload, p)
    if (id) mediaIds[p.outName] = id
  }

  console.log('\n→ attaching hero images to pages without one')
  if (mediaIds['qingshui-cliffs-hualien.jpg']) {
    await setPageHero(payload, 'friendly-shops', mediaIds['qingshui-cliffs-hualien.jpg'])
    await setPageHero(payload, 'how-to-arrive', mediaIds['qingshui-cliffs-hualien.jpg'])
  }
  if (mediaIds['cloud-coffee-bar.jpg']) {
    await setPageHero(payload, 'cloudcoffee', mediaIds['cloud-coffee-bar.jpg'])
  }

  console.log('\n→ embedding lead-in figures into friendly-shops body')
  await appendIntroFigure(
    payload,
    'friendly-shops',
    'workshop-meetup-hualien.jpg',
    '在地交流活動現場',
    'A community workshop at the Hub',
  )

  console.log('\n🎉 marketing photos seeded')
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
