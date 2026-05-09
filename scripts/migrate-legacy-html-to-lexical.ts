/**
 * Convert all `legacyHtml` content (Pages + Posts) into the Lexical WYSIWYG
 * `body` field, so editors can edit pages visually instead of in raw HTML.
 *
 *   pnpm tsx scripts/migrate-legacy-html-to-lexical.ts
 *   pnpm tsx scripts/migrate-legacy-html-to-lexical.ts --force   # overwrite even if body already populated
 *   pnpm tsx scripts/migrate-legacy-html-to-lexical.ts --collection=pages
 *
 * The `legacyHtml` field is preserved in the database (just hidden from the
 * admin UI) so we can re-run or roll back if anything looks wrong.
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import payloadConfig from '../src/payload.config.js'
import { htmlToLexical, isLexicalEmpty } from '../src/lib/html-to-lexical.js'

const FORCE = process.argv.includes('--force')
const ONLY = process.argv
  .find((a) => a.startsWith('--collection='))
  ?.split('=')[1] as 'pages' | 'posts' | undefined

const LOCALES = ['zh-TW', 'en'] as const

async function migrateCollection(payload: any, collection: 'pages' | 'posts') {
  const total = await payload.count({ collection })
  console.log(`\n→ ${collection}: ${total.totalDocs} documents`)
  let converted = 0
  let skipped = 0

  // Pull a list of doc IDs once so we can iterate per-locale without pagination drift.
  const list = await payload.find({
    collection,
    limit: 1000,
    depth: 0,
    pagination: false,
  })

  for (const doc of list.docs as Array<{ id: number | string; slug?: string }>) {
    for (const locale of LOCALES) {
      const full = await payload.findByID({
        collection,
        id: doc.id,
        depth: 0,
        locale,
      })
      const legacy: string | null | undefined = full.legacyHtml
      const body = full.body
      if (!legacy || legacy.trim() === '') {
        skipped++
        continue
      }
      if (!FORCE && body && !isLexicalEmpty(body)) {
        skipped++
        continue
      }
      const next = htmlToLexical(legacy)
      try {
        await payload.update({
          collection,
          id: doc.id,
          locale,
          data: { body: next },
        })
      } catch (err) {
        console.error(
          `\n  ✗ ${collection}/${doc.slug ?? doc.id} [${locale}] failed:`,
          (err as Error).message,
        )
        const fs = await import('node:fs')
        const path = `/tmp/lexical-fail-${doc.slug ?? doc.id}-${locale}.json`
        fs.writeFileSync(path, JSON.stringify(next, null, 2))
        console.error(`     dumped state → ${path}`)
        continue
      }
      converted++
      console.log(
        `  ✓ ${collection}/${doc.slug ?? doc.id} [${locale}] — ${next.root.children.length} blocks`,
      )
    }
  }

  console.log(`  done: converted=${converted}, skipped=${skipped}`)
}

async function main() {
  const payload = await getPayload({ config: payloadConfig as any })
  if (!ONLY || ONLY === 'pages') await migrateCollection(payload, 'pages')
  if (!ONLY || ONLY === 'posts') await migrateCollection(payload, 'posts')
  console.log('\n🎉 migration complete')
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
