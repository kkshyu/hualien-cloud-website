/**
 * Replace the navigation label for the move-in page (now "Nomad Hualien")
 * across both locales.
 *
 *   pnpm tsx scripts/relabel-nav.ts
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import payloadConfig from '../src/payload.config.js'

async function patch(payload: any, locale: 'zh-TW' | 'en', newLabel: string) {
  const nav = await payload.findGlobal({ slug: 'navigation', locale, depth: 1 })
  const items = (nav.items ?? []) as Array<{ label?: string; page?: any; type?: string; url?: string }>
  const next = items.map((it) => {
    const slug =
      it.page && typeof it.page === 'object' ? (it.page.slug as string | undefined) : undefined
    if (slug === 'move-in') return { ...it, label: newLabel }
    return it
  })
  await payload.updateGlobal({
    slug: 'navigation',
    locale,
    data: { items: next } as any,
  })
  console.log(`  ✓ navigation [${locale}]: move-in → "${newLabel}"`)
}

async function main() {
  const payload = await getPayload({ config: payloadConfig as any })
  await patch(payload, 'zh-TW', 'Nomad Hualien')
  await patch(payload, 'en', 'Nomad Hualien')
  console.log('\n🎉 done')
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
