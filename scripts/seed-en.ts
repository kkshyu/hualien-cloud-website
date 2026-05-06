/**
 * Add English locale fields on top of the existing zh-TW seed.
 *
 * Run AFTER scripts/seed.ts:  pnpm tsx scripts/seed-en.ts
 *
 * - Translates a small set of curated strings (hero copy, page titles).
 * - Seeds en versions of pages so /en is fluently English at first paint.
 * - Falls back to existing zh-TW for content body where no translation is curated.
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import payloadConfig from '../src/payload.config.js'

interface Translation {
  title: string
  hero?: { heading?: string; subheading?: string }
}

const PAGE_EN: Record<string, Translation> = {
  home: {
    title: 'Home',
    hero: {
      heading: 'A basecamp between mountain & sea',
      subheading:
        'Hualien Cloud Hub is a co-working, residency and event space tucked between the Central Mountain Range and the Pacific. Slow on purpose.',
    },
  },
  cloudcoffee: {
    title: 'Events',
    hero: { heading: 'Events' },
  },
  'move-in': {
    title: 'Residency',
    hero: { heading: 'Residency' },
  },
  'venue-rental': {
    title: 'Venue',
    hero: { heading: 'Venue Rental' },
  },
  'how-to-arrive': {
    title: 'Getting Here',
    hero: { heading: 'How to Arrive' },
  },
}

async function main() {
  const payload = await getPayload({ config: payloadConfig as any })

  for (const [slug, tr] of Object.entries(PAGE_EN)) {
    const found = await payload.find({
      collection: 'pages',
      where: { slug: { equals: slug } },
      limit: 1,
      locale: 'zh-TW',
    })
    const page = found.docs[0]
    if (!page) {
      console.log(`  - skip ${slug} (no zh page)`)
      continue
    }
    await payload.update({
      collection: 'pages',
      id: page.id,
      locale: 'en',
      data: {
        title: tr.title,
        hero: tr.hero,
      } as any,
    })
    console.log(`  + en: pages/${slug}`)
  }

  // Site settings (en)
  await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'en',
    data: {
      siteName: 'Hualien Cloud Hub',
      tagline: 'A basecamp between mountain & sea',
      footer: { copyright: `© ${new Date().getFullYear()} Hualien Cloud Hub` },
    } as any,
  })
  console.log('  + en: site-settings')

  // Navigation (en)
  await payload.updateGlobal({
    slug: 'navigation',
    locale: 'en',
    data: {
      items: [
        { label: 'Events', type: 'page' },
        { label: 'Residency', type: 'page' },
        { label: 'Venue', type: 'page' },
        { label: 'Getting Here', type: 'page' },
      ],
    } as any,
  })
  console.log('  + en: navigation')

  // The single existing post — give it an English title at minimum
  const post = await payload.find({
    collection: 'posts',
    limit: 1,
    locale: 'zh-TW',
  })
  if (post.docs[0]) {
    await payload.update({
      collection: 'posts',
      id: post.docs[0].id,
      locale: 'en',
      data: {
        title: 'Hualien 33 Meetup — March',
        excerpt: 'Monthly meet-up for makers and digital nomads in eastern Taiwan.',
      } as any,
    })
    console.log('  + en: posts/812')
  }

  console.log('\n🎉 en seed complete')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
