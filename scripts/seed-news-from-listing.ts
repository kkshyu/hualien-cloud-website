/**
 * Seed news posts extracted from the legacy /news listing page
 * (scrape/pages/news.html). 11 items — mostly past meet-ups and forums —
 * preserved as a chronological archive.
 *
 *   pnpm tsx scripts/seed-news-from-listing.ts
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import payloadConfig from '../src/payload.config.js'

interface NewsItem {
  slug: string
  publishedAt: string // ISO with TPE offset
  coverFilename: string // exact match in media collection
  zh: { title: string; excerpt: string; body: string }
  en: { title: string; excerpt: string; body: string }
}

const ITEMS: NewsItem[] = [
  {
    slug: 'taiwan-maritime-nomad-2025',
    publishedAt: '2025-09-26T19:30:00+08:00',
    coverFilename:
      'group-young-college-students-smart-casual-wear-campus-friends-brainstorming-meeting-talking-discussing-work-ideas-new-design-project-modern-office-coworker-teamwork-startup-concept-scaled.jpg',
    zh: {
      title: '台灣之光 海上遊牧打破框架',
      excerpt: '雲基地 ✕ AI 遠距工作｜2025 年 9 月 26 日（四）19:30',
      body: `
<p>📅 2025 年 9 月 26 日（四）19:30</p>
<p>主題：<strong>雲基地 ✕ AI 遠距工作</strong></p>
<p>從遊艇到雲端，看見台灣團隊把工作場域延伸到海上的可能。一場由花蓮雲基地策動、結合 AI 與遠距協作的小聚，邀請你一起打破對「辦公室」的想像。</p>
<p>延伸了解：<a href="https://www.facebook.com/theHappiestExplorer/photos?locale=zh_TW">The Happiest Explorer</a></p>
`.trim(),
    },
    en: {
      title: 'Taiwan Pride: Maritime Nomads Break the Frame',
      excerpt: 'Cloud Hub × AI remote work · Thu, Sep 26 2025, 19:30',
      body: `
<p>📅 Thursday, September 26, 2025 — 19:30</p>
<p>Theme: <strong>Cloud Hub × AI remote work</strong></p>
<p>From yachts to cloud collaboration — a small gathering at Hualien Cloud Hub exploring how Taiwanese teams extend the workplace out to sea, with AI and async tools as the connective tissue.</p>
<p>More: <a href="https://www.facebook.com/theHappiestExplorer/photos?locale=zh_TW">The Happiest Explorer</a></p>
`.trim(),
    },
  },
  {
    slug: 'nomad-first-ticket-2025',
    publishedAt: '2025-09-26T15:30:00+08:00',
    coverFilename: 'LINE_ALBUM_Hualien-Photos_250824_7.jpg',
    zh: {
      title: '成為數位遊牧的第一張門票',
      excerpt: '雲基地 ✕ Manabu hubs｜2025 年 9 月 26 日（四）15:30',
      body: `
<p>📅 2025 年 9 月 26 日（四）15:30</p>
<p>主題：<strong>雲基地 ✕ Manabu hubs</strong></p>
<p>給想開始遊牧、還在門口張望的你。Manabu hubs 帶來日本與東南亞的駐點經驗，現場分享「從哪個城市開始、怎麼選據點、怎麼把第一個月活下來」的實用心法。</p>
<p>延伸了解：<a href="https://www.linkedin.com/in/chinmeiyu/">主講者 LinkedIn</a></p>
`.trim(),
    },
    en: {
      title: 'Your First Ticket to Digital Nomad Life',
      excerpt: 'Cloud Hub × Manabu hubs · Thu, Sep 26 2025, 15:30',
      body: `
<p>📅 Thursday, September 26, 2025 — 15:30</p>
<p>Theme: <strong>Cloud Hub × Manabu hubs</strong></p>
<p>For people standing at the door, wondering where to begin. Manabu hubs draws on residency experience across Japan and Southeast Asia to share the practical playbook — pick the city, choose the base, survive the first month.</p>
<p>Speaker: <a href="https://www.linkedin.com/in/chinmeiyu/">LinkedIn</a></p>
`.trim(),
    },
  },
  {
    slug: 'kickstart-japan-trip-2025',
    publishedAt: '2025-08-28T15:00:00+08:00',
    coverFilename: 'LINE_ALBUM_Hualien-Photos_250824_22.jpg',
    zh: {
      title: '助您啟動日本之旅！',
      excerpt: '2025 年 8 月 28 日（四）15:00 · 已結束',
      body: `
<p>📅 2025 年 8 月 28 日（四）15:00　|　狀態：<strong>已結束</strong></p>
<p>把雲基地當作起點，把日本當作下一站。本場分享聚焦在「離台前的準備、抵日後的第一週、長住的工作節奏」三段式經驗，給準備啟動日本之旅的遊牧者。</p>
<p>活動頁：<a href="https://lu.ma/h5xxxmw2">lu.ma 活動連結</a></p>
`.trim(),
    },
    en: {
      title: 'Kickstart Your Japan Trip',
      excerpt: 'Thu, Aug 28 2025, 15:00 · Past event',
      body: `
<p>📅 Thursday, August 28, 2025 — 15:00　|　Status: <strong>past event</strong></p>
<p>Use Hualien as your launchpad, Japan as the next stop. The session walked through three stages — preparing before departure, surviving the first week on the ground, and finding a sustainable working rhythm long-term.</p>
<p>Event page: <a href="https://lu.ma/h5xxxmw2">lu.ma</a></p>
`.trim(),
    },
  },
  {
    slug: 'nomad-mini-trip-2025',
    publishedAt: '2025-08-22T03:30:00+08:00',
    coverFilename: '0d2a60ce-4527-4ac4-bcd6-c49a251db96e.jpg',
    zh: {
      title: '遊牧小旅行',
      excerpt: '2025 年 8 月 22 日（五）· 已結束',
      body: `
<p>📅 2025 年 8 月 22 日（五）　|　狀態：<strong>已結束</strong></p>
<p>把工作打包進背包，跟著雲基地走進花蓮的縱谷與海岸。一日小旅行，邊走、邊聊、邊把點子留在路上。</p>
`.trim(),
    },
    en: {
      title: 'Nomad Mini Trip',
      excerpt: 'Fri, Aug 22 2025 · Past event',
      body: `
<p>📅 Friday, August 22, 2025　|　Status: <strong>past event</strong></p>
<p>Pack the laptop, follow the Cloud Hub into Hualien&rsquo;s rift valley and coastline. A one-day micro-trip — walking, talking, and leaving ideas along the road.</p>
`.trim(),
    },
  },
  {
    slug: 'industry-community-international-2025',
    publishedAt: '2025-08-21T10:00:00+08:00',
    coverFilename:
      'group-young-college-students-smart-casual-wear-campus-friends-brainstorming-meeting-talking-discussing-work-ideas-new-design-project-modern-office-coworker-teamwork-startup-concept-scaled.jpg',
    zh: {
      title: '展望新局：產業 × 社群 × 國際',
      excerpt: '2025 年 8 月 21 日（四）10:00 · 已結束',
      body: `
<p>📅 2025 年 8 月 21 日（四）10:00　|　狀態：<strong>已結束</strong></p>
<p>把產業、社群、國際三條軸線拉在一起對話，從花蓮看見下一階段的工作生態。當天有產業代表、地方品牌、國際遊牧者同台交流。</p>
<p>新聞報導：<a href="https://www.hl.gov.tw/News_Content.aspx?n=32725&amp;s=192221">花蓮縣政府新聞稿</a></p>
`.trim(),
    },
    en: {
      title: 'New Horizons: Industry × Community × International',
      excerpt: 'Thu, Aug 21 2025, 10:00 · Past event',
      body: `
<p>📅 Thursday, August 21, 2025 — 10:00　|　Status: <strong>past event</strong></p>
<p>Three threads — industry, community, international — pulled into one conversation. From Hualien, a glimpse at the next phase of the work ecosystem, with industry leaders, local brands and international nomads sharing the table.</p>
<p>Press: <a href="https://www.hl.gov.tw/News_Content.aspx?n=32725&amp;s=192221">Hualien County Government</a></p>
`.trim(),
    },
  },
  {
    slug: 'intl-startup-exchange-2025',
    publishedAt: '2025-08-20T18:30:00+08:00',
    coverFilename: '未命名設計-1.jpg',
    zh: {
      title: '國際新創交流活動',
      excerpt: '2025 年 8 月 20 日（三）18:30 · 已結束',
      body: `
<p>📅 2025 年 8 月 20 日（三）18:30　|　狀態：<strong>已結束</strong></p>
<p>一場面向國際新創的小型交流晚會。雲基地把不同領域的創業者放在同一張桌邊，從產品、市場到資金，把對話從花蓮延伸到亞洲。</p>
`.trim(),
    },
    en: {
      title: 'International Startup Exchange',
      excerpt: 'Wed, Aug 20 2025, 18:30 · Past event',
      body: `
<p>📅 Wednesday, August 20, 2025 — 18:30　|　Status: <strong>past event</strong></p>
<p>A small evening exchange built around international founders. The Cloud Hub put builders from different fields around one table — product, market, capital — extending the conversation from Hualien outward across Asia.</p>
`.trim(),
    },
  },
  {
    slug: 'digital-nomad-forum-2025',
    publishedAt: '2025-07-19T10:00:00+08:00',
    coverFilename: 'LINE_ALBUM_0627-AI小聚_250628_7.jpg',
    zh: {
      title: '數位遊牧論壇',
      excerpt: '2025 年 7 月 19 日（六）10:00 · 已結束',
      body: `
<p>📅 2025 年 7 月 19 日（六）10:00　|　狀態：<strong>已結束</strong></p>
<p>一整天的論壇，把「數位遊牧」這個詞放回它最具體的場景：怎麼工作、怎麼移動、怎麼留下、怎麼參與在地。多場主題講座與圓桌討論，從花蓮現場直送。</p>
`.trim(),
    },
    en: {
      title: 'Digital Nomad Forum',
      excerpt: 'Sat, Jul 19 2025, 10:00 · Past event',
      body: `
<p>📅 Saturday, July 19, 2025 — 10:00　|　Status: <strong>past event</strong></p>
<p>A full-day forum that grounded &ldquo;digital nomad&rdquo; back to its concrete scenes — how to work, how to move, how to stay, how to engage locally. Talks and round tables broadcast straight from Hualien.</p>
`.trim(),
    },
  },
  {
    slug: 'ai-meetup-productivity-2025',
    publishedAt: '2025-06-27T14:00:00+08:00',
    coverFilename: '45326.jpg',
    zh: {
      title: 'AI 小聚 ✕ 提高您的生產力！',
      excerpt: '2025 年 6 月 27 日（五）14:00 · 已結束',
      body: `
<p>📅 2025 年 6 月 27 日（五）14:00　|　狀態：<strong>已結束</strong></p>
<p>AI 工具已經不是炫技，而是日常工作流的一部分。這場小聚從寫作、整理、研究到自動化，分享在花蓮這個遠距現場、把生產力真正抬起來的實作經驗。</p>
<p>新聞報導：<a href="https://www.storm.mg/article/11050443">風傳媒報導</a></p>
`.trim(),
    },
    en: {
      title: 'AI Meetup × Boost Your Productivity',
      excerpt: 'Fri, Jun 27 2025, 14:00 · Past event',
      body: `
<p>📅 Friday, June 27, 2025 — 14:00　|　Status: <strong>past event</strong></p>
<p>AI tools are no longer demo-stage; they live inside everyday workflows. This meetup walked through writing, organising, research and automation — concrete practices for lifting productivity from a remote-first site like Hualien.</p>
<p>Press: <a href="https://www.storm.mg/article/11050443">Storm Media</a></p>
`.trim(),
    },
  },
  {
    slug: 'coworker-meetup-2025',
    publishedAt: '2025-06-20T09:30:00+08:00',
    coverFilename: '3c6a236e-c36c-4790-af3b-431e0b01bfbc.jpg',
    zh: {
      title: '一日同事小聚 ✕ 工作經驗分享',
      excerpt: '2025 年 6 月 20 日（五）09:30 · 已結束',
      body: `
<p>📅 2025 年 6 月 20 日（五）09:30　|　狀態：<strong>已結束</strong></p>
<p>一天的時間，把素未謀面的人變成「今天的同事」。從早晨咖啡開始，到下午的小組分享，把彼此的工作節奏、卡點、解法攤在桌上聊。</p>
<p>新聞報導：<a href="https://www.hl.gov.tw/News_Content.aspx?n=32725&amp;s=181870">花蓮縣政府新聞稿</a></p>
`.trim(),
    },
    en: {
      title: 'One-Day Coworker Meetup × Work Notes',
      excerpt: 'Fri, Jun 20 2025, 09:30 · Past event',
      body: `
<p>📅 Friday, June 20, 2025 — 09:30　|　Status: <strong>past event</strong></p>
<p>Strangers became &ldquo;coworkers for the day&rdquo; in a single afternoon. From morning coffee to small-group shares, the meetup put working rhythms, blockers and fixes openly on the table.</p>
<p>Press: <a href="https://www.hl.gov.tw/News_Content.aspx?n=32725&amp;s=181870">Hualien County Government</a></p>
`.trim(),
    },
  },
  {
    slug: 'dragonboat-festival-2025',
    publishedAt: '2025-05-30T10:00:00+08:00',
    coverFilename:
      'ksnewsim20250605m07-2-20250605m07-2-2025-06-05_14-46-06_044652.jpg',
    zh: {
      title: '粽香飄雲基地，文化交流暖端午',
      excerpt: '2025 年 5 月 30 日（星期五）10:00 · 已結束',
      body: `
<p>📅 2025 年 5 月 30 日（星期五）10:00　|　狀態：<strong>已結束</strong></p>
<p>端午前夕，雲基地用粽子當開場，把在地夥伴與來訪遊牧者放進同一個廚房。從原民風味到傳統口味，一邊包粽，一邊聊文化的差異與重疊。</p>
<p>新聞報導：<a href="https://www.hl.gov.tw/News_Content.aspx?n=32725&amp;s=180120">花蓮縣政府新聞稿</a></p>
`.trim(),
    },
    en: {
      title: 'Zongzi at the Cloud Hub — A Dragon Boat Cultural Exchange',
      excerpt: 'Fri, May 30 2025, 10:00 · Past event',
      body: `
<p>📅 Friday, May 30, 2025 — 10:00　|　Status: <strong>past event</strong></p>
<p>On the eve of Dragon Boat Festival, the Cloud Hub used zongzi as the opening line. Local partners and visiting nomads shared the same kitchen — from indigenous recipes to family traditions — wrapping rice while talking about cultural overlaps and differences.</p>
<p>Press: <a href="https://www.hl.gov.tw/News_Content.aspx?n=32725&amp;s=180120">Hualien County Government</a></p>
`.trim(),
    },
  },
  {
    slug: 'cloudhub-launch-2025',
    publishedAt: '2025-05-29T10:00:00+08:00',
    coverFilename: 'LINE_ALBUM_Hualien-Photos_250824_22.jpg', // fallback — original card had no image
    zh: {
      title: '雲基地點亮數位遊牧願景',
      excerpt: '2025 年 5 月 29 日（星期四）10:00 · 已結束',
      body: `
<p>📅 2025 年 5 月 29 日（星期四）10:00　|　狀態：<strong>已結束</strong></p>
<p>花蓮雲基地正式啟用。一個由縣府主導、結合在地、產業、國際遊牧的工作場域，從這天起把「友善標章 × 在地轉型 × 亞太遠距工作熱點」三件事疊在一起。</p>
<p>新聞報導：<a href="https://tw.news.yahoo.com/%E8%8A%B1%E8%93%AE%E9%9B%B2%E5%9F%BA%E5%9C%B0%E9%BB%9E%E4%BA%AE%E6%95%B8%E4%BD%8D%E9%81%8A%E7%89%A7%E9%A1%98%E6%99%AF-%E5%8F%8B%E5%96%84%E6%A8%99%E7%AB%A0-%E5%8A%A9%E5%9C%A8%E5%9C%B0%E8%BD%89%E5%9E%8B%E6%96%B0%E5%8B%95%E8%83%BD%E6%89%93%E9%80%A0%E4%BA%9E%E5%A4%AA%E9%81%A0%E8%B7%9D%E5%B7%A5%E4%BD%9C%E6%96%B0%E7%86%B1%E9%BB%9E-091842160.html">Yahoo 新聞</a></p>
`.trim(),
    },
    en: {
      title: 'Cloud Hub Lights Up the Digital Nomad Vision',
      excerpt: 'Thu, May 29 2025, 10:00 · Past event',
      body: `
<p>📅 Thursday, May 29, 2025 — 10:00　|　Status: <strong>past event</strong></p>
<p>Hualien Cloud Hub officially opened. A workplace led by the county government and shaped together with locals, industry and international nomads — from this day forward, stacking three things on top of each other: a friendly-place mark, regional transformation, and an Asia-Pacific remote-work hotspot.</p>
<p>Press: <a href="https://tw.news.yahoo.com/%E8%8A%B1%E8%93%AE%E9%9B%B2%E5%9F%BA%E5%9C%B0%E9%BB%9E%E4%BA%AE%E6%95%B8%E4%BD%8D%E9%81%8A%E7%89%A7%E9%A1%98%E6%99%AF-%E5%8F%8B%E5%96%84%E6%A8%99%E7%AB%A0-%E5%8A%A9%E5%9C%A8%E5%9C%B0%E8%BD%89%E5%9E%8B%E6%96%B0%E5%8B%95%E8%83%BD%E6%89%93%E9%80%A0%E4%BA%9E%E5%A4%AA%E9%81%A0%E8%B7%9D%E5%B7%A5%E4%BD%9C%E6%96%B0%E7%86%B1%E9%BB%9E-091842160.html">Yahoo News</a></p>
`.trim(),
    },
  },
]

async function findMediaIdByFilename(payload: any, filename: string) {
  const r = await payload.find({
    collection: 'media',
    where: { filename: { equals: filename } },
    limit: 1,
    depth: 0,
  })
  return r.docs[0]?.id ?? null
}

async function findPostIdBySlug(payload: any, slug: string) {
  const r = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  })
  return r.docs[0]?.id ?? null
}

async function main() {
  const payload = await getPayload({ config: payloadConfig as any })

  for (const item of ITEMS) {
    const coverId = await findMediaIdByFilename(payload, item.coverFilename)
    if (!coverId) {
      console.warn(`  ! cover '${item.coverFilename}' not in media collection; skipping ${item.slug}`)
      continue
    }
    const existingId = await findPostIdBySlug(payload, item.slug)

    const baseData = {
      title: item.zh.title,
      slug: item.slug,
      excerpt: item.zh.excerpt,
      legacyHtml: item.zh.body,
      cover: coverId,
      publishedAt: item.publishedAt,
      status: 'published' as const,
    }

    let postId: string | number
    if (existingId) {
      await payload.update({
        collection: 'posts',
        id: existingId,
        locale: 'zh-TW',
        data: baseData as any,
      })
      postId = existingId
      console.log(`  ✎ zh — posts#${postId} ${item.slug}`)
    } else {
      const created = await payload.create({
        collection: 'posts',
        locale: 'zh-TW',
        data: baseData as any,
      })
      postId = created.id
      console.log(`  + zh — posts#${postId} ${item.slug}`)
    }

    await payload.update({
      collection: 'posts',
      id: postId,
      locale: 'en',
      data: {
        title: item.en.title,
        excerpt: item.en.excerpt,
        legacyHtml: item.en.body,
      } as any,
    })
    console.log(`  ✎ en — posts#${postId} ${item.slug}`)
  }

  console.log(`\n🎉 ${ITEMS.length} archived news items seeded`)
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
