/**
 * Patch initial seed: assign hero/cover images and fill site-settings contact.
 * Idempotent — re-runnable.
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import payloadConfig from '../src/payload.config.js'

async function main() {
  const payload = await getPayload({ config: payloadConfig as any })

  // Pick a couple of wide images to use as hero/cover
  const cowork = await payload.find({
    collection: 'media',
    where: { filename: { contains: 'cowork-space' } },
    limit: 1,
  })
  const wide1 = await payload.find({
    collection: 'media',
    where: { filename: { equals: 'IMG_1719-scaled.jpg' } },
    limit: 1,
  })

  const heroMedia = cowork.docs[0] ?? wide1.docs[0]
  const coverMedia = wide1.docs[0] ?? cowork.docs[0]

  // 1) Set home page hero image (both locales)
  const home = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    limit: 1,
    locale: 'zh-TW',
  })
  if (home.docs[0] && heroMedia?.id) {
    for (const loc of ['zh-TW', 'en'] as const) {
      await payload.update({
        collection: 'pages',
        id: home.docs[0].id,
        locale: loc,
        data: {
          hero: {
            image: heroMedia.id,
            heading: loc === 'zh-TW' ? '山與海之間 a basecamp' : 'A basecamp between mountain & sea',
            subheading:
              loc === 'zh-TW'
                ? '在中央山脈與太平洋之間，我們搭起一座工作的山屋。讓人留下來，讓事情慢慢長出來。'
                : 'Between the Central Mountain Range and the Pacific, a basecamp where work and life slow down on purpose.',
          },
        } as any,
      })
    }
    console.log(`✓ home.hero.image set → media#${heroMedia.id} (${heroMedia.filename})`)
  }

  // 2) Set the post cover
  const posts = await payload.find({ collection: 'posts', limit: 1 })
  if (posts.docs[0] && coverMedia?.id) {
    await payload.update({
      collection: 'posts',
      id: posts.docs[0].id,
      data: { cover: coverMedia.id } as any,
    })
    console.log(`✓ post#${posts.docs[0].id} cover set → media#${coverMedia.id}`)
  }

  // 3) Site-settings contact + social, both locales
  for (const [loc, vals] of [
    [
      'zh-TW',
      {
        contact: {
          email: 'hello@hualien.cloud',
          phone: '+886-3-000-0000',
          address: '花蓮縣花蓮市\n中央山脈與太平洋之間',
        },
        social: [
          { platform: 'facebook', url: 'https://www.facebook.com/hualien.cloud', label: 'Facebook' },
          { platform: 'instagram', url: 'https://www.instagram.com/hualien.cloud', label: 'Instagram' },
        ],
      },
    ],
    [
      'en',
      {
        contact: {
          email: 'hello@hualien.cloud',
          phone: '+886-3-000-0000',
          address: 'Hualien City, Hualien County\nbetween Central Range & Pacific',
        },
        social: [
          { platform: 'facebook', url: 'https://www.facebook.com/hualien.cloud', label: 'Facebook' },
          { platform: 'instagram', url: 'https://www.instagram.com/hualien.cloud', label: 'Instagram' },
        ],
      },
    ],
  ] as const) {
    await payload.updateGlobal({
      slug: 'site-settings',
      locale: loc,
      data: vals as any,
    })
    console.log(`✓ site-settings (${loc}) contact + social filled`)
  }

  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
