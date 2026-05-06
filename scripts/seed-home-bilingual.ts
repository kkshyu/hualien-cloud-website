/**
 * Split the bilingual home page into clean per-locale content.
 *
 *  - The original WP scrape mixes both languages in a single HTML file
 *    (TranslatePress translated client-side at runtime, which static scrape
 *    didn't capture). This script:
 *
 *  1) Reads the current zh-TW `legacyHtml` from Payload's home page.
 *  2) For zh-TW: strips trailing-English labels so the page reads as
 *     pure Chinese (花蓮雲基地 Hualien Cloud Hub  →  花蓮雲基地).
 *  3) For en: writes a curated English-only template that mirrors the
 *     same section structure (hero subtitle, latest, about, what we offer,
 *     contact) and reuses imagery from the media library.
 *
 *  Run:  pnpm tsx scripts/seed-home-bilingual.ts
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import payloadConfig from '../src/payload.config.js'

// Bilingual label dictionary scraped from the original home page.
// Each entry: 'Chinese English' string.
const BILINGUAL_LABELS: Array<[string, string]> = [
  ['花蓮雲基地 Hualien Cloud Hub', '花蓮雲基地'],
  ['最新活動 Latest News', '最新活動'],
  ['關於我們 About', '關於我們'],
  ['33小聚 Exchange', '33 小聚'],
  ['實作共創 Co-Creation', '實作共創'],
  ['客座業師 Expertise', '客座業師'],
  ['咖啡主題日 Coffee Themes', '咖啡主題日'],
  ['數位遊牧進駐空間 Residencies', '數位遊牧進駐空間'],
  ['花蓮印象 The Hualien Life', '花蓮印象'],
  ['在地商家 Local Business', '在地商家'],
  ['國際數位遊牧者 Digital Nomads', '國際數位遊牧者'],
  ['產業媒合晚宴 Welcome Dinner', '產業媒合晚宴'],
]

function stripEnglishSuffixes(html: string): string {
  let out = html

  // 1) Drop trailing-English labels in headings & tab toggles
  for (const [bilingual, zhOnly] of BILINGUAL_LABELS) {
    out = out.split(bilingual).join(zhOnly)
  }

  // 2) Drop the entire English announcement paragraph that the source
  //    embedded as one of the inner uagb-tabs siblings (Digital Nomads tab).
  out = out.replace(/<p>A new way to live[\s\S]*?💯💯💯<\/p>/g, '')

  // 3) Drop the inner-tab toggle whose label is "English" (the zh page only
  //    needs the 中文 inner tab, so the English toggle becomes orphan UI).
  out = out.replace(
    /<li class="uagb-tab[^"]*"\s+role="none">\s*<a[^>]*data-tab="0"[^>]*>\s*<div>English<\/div>\s*<\/a>\s*<\/li>/g,
    '',
  )

  // 4) Promote the 中文 inner tab (data-tab="1") to active, since we removed 0
  out = out.replace(
    /(<li class="uagb-tab)(\s+)(role="none">\s*<a[^>]*data-tab="1"[^>]*>\s*<div>中文<\/div>)/g,
    '$1 uagb-tabs__active$2$3',
  )

  // 5) Remove the now-empty English inner-tab body container if present
  out = out.replace(
    /<div class="wp-block-uagb-tabs-child[^"]*uagb-inner-tab-0"[^>]*aria-labelledby="uagb-tabs__tab0"[^>]*>\s*<\/div>/g,
    '',
  )

  return out
}

const EN_HOME_HTML = `
<section class="wp-section">
  <p class="lede">
    Hualien Cloud Hub is a coworking, residency and exchange space tucked between
    Taiwan&rsquo;s Central Mountain Range and the Pacific Ocean. We bring together
    local makers, founders, designers and digital nomads under one roof — a place to
    work hard, live well, and build with the rhythm of the place.
  </p>
</section>

<section class="wp-section">
  <h2>Latest Programmes</h2>
  <p>
    Right now we are hosting a 3-day, 2-night Digital Nomad exchange — pairing
    international remote workers with local entrepreneurs, makers and creators.
    Applications and details are listed under
    <a href="/en/news">News</a>.
  </p>
</section>

<section class="wp-section">
  <h2>About</h2>
  <p>
    We started Hualien Cloud Hub with a simple bet: that the future of work isn&rsquo;t
    only in big cities. By weaving together coworking, community gatherings, cross-cultural
    exchange and residencies, we want to make Hualien a destination on the global
    creative map — without losing what makes it Hualien.
  </p>
  <p>
    Our space is open to drop-in workers, weekly residents, event hosts and the
    curious-passing-through.
  </p>
</section>

<section class="wp-section">
  <h2>What we host</h2>
  <ul>
    <li><strong>33 Exchange</strong> — a monthly meet-up between locals and visiting nomads.</li>
    <li><strong>Co-Creation</strong> — workshops where ideas leave the laptop and become real.</li>
    <li><strong>Expertise</strong> — guest mentors share what they know with the community.</li>
    <li><strong>Coffee Themes</strong> — a slower kind of programming, around a single bag of beans.</li>
    <li><strong>Residencies</strong> — a desk, a bed, and time to make something here.</li>
  </ul>
</section>

<section class="wp-section">
  <h2>The Hualien Life</h2>
  <p>
    The mountains are 15 minutes inland; the ocean is 10 minutes east. In between
    you&rsquo;ll find rice paddies, indigenous cafés, surf points, and the slow,
    deliberate pace that brought us here in the first place.
    Browse the <a href="/en/media">library</a> for a feel of it.
  </p>
</section>

<section class="wp-section">
  <h2>Contact</h2>
  <ul>
    <li>Email: hello@hualien.cloud</li>
    <li>Address: Hualien County, Taiwan</li>
  </ul>
</section>
`.trim()

async function main() {
  const payload = await getPayload({ config: payloadConfig as any })

  const found = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    limit: 1,
    locale: 'zh-TW',
  })
  const home = found.docs[0]
  if (!home) {
    console.error('home page not found')
    process.exit(1)
  }

  const original = (home as { legacyHtml?: string }).legacyHtml ?? ''
  if (!original) {
    console.warn('home has no legacyHtml; skipping zh strip')
  } else {
    const cleaned = stripEnglishSuffixes(original)
    const removedCount = BILINGUAL_LABELS.reduce(
      (n, [bi]) => n + (original.includes(bi) ? 1 : 0),
      0,
    )
    await payload.update({
      collection: 'pages',
      id: home.id,
      locale: 'zh-TW',
      data: { legacyHtml: cleaned } as any,
    })
    console.log(`✓ zh-TW updated (${removedCount} bilingual labels collapsed)`)
  }

  await payload.update({
    collection: 'pages',
    id: home.id,
    locale: 'en',
    data: { legacyHtml: EN_HOME_HTML } as any,
  })
  console.log('✓ en home written')

  // Quick sanity check: re-read both locales, count length
  const zhAgain = await payload.findByID({
    collection: 'pages',
    id: home.id,
    locale: 'zh-TW',
  })
  const enAgain = await payload.findByID({
    collection: 'pages',
    id: home.id,
    locale: 'en',
  })
  console.log(`\nzh-TW legacyHtml length: ${(zhAgain as any).legacyHtml?.length ?? 0}`)
  console.log(`en    legacyHtml length: ${(enAgain as any).legacyHtml?.length ?? 0}`)

  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
