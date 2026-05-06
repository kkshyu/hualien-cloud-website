/**
 * Backfill the `cover` field on posts by extracting the first <img> in
 * legacyHtml and matching it to a Media doc by URL or filename.
 *
 *   pnpm tsx scripts/backfill-covers.ts
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import payloadConfig from '../src/payload.config.js'

function firstImageUrl(html: string): string | null {
  const m = html.match(/<img[^>]+src="([^"]+)"/i)
  return m?.[1] ?? null
}

function filenameFromUrl(url: string): string {
  const last = url.split('/').pop() ?? ''
  return decodeURIComponent(last.split('?')[0])
}

async function main() {
  const payload = await getPayload({ config: payloadConfig as any })

  // Index media by both url and filename for quick lookup
  const allMedia = await payload.find({ collection: 'media', limit: 0, depth: 0 })
  const byUrl = new Map<string, string | number>()
  const byFilename = new Map<string, string | number>()
  for (const m of allMedia.docs as Array<{ id: string | number; url?: string; filename?: string }>) {
    if (m.url) byUrl.set(m.url, m.id)
    if (m.filename) byFilename.set(m.filename, m.id)
  }
  console.log(`media index: ${byUrl.size} urls + ${byFilename.size} filenames`)

  let touched = 0
  for (const collection of ['posts', 'pages'] as const) {
    // Use zh-TW as the canonical body to find an image. cover is non-localized.
    const all = await payload.find({ collection, limit: 0, locale: 'zh-TW', depth: 0 })
    for (const doc of all.docs as Array<{
      id: string | number
      slug?: string
      title?: string
      cover?: any
      legacyHtml?: string
    }>) {
      if (doc.cover) continue // already has cover
      const html = doc.legacyHtml ?? ''
      const imgUrl = firstImageUrl(html)
      if (!imgUrl) {
        console.log(`  - ${collection}#${doc.id} (${doc.slug}): no <img> in body`)
        continue
      }

      let mediaId = byUrl.get(imgUrl)
      if (!mediaId) {
        const fname = filenameFromUrl(imgUrl)
        mediaId = byFilename.get(fname)
        if (!mediaId) {
          // Try without size suffix
          const stripped = fname.replace(/-(\d{2,5})x(\d{2,5})(?=\.[a-z]+$)/i, '')
          mediaId = byFilename.get(stripped)
        }
      }

      if (!mediaId) {
        console.log(`  ✗ ${collection}#${doc.id} (${doc.slug}): no media match for ${imgUrl}`)
        continue
      }

      await payload.update({
        collection,
        id: doc.id,
        data: { cover: mediaId } as any,
      })
      touched += 1
      console.log(`  ✓ ${collection}#${doc.id} (${doc.slug}): cover → media#${mediaId}`)
    }
  }

  console.log(`\n🎉 backfilled ${touched} cover fields`)
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
