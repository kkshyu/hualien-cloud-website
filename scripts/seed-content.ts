/**
 * Pull richer content from the WordPress scrape and seed it into Payload.
 *
 *   - 3 events extracted from home.html's three-tab "Latest News" section,
 *     each with the proper post type=event and bilingual title/excerpt.
 *   - Page bodies (move-in / venue-rental / how-to-arrive / cloudcoffee)
 *     re-extracted from scrape/pages/{slug}.html, cleaned of bilingual
 *     UAGB labels, with image URLs rewritten to MinIO.
 *
 * Run AFTER the initial seed:  pnpm tsx scripts/seed-content.ts
 */
import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import payloadConfig from '../src/payload.config.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const SCRAPE = path.resolve(__dirname, '..', 'scrape')

// ---------- bilingual label collapse (same dictionary as seed-home-bilingual) ----------
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
  ['進駐空間 Studios', '進駐空間'],
  ['進駐空間 Residency', '進駐空間'],
  ['場地租用 Venue Rental', '場地租用'],
  ['空間簡介 About the Space', '空間簡介'],
  ['空間簡介 Info', '空間簡介'],
  ['申請須知 Terms and Conditions', '申請須知'],
  ['申請表單 Application Form', '申請表單'],
  ['申請 Apply Here', '申請'],
  ['申請請點此 Apply here.', '申請請點此'],
  ['共創空間 Coworking Space', '共創空間'],
  ['個人工作室 Private studio room', '個人工作室'],
  ['獨立衛浴 Ensuite bathroom', '獨立衛浴'],
  ['空調系統 Air Conditioning', '空調系統'],
  ['高網速 High-speed internet', '高網速'],
  ['駐點人員現場協助 Weekday full-time manager on site', '駐點人員現場協助'],
  ['每月遊牧者交流聚會 Monthly community meetups', '每月遊牧者交流聚會'],
  ['步行即可到達當地便利設施 Local amenities within walking distance', '步行即可到達當地便利設施'],
  ['私人會議室 Access to private meeting rooms', '私人會議室'],
  ['戶外空間 Outdoor Plaza', '戶外空間'],
  ['雲咖啡 Cloud Coffee', '雲咖啡'],
  ['活動 Events', '活動'],
  ['場地 Venue', '場地'],
]

function stripBilingualLabels(html: string): string {
  let out = html
  for (const [bi, zh] of BILINGUAL_LABELS) {
    out = out.split(bi).join(zh)
  }
  return out
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

// ---------- balanced-div extractor ----------
function extractDiv(html: string, anchor: string): string | null {
  const anchorPos = html.indexOf(anchor)
  if (anchorPos === -1) return null
  // The anchor lives inside the opening tag we want; walk back to find that <div.
  const openTag = html.lastIndexOf('<div', anchorPos)
  if (openTag === -1) return null
  // Walk forward, balanced.
  let depth = 0
  let i = openTag
  while (i < html.length) {
    const nextOpen = html.indexOf('<div', i + 1)
    const nextClose = html.indexOf('</div>', i + 1)
    if (nextClose === -1) return null
    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth++
      i = nextOpen
    } else {
      if (depth === 0) {
        return html.slice(openTag, nextClose + 6)
      }
      depth--
      i = nextClose
    }
  }
  return null
}

function extractEntryContent(filePath: string): string {
  const html = fs.readFileSync(filePath, 'utf8')
  const block = extractDiv(html, 'class="entry-content')
  return block ?? ''
}

function extractInnerTab(homeHtml: string, tabIndex: 0 | 1 | 2): string {
  // anchor on aria-labelledby="uagb-tabs__tab{N}" whose siblings are the 3 outer tabs
  // Use the first `class="wp-block-uagb-tabs-child uagb-tabs__body-container uagb-inner-tab-{N}"` that appears
  // inside the OUTER tabs panel (block-d35a4c2a). To be safe, search after that anchor only.
  const outerStart = homeHtml.indexOf('uagb-block-d35a4c2a')
  const after = homeHtml.slice(outerStart === -1 ? 0 : outerStart)
  const anchor = `uagb-inner-tab-${tabIndex}`
  return extractDiv(after, anchor) ?? ''
}

