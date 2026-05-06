/**
 * Update the home page hero subheading & heading to the new keyword-rich
 * digital nomad framing.
 *
 *   pnpm tsx scripts/fix-home-hero.ts
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import payloadConfig from '../src/payload.config.js'

async function main() {
  const payload = await getPayload({ config: payloadConfig as any })
  const r = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    limit: 1,
    depth: 0,
  })
  const home = r.docs[0]
  if (!home) {
    console.error('home page not found')
    process.exit(1)
  }

  await payload.update({
    collection: 'pages',
    id: home.id,
    locale: 'zh-TW',
    data: {
      hero: {
        heading: '花蓮數位遊牧據點',
        subheading:
          '在中央山脈與太平洋之間，我們搭起數位遊牧據點。\n讓人留下來，讓事情慢慢長出來。',
      },
    } as any,
  })
  console.log('  ✓ home zh hero updated')

  await payload.update({
    collection: 'pages',
    id: home.id,
    locale: 'en',
    data: {
      hero: {
        heading: 'Hualien Digital Nomad Hub',
        subheading:
          'Between the Central Mountain Range and the Pacific,\nwe’ve built a digital nomad base where people stay and ideas grow slow.',
      },
    } as any,
  })
  console.log('  ✓ home en hero updated')

  console.log('\n🎉 done')
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
