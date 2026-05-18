/**
 * Insert a newline between "Nomad Hualien" and "進駐計劃 / Residency" in the
 * move-in hero heading. Paired with `white-space: pre-line` on `.hero__title`
 * so the newline renders as a visible line break.
 *
 *   pnpm tsx scripts/patch-move-in-title.ts
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import payloadConfig from '../src/payload.config.js'

const TITLES = {
  'zh-TW': 'Nomad Hualien\n進駐計劃',
  en: 'Nomad Hualien\nResidency',
} as const

async function main() {
  const payload = await getPayload({ config: payloadConfig })

  const found = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'move-in' } },
    depth: 0,
    locale: 'zh-TW',
    limit: 1,
  })
  if (!found.docs.length) {
    console.error('move-in page not found')
    process.exit(1)
  }
  const id = found.docs[0].id

  for (const locale of ['zh-TW', 'en'] as const) {
    const current = await payload.findByID({ collection: 'pages', id, locale, depth: 0 })
    const hero = (current as any).hero ?? {}
    await payload.update({
      collection: 'pages',
      id,
      locale,
      data: { hero: { ...hero, heading: TITLES[locale] } } as any,
    })
    console.log(`  ✓ move-in [${locale}] hero.heading updated`)
  }
}

main().then(
  () => process.exit(0),
  (err) => {
    console.error(err)
    process.exit(1)
  },
)
