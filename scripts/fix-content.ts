/**
 * Final content fixes:
 *  1) Sweep every legacyHtml in pages/posts and rewrite any remaining
 *     `https://www.hualien.cloud/wp-content/uploads/...` URLs (incl.
 *     size-variant suffixes like -571x1024) to the corresponding MinIO URL.
 *  2) Replace English-only zh body of digital-nomads-2026 with curated
 *     Chinese content (the original WordPress tab1 was English-only).
 *  3) Author an English version of post 812 so /en/news/812 stops falling
 *     back to Chinese.
 *
 *   pnpm tsx scripts/fix-content.ts
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import payloadConfig from '../src/payload.config.js'

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
  return html.replace(
    /https?:\/\/(?:www\.)?hualien\.cloud\/wp-content\/uploads\/[^"'\s)<>]+/g,
    (oldUrl) => {
      const filename = decodeURIComponent(oldUrl.split('/').pop() ?? '')
      if (byFilename.has(filename)) return byFilename.get(filename)!
      const stripped = filename.replace(/-(\d{2,5})x(\d{2,5})(?=\.[a-z]+$)/i, '')
      if (byFilename.has(stripped)) return byFilename.get(stripped)!
      return oldUrl
    },
  )
}

const DIGITAL_NOMADS_ZH = `
<figure class="event-poster">
  <img src="POSTER_PLACEHOLDER" alt="國際數位遊牧者海報" />
</figure>
<p>新的生活方式 ✕ 工作的靈感據點 🌊✨<br />邀請國際數位遊牧者來花蓮，展開一場沉浸式體驗 🧳<br />🌿 從城市出發，走進在地文化、原民部落、自然山海。<br />🤝 透過產業媒合，與創作者、在地商家與多元夥伴連結。<br />🎬 這不只是一次旅行，而是未來生活方式的預演 — 親身感受花蓮的節奏、環境與合作可能 🌍</p>
<h3>📌 報名資訊</h3>
<ul>
  <li>正取 20 名、備取 5 名</li>
  <li>評選依據：專業背景、影響力、動機、合作潛力</li>
  <li>報名期間：4/30 – 5/8 23:59</li>
  <li>報名連結：<a href="https://forms.gle/pMHdKziQHLm5bcfg9">forms.gle/pMHdKziQHLm5bcfg9</a></li>
  <li>錄取公告：5/20 於本網站公布</li>
</ul>
<p>🧳 活動日期：5/29 – 5/31（3 天 2 夜）<br />💡 如果你是遠距工作者、自由工作者、工程師、設計師或創作者，正在尋找下一個理想的據點 — 這裡可能就是 📍<br />把這個訊息分享給你正在亞洲旅行的國際朋友，一起把花蓮放上未來的版圖 💯💯💯</p>
`.trim()

const POST_812_EN_TITLE = 'Hualien 33 Meetup ｜ March'
const POST_812_EN_EXCERPT = 'A monthly gathering for makers, founders and digital nomads in Hualien.'
const POST_812_EN_HTML = `
<p>Every month we host a small, casual gathering — locals, visiting nomads, founders, students — anyone with something to make or share.</p>
<p>March&rsquo;s edition centers on remote work and place-based projects. Bring a laptop, bring a question, bring something you want to talk about.</p>
<h3>When &amp; where</h3>
<ul>
  <li>Hualien Cloud Hub, Hualien City</li>
  <li>The last Wednesday of every month</li>
</ul>
<p>RSVPs are open via our usual channels — drop us a note at <a href="mailto:hello@hualien.cloud">hello@hualien.cloud</a>.</p>
`.trim()

async function main() {
  const payload = await getPayload({ config: payloadConfig as any })
  const byFilename = await buildUrlMap(payload)
  console.log(`media url map: ${byFilename.size} entries`)

  // ---------- 1) sweep all legacyHtml for stray hualien.cloud URLs ----------
  for (const collection of ['pages', 'posts'] as const) {
    for (const locale of ['zh-TW', 'en'] as const) {
      const all = await payload.find({ collection, limit: 0, locale })
      for (const doc of all.docs as Array<{ id: string | number; legacyHtml?: string }>) {
        const before = doc.legacyHtml ?? ''
        if (!before.includes('hualien.cloud')) continue
        const after = rewriteImageUrls(before, byFilename)
        if (after !== before) {
          await payload.update({
            collection,
            id: doc.id,
            locale,
            data: { legacyHtml: after } as any,
          })
          const count = (before.match(/hualien\.cloud/g) ?? []).length -
            (after.match(/hualien\.cloud/g) ?? []).length
          console.log(`  ✓ ${collection}#${doc.id} [${locale}]: rewrote ${count} URLs`)
        } else {
          console.log(`  - ${collection}#${doc.id} [${locale}]: no rewrites possible`)
        }
      }
    }
  }

  // ---------- 2) digital-nomads-2026 zh body ----------
  const dn = await payload.find({
    collection: 'posts',
    where: { slug: { equals: 'digital-nomads-2026' } },
    limit: 1,
  })
  if (dn.docs[0]) {
    // Pull poster URL from the en body (which still has it correctly)
    const enDoc = await payload.findByID({
      collection: 'posts',
      id: dn.docs[0].id,
      locale: 'en',
    })
    const posterMatch = (enDoc as any).legacyHtml?.match(/<img[^>]+src="([^"]+)"/i)
    const posterUrl = posterMatch?.[1] ?? ''
    const zhBody = DIGITAL_NOMADS_ZH.replace('POSTER_PLACEHOLDER', posterUrl)
    await payload.update({
      collection: 'posts',
      id: dn.docs[0].id,
      locale: 'zh-TW',
      data: { legacyHtml: zhBody } as any,
    })
    console.log('✓ digital-nomads-2026 zh body rewritten in proper Chinese')
  }

  // ---------- 3) /en/news/812 — author English version ----------
  const post812 = await payload.find({
    collection: 'posts',
    where: { slug: { equals: '812' } },
    limit: 1,
  })
  if (post812.docs[0]) {
    await payload.update({
      collection: 'posts',
      id: post812.docs[0].id,
      locale: 'en',
      data: {
        title: POST_812_EN_TITLE,
        excerpt: POST_812_EN_EXCERPT,
        legacyHtml: POST_812_EN_HTML,
      } as any,
    })
    console.log('✓ post#812 en content authored')
  }

  console.log('\n🎉 fixes applied')
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