// ---------- URL rewrite (old hualien.cloud → MinIO) ----------
async function buildUrlMap(payload: any): Promise<Map<string, string>> {
  const all = await payload.find({ collection: 'media', limit: 0, depth: 0 })
  const map = new Map<string, string>()
  for (const m of all.docs as Array<{ filename?: string; url?: string }>) {
    if (!m.filename || !m.url) continue
    map.set(m.filename, m.url)
  }
  return map
}

function rewriteImageUrls(html: string, byFilename: Map<string, string>): string {
  // Match wp-content uploads URLs and replace with the new MinIO URL.
  // The original may include a size suffix like `-819x1024`. Try the
  // exact filename first; if not found, try the unsuffixed filename.
  return html.replace(
    /https?:\/\/(?:www\.)?hualien\.cloud\/wp-content\/uploads\/[^"'\s)]+/g,
    (oldUrl) => {
      const filename = decodeURIComponent(oldUrl.split('/').pop() ?? '')
      if (byFilename.has(filename)) return byFilename.get(filename)!
      // strip -WIDTHxHEIGHT suffix
      const stripped = filename.replace(/-(\d{2,5})x(\d{2,5})(?=\.[a-z]+$)/i, '')
      if (byFilename.has(stripped)) return byFilename.get(stripped)!
      return oldUrl // leave as-is
    },
  )
}

// also strip srcset attributes since their candidates won't all map cleanly
function stripSrcset(html: string): string {
  return html.replace(/\s+srcset="[^"]*"/g, '').replace(/\s+sizes="[^"]*"/g, '')
}

// remove WordPress utility classes that look bad without their CSS
function cleanWpCruft(html: string): string {
  return html
    .replace(/\sclass="[^"]*\bwp-block-uagb-buttons[^"]*"[^>]*>[\s\S]*?<\/div>/g, '')
    .replace(/\s+(decoding|loading)="[^"]*"/g, '')
}

// ---------- event content (curated bilingual) ----------
type EventSpec = {
  slug: string
  publishedAt: string
  zh: { title: string; excerpt: string }
  en: { title: string; excerpt: string; bodyHtml?: string }
  zhTabIndex: 0 | 1 | 2
}

const EVENTS: EventSpec[] = [
  {
    slug: 'local-business-2026',
    publishedAt: '2026-04-30T00:00:00.000Z',
    zh: {
      title: '在地商家招募｜3 天 2 夜國際數位遊牧交流體驗',
      excerpt:
        '同步開放在地青年與業者參與，與來自世界各地的數位遊牧者面對面交流。',
    },
    en: {
      title: 'Open call: local makers join the 3-day Digital Nomad exchange',
      excerpt:
        'A call for Hualien-based founders, store owners, makers and farmers to join three days of conversations with international nomads.',
      bodyHtml: `
<figure class="event-poster">
  <img src="LOCAL_POSTER" alt="Local makers poster" />
</figure>
<p>Hualien&rsquo;s digital-nomad-friendly community needs you. We are opening up the same 3-day, 2-night programme to local entrepreneurs, store owners, coworking operators, lifestyle brands, young farmers and tourism partners — anyone who wants to expand their international reach.</p>
<p>You may meet international remote workers, designers, engineers and creators. The aim: take your brand, your space and your story global, together.</p>
<h3>How to apply</h3>
<ul>
  <li>10 selected, 3 waitlisted (assessed on local resources, exchange potential, willingness to collaborate, fit).</li>
  <li>Application window: April 30 – May 8, 2026, 23:59</li>
  <li>Apply: <a href="https://forms.gle/ZxeAByrE8vrjTrJG7">forms.gle/ZxeAByrE8vrjTrJG7</a></li>
  <li>Results announced: May 20 on this site.</li>
</ul>
`.trim(),
    },
    zhTabIndex: 0,
  },
  {
    slug: 'digital-nomads-2026',
    publishedAt: '2026-04-30T00:00:00.000Z',
    zh: {
      title: '國際數位遊牧者｜3 天 2 夜花蓮交流體驗',
      excerpt:
        '邀請國際數位遊牧者來花蓮，從城市出發，走進在地文化、原民部落、自然山海。',
    },
    en: {
      title: 'Digital Nomads｜3-day Hualien immersion',
      excerpt:
        'A 3-day, 2-night immersion for international digital nomads — local culture, indigenous communities, nature, and a real chance to collaborate.',
    },
    zhTabIndex: 1,
  },
  {
    slug: 'welcome-dinner-2026',
    publishedAt: '2026-04-30T00:00:00.000Z',
    zh: {
      title: '產業媒合晚宴｜花蓮數位遊牧',
      excerpt:
        '5/29 在花蓮，把遠距工作者、數位遊牧、在地產業放在同一張桌邊。',
    },
    en: {
      title: 'Welcome Dinner｜Hualien Digital Nomad Industry Mixer',
      excerpt:
        'May 29, Hualien — one evening, one long table, where remote workers, nomads, local makers and industries meet.',
      bodyHtml: `
<figure class="event-poster">
  <img src="DINNER_POSTER" alt="Welcome dinner poster" />
</figure>
<p>A good dinner is never just dinner. It is also where people from different worlds start to recognise each other.</p>
<p>On May 29 we host the <em>Hualien Digital Nomad Industry Mixer</em> — bringing together remote workers, digital nomads, creators, local businesses, cultural spaces, academia, industry and regional partners.</p>
<p>The evening is designed for connection: name tags, ice-breakers, cross-table conversations, and a Hualien impression wall — so it&rsquo;s easier to start a real conversation, meet partners from different backgrounds, and surface possible collaborations.</p>
<p>We hope this evening shows more people why Hualien is a credible nomad-friendly city, and helps local brands, spaces and industries link up with remote workers, creators and cross-disciplinary talent.</p>
<p>Seats are limited and reviewed; completing the form does not guarantee a seat. Selection considers background, fit, exchange value, industry mix and seating layout.</p>
<p>If digital nomadism, place-based brands or the creator economy interests you, please apply by <strong>May 8, 23:59</strong>: <a href="https://forms.gle/aPFgysDpBMeGY15b6">forms.gle/aPFgysDpBMeGY15b6</a></p>
`.trim(),
    },
    zhTabIndex: 2,
  },
]

// ---------- page bodies ----------
type PageSpec = {
  slug: string
  zh: { title: string }
  en: { title: string; bodyHtml?: string }
}
const PAGES: PageSpec[] = [
  {
    slug: 'move-in',
    zh: { title: '進駐' },
    en: {
      title: 'Residency',
      bodyHtml: `
<h2>Studios &amp; residencies in Hualien</h2>
<p>We host nomads, founders and creators for stays from a single week to a full season. A desk, a bed, and time to make something here.</p>
<p>Our <em>Studios</em> are private offices for teams of 1–4. Our short-term <em>Residencies</em> include shared workspace, community programming and access to our network of local makers.</p>
<p>Reach out at <a href="mailto:hello@hualien.cloud">hello@hualien.cloud</a> to discuss dates and the kind of stay that fits.</p>
`.trim(),
    },
  },
  {
    slug: 'venue-rental',
    zh: { title: '場地租用' },
    en: {
      title: 'Venue Rental',
      bodyHtml: `
<h2>Host your event between mountain &amp; sea</h2>
<p>Our space hosts gatherings of 10 to 80: workshops, salons, product launches, residencies, off-sites. Half-day, full-day and evening rates available.</p>
<p>Tell us what you are planning — date, headcount, format — and we will send pricing and the next step.</p>
<p><a href="mailto:hello@hualien.cloud">hello@hualien.cloud</a></p>
`.trim(),
    },
  },
  {
    slug: 'how-to-arrive',
    zh: { title: '如何前往' },
    en: {
      title: 'Getting Here',
      bodyHtml: `
<h2>From Taipei or beyond, here is how to reach us</h2>
<p>Hualien is on Taiwan&rsquo;s east coast, three hours by train from Taipei.</p>
<h3>By train</h3>
<p>From Taipei Main Station take the TRA Puyuma or Tze-Chiang Express directly to Hualien Station. Tickets typically start at NTD 440. Book in advance during weekends and holidays.</p>
<h3>By bus or car</h3>
<p>Long-distance buses run from Taipei via Suhua Highway (~4–5 hours). Driving down the same coast route is one of the more spectacular short road-trips in Taiwan.</p>
<h3>By air</h3>
<p>Hualien Airport (HUN) connects to Taipei Songshan and a handful of regional cities. The flight is ~50 minutes.</p>
<p>From Hualien Station the Cloud Hub is a 5-minute taxi or 15-minute walk.</p>
`.trim(),
    },
  },
  {
    slug: 'cloudcoffee',
    zh: { title: '活動' },
    en: {
      title: 'Programmes',
      bodyHtml: `
<h2>Programmes at Hualien Cloud Hub</h2>
<p>We run a small, deliberate calendar — the kinds of gatherings that actually let people get to know each other.</p>
<ul>
  <li><strong>33 Exchange</strong> — a monthly meet-up between locals and visiting nomads.</li>
  <li><strong>Co-Creation</strong> — workshops where ideas leave the laptop.</li>
  <li><strong>Expertise</strong> — guest mentors share what they are building.</li>
  <li><strong>Coffee Themes</strong> — slow programming around a single bag of beans.</li>
  <li><strong>Residencies</strong> — desks, beds, and time.</li>
</ul>
<p>See upcoming dates under <a href="/en/events">Events</a>, or <a href="mailto:hello@hualien.cloud">drop us a note</a>.</p>
`.trim(),
    },
  },
]

// ---------- main ----------
async function main() {
  const payload = await getPayload({ config: payloadConfig as any })
  const byFilename = await buildUrlMap(payload)
  console.log(`media url map: ${byFilename.size} entries`)

  const homeHtml = fs.readFileSync(path.join(SCRAPE, 'pages', 'home.html'), 'utf8')

  // ---------- events ----------
  for (const ev of EVENTS) {
    const tabHtml = extractInnerTab(homeHtml, ev.zhTabIndex)
    if (!tabHtml) {
      console.warn(`  ! no tab content for ${ev.slug}`)
      continue
    }
    let zhBody = stripSrcset(tabHtml)
    zhBody = stripBilingualLabels(decodeEntities(zhBody))
    zhBody = rewriteImageUrls(zhBody, byFilename)
    zhBody = cleanWpCruft(zhBody)

    // For Digital Nomads, the en version body is the entire English `<p>` from the source —
    // grab the second tab block (zhTabIndex=1) but extract its English paragraph.
    let enBody = ev.en.bodyHtml ?? ''
    if (ev.slug === 'digital-nomads-2026') {
      // English content is already inside the same tab body — keep that block as-is for en.
      enBody = stripSrcset(tabHtml)
      enBody = rewriteImageUrls(enBody, byFilename)
      enBody = cleanWpCruft(enBody)
    } else if (enBody.includes('LOCAL_POSTER')) {
      // resolve the poster image URL for the local-business event
      const posterMatch = zhBody.match(/<img[^>]+src="([^"]+)"/i)
      if (posterMatch) enBody = enBody.replace('LOCAL_POSTER', posterMatch[1])
    } else if (enBody.includes('DINNER_POSTER')) {
      const posterMatch = zhBody.match(/<img[^>]+src="([^"]+)"/i)
      if (posterMatch) enBody = enBody.replace('DINNER_POSTER', posterMatch[1])
    }

    const exists = await payload.find({
      collection: 'posts',
      where: { slug: { equals: ev.slug } },
      limit: 1,
    })

    let id: string | number
    if (exists.docs[0]) {
      id = exists.docs[0].id
      await payload.update({
        collection: 'posts',
        id,
        locale: 'zh-TW',
        data: {
          type: 'event',
          title: ev.zh.title,
          excerpt: ev.zh.excerpt,
          legacyHtml: zhBody,
          publishedAt: ev.publishedAt,
          status: 'published',
        } as any,
      })
    } else {
      const created = await payload.create({
        collection: 'posts',
        locale: 'zh-TW',
        data: {
          type: 'event',
          title: ev.zh.title,
          slug: ev.slug,
          excerpt: ev.zh.excerpt,
          legacyHtml: zhBody,
          publishedAt: ev.publishedAt,
          status: 'published',
        } as any,
      })
      id = created.id
    }

    await payload.update({
      collection: 'posts',
      id,
      locale: 'en',
      data: {
        title: ev.en.title,
        excerpt: ev.en.excerpt,
        legacyHtml: enBody,
      } as any,
    })

    console.log(`✓ event: ${ev.slug}`)
  }

  // ---------- pages ----------
  for (const pg of PAGES) {
    const filePath = path.join(SCRAPE, 'pages', `${pg.slug}.html`)
    if (!fs.existsSync(filePath)) {
      console.warn(`  ! missing scrape file for ${pg.slug}`)
      continue
    }
    let zhBody = extractEntryContent(filePath)
    zhBody = stripSrcset(zhBody)
    zhBody = stripBilingualLabels(decodeEntities(zhBody))
    zhBody = rewriteImageUrls(zhBody, byFilename)
    zhBody = cleanWpCruft(zhBody)

    const found = await payload.find({
      collection: 'pages',
      where: { slug: { equals: pg.slug } },
      limit: 1,
      locale: 'zh-TW',
    })
    const page = found.docs[0]
    if (!page) {
      console.warn(`  ! page not found: ${pg.slug}`)
      continue
    }

    await payload.update({
      collection: 'pages',
      id: page.id,
      locale: 'zh-TW',
      data: {
        title: pg.zh.title,
        legacyHtml: zhBody,
      } as any,
    })

    await payload.update({
      collection: 'pages',
      id: page.id,
      locale: 'en',
      data: {
        title: pg.en.title,
        legacyHtml: pg.en.bodyHtml ?? '',
      } as any,
    })

    console.log(`✓ page: ${pg.slug}`)
  }

  // ---------- navigation: clean up duplicates (events handled by /events route now) ----------
  // Build nav with proper page references — find pages by slug to populate `page` relation.
  const navPages: Array<{ slug: string; zhLabel: string; enLabel: string }> = [
    { slug: 'move-in', zhLabel: '進駐', enLabel: 'Residency' },
    { slug: 'venue-rental', zhLabel: '場地租用', enLabel: 'Venue' },
    { slug: 'how-to-arrive', zhLabel: '如何前往', enLabel: 'Getting Here' },
  ]
  const pageRefs = await Promise.all(
    navPages.map(async (np) => {
      const r = await payload.find({
        collection: 'pages',
        where: { slug: { equals: np.slug } },
        limit: 1,
      })
      return { ...np, id: r.docs[0]?.id }
    }),
  )
  for (const loc of ['zh-TW', 'en'] as const) {
    await payload.updateGlobal({
      slug: 'navigation',
      locale: loc,
      data: {
        items: pageRefs
          .filter((p) => p.id)
          .map((p) => ({
            label: loc === 'zh-TW' ? p.zhLabel : p.enLabel,
            type: 'page',
            page: p.id,
          })),
      } as any,
    })
  }
  console.log('✓ navigation deduped (Events lives at /events route)')

  console.log('\n🎉 content seed complete')
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
