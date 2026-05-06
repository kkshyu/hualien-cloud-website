/**
 * Upload the Nomad Hualien residency brochure PDFs (zh-TW + en) into the
 * Payload media collection so they live in our own MinIO bucket.
 *
 *   pnpm tsx scripts/upload-nomad-brochures.ts
 */
import 'dotenv/config'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { getPayload } from 'payload'
import payloadConfig from '../src/payload.config.js'

interface Drop {
  src: string
  filename: string // canonical name to store in MinIO
  alt: string
  altEn: string
}

const DROPS: Drop[] = [
  {
    src: path.join(
      process.env.HOME || '',
      'Downloads',
      '115年5月花蓮雲基地國際數位遊牧者進駐招募簡章.pdf',
    ),
    filename: 'nomad-hualien-recruitment-brochure-zh.pdf',
    alt: 'Nomad Hualien 國際數位遊牧者進駐招募簡章（中文）',
    altEn: 'Nomad Hualien — International Digital Nomad Residency Recruitment Brochure (Chinese)',
  },
  {
    src: path.join(
      process.env.HOME || '',
      'Downloads',
      '115年5月花蓮雲基地國際數位遊牧者進駐招募簡章_英文.pdf',
    ),
    filename: 'nomad-hualien-recruitment-brochure-en.pdf',
    alt: 'Nomad Hualien 國際數位遊牧者進駐招募簡章（英文版）',
    altEn: 'Nomad Hualien — International Digital Nomad Residency Recruitment Brochure (English)',
  },
]

async function findExisting(payload: any, filename: string) {
  const r = await payload.find({
    collection: 'media',
    where: { filename: { equals: filename } },
    limit: 1,
    depth: 0,
  })
  return r.docs[0]?.id ?? null
}

async function main() {
  const payload = await getPayload({ config: payloadConfig as any })

  for (const drop of DROPS) {
    if (!fs.existsSync(drop.src)) {
      console.warn(`  ! source missing: ${drop.src}`)
      continue
    }
    const existing = await findExisting(payload, drop.filename)
    if (existing) {
      console.log(`  - already uploaded: ${drop.filename} (media#${existing})`)
      continue
    }
    const buffer = fs.readFileSync(drop.src)
    const created = await payload.create({
      collection: 'media',
      data: { alt: drop.alt } as any,
      file: {
        data: buffer,
        mimetype: 'application/pdf',
        name: drop.filename,
        size: buffer.length,
      },
    })
    // Localized en alt text
    await payload.update({
      collection: 'media',
      id: created.id,
      locale: 'en',
      data: { alt: drop.altEn } as any,
    })
    console.log(`  + uploaded: ${drop.filename} → media#${created.id}`)
  }

  console.log('\n🎉 done')
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
