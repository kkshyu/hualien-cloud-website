/**
 * Two repairs in one pass:
 *
 * 1) Re-assign correct cover images to news posts. The previous import
 *    paired each card with the wrong image (off-by-one in the source HTML —
 *    images appear *before* their h3 title, not after).
 *
 * 2) Replace the legacy hello@ contact email everywhere it lives in
 *    legacyHtml, and update site-settings (phone + address).
 *
 *   pnpm tsx scripts/fix-covers-and-contact.ts
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import payloadConfig from '../src/payload.config.js'

// slug → correct cover filename in the media collection
const COVER_FIXES: Record<string, string> = {
  '812': '33小聚-海報.png',
  'taiwan-maritime-nomad-2025': '504862206_654828507601009_458077247007698649_n.jpg',
  'nomad-first-ticket-2025':
    'group-young-college-students-smart-casual-wear-campus-friends-brainstorming-meeting-talking-discussing-work-ideas-new-design-project-modern-office-coworker-teamwork-startup-concept-scaled.jpg',
  'kickstart-japan-trip-2025': 'LINE_ALBUM_Hualien-Photos_250824_7.jpg',
  'nomad-mini-trip-2025': 'LINE_ALBUM_Hualien-Photos_250824_22.jpg',
  'industry-community-international-2025': '0d2a60ce-4527-4ac4-bcd6-c49a251db96e.jpg',
  'intl-startup-exchange-2025':
    'group-young-college-students-smart-casual-wear-campus-friends-brainstorming-meeting-talking-discussing-work-ideas-new-design-project-modern-office-coworker-teamwork-startup-concept-scaled.jpg',
  'digital-nomad-forum-2025': '未命名設計-1.jpg',
  'ai-meetup-productivity-2025': 'LINE_ALBUM_0627-AI小聚_250628_7.jpg',
  'coworker-meetup-2025': '45326.jpg',
  'dragonboat-festival-2025': '3c6a236e-c36c-4790-af3b-431e0b01bfbc.jpg',
  'cloudhub-launch-2025':
    'ksnewsim20250605m07-2-20250605m07-2-2025-06-05_14-46-06_044652.jpg',
}

const OLD_EMAIL = 'hello@hualien.cloud'
const NEW_EMAIL = 'contact@hualien.cloud'

async function findMediaIdByFilename(payload: any, filename: string) {
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

  // ---------- 1) cover fixes ----------
  console.log('--- cover fixes ---')
  for (const [slug, filename] of Object.entries(COVER_FIXES)) {
    const mediaId = await findMediaIdByFilename(payload, filename)
    if (!mediaId) {
      console.warn(`  ! media '${filename}' not found; skipping ${slug}`)
      continue
    }
    const r = await payload.find({
      collection: 'posts',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
    })
    const post = r.docs[0] as { id: string | number; cover?: any } | undefined
    if (!post) {
      console.warn(`  ! post '${slug}' not found`)
      continue
    }
    if (post.cover === mediaId || (typeof post.cover === 'object' && post.cover?.id === mediaId)) {
      console.log(`  - ${slug}: already correct`)
      continue
    }
    await payload.update({
      collection: 'posts',
      id: post.id,
      data: { cover: mediaId } as any,
    })
    console.log(`  ✓ ${slug}: cover → media#${mediaId} (${filename.slice(0, 50)})`)
  }

  // ---------- 2) email replacement in legacyHtml ----------
  console.log('\n--- email replacement ---')
  let touched = 0
  for (const collection of ['posts', 'pages'] as const) {
    for (const locale of ['zh-TW', 'en'] as const) {
      const all = await payload.find({ collection, limit: 0, locale, depth: 0 })
      for (const doc of all.docs as Array<{
        id: string | number
        slug?: string
        legacyHtml?: string | null
      }>) {
        const before = doc.legacyHtml ?? ''
        if (!before.includes(OLD_EMAIL)) continue
        const after = before.split(OLD_EMAIL).join(NEW_EMAIL)
        await payload.update({
          collection,
          id: doc.id,
          locale,
          data: { legacyHtml: after } as any,
        })
        touched += 1
        console.log(`  ✓ ${collection}#${doc.id} ${doc.slug} [${locale}]: replaced ${OLD_EMAIL}`)
      }
    }
  }
  console.log(`  total ${touched} updates`)

  // ---------- 3) site-settings phone + address ----------
  console.log('\n--- site-settings ---')
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      contact: {
        email: NEW_EMAIL,
        phone: '(+886)03-835-0046',
        address: '花蓮縣花蓮市府前路3號',
      },
    } as any,
  })
  console.log('  ✓ site-settings.contact updated (email + phone + address)')
  // English locale gets the same address (number-format isn't language-specific here)
  await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'en' as const,
    data: {
      contact: {
        email: NEW_EMAIL,
        phone: '(+886)03-835-0046',
        address: 'No. 3, Fuqian Rd., Hualien City, Hualien County 970, Taiwan',
      },
    } as any,
  })
  console.log('  ✓ site-settings.contact (en) updated')

  console.log('\n🎉 done')
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
