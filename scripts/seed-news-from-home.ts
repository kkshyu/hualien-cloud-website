/**
 * Migrate news-worthy items embedded in the legacy home page into proper
 * news posts. Three items identified by reviewing scrape/pages/home.html:
 *
 *   1. seoul-hualien-mou-2026  — 花蓮首爾雙城聯手遊牧全球記者會
 *   2. residency-first-batch-2026 — 第一梯次數位遊牧者進駐名單
 *   3. hualien33-may-threads-2026 — 五月三三小聚 × Threads 經營
 *
 *   pnpm tsx scripts/seed-news-from-home.ts
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import payloadConfig from '../src/payload.config.js'

type Locale = 'zh-TW' | 'en'

interface NewsItem {
  slug: string
  coverFilename: string
  publishedAt: string
  zh: { title: string; excerpt: string; body: string }
  en: { title: string; excerpt: string; body: string }
}

const ITEMS: NewsItem[] = [
  // 1) Seoul × Hualien press conference (April 22)
  {
    slug: 'seoul-hualien-mou-2026',
    coverFilename: 'S__89128966.jpg',
    publishedAt: '2026-04-22T10:00:00.000Z',
    zh: {
      title: '花蓮首爾 雙城聯手遊牧全球',
      excerpt: '花蓮縣政府與韓國首爾數位遊牧新創 Hoppers 共同啟動合作，號召全球數位遊牧者齊聚花蓮。',
      body: `
<p>花蓮縣府於 4 月 22 日在花蓮市府前路 3 號花蓮雲基地辦理「花蓮首爾 雙城聯手遊牧全球」記者會，縣長徐榛蔚與韓國首爾數位遊牧新創公司 Hoppers 執行長趙庭賢（Jeong-Hyun Cho）共同啟動合作儀式，號召全球數位遊牧者齊聚花蓮，一起創造 Workation、共享辦公、社群交流與國際基地鏈結等多元體驗，讓花蓮走向世界、世界走進花蓮。</p>
<h3>合作重點</h3>
<ul>
  <li><strong>跨城互訪：</strong>建立花蓮 ✕ 首爾雙基地通道，遊牧者可在兩地之間延伸停留與工作。</li>
  <li><strong>社群媒合：</strong>透過 Hoppers 既有的國際遊牧社群，將花蓮節點寫進全球版圖。</li>
  <li><strong>產業鏈結：</strong>導入跨國共創專案、駐點計畫，與在地創作者、店家、文創品牌互動。</li>
</ul>
<p>花蓮雲基地將作為城市創新與產業轉型的重要場域，提供產、學、研機構應用創新科技與服務模式的實驗平台，實現城市議題解決方案的試辦與驗證。</p>
`.trim(),
    },
    en: {
      title: 'Seoul × Hualien — Two Cities, One Global Journey',
      excerpt: 'Hualien County Government partners with Seoul-based digital nomad startup Hoppers to connect Hualien to the global nomad network.',
      body: `
<p>On April 22, Hualien County Government hosted a press conference at the Hualien Cloud Hub (No. 3 Fuqian Road, Hualien City). County Magistrate <strong>Hsu Chen-wei</strong> and <strong>Jeong-Hyun Cho</strong>, CEO of Seoul-based digital nomad startup <strong>Hoppers</strong>, kicked off the &ldquo;Seoul × Hualien — Two Cities, One Global Journey&rdquo; partnership.</p>
<p>The collaboration invites digital nomads from around the world to gather in Hualien — to build workation programmes, shared offices, community exchanges, and an international hub network that lets Hualien reach the world while the world steps into Hualien.</p>
<h3>What the partnership covers</h3>
<ul>
  <li><strong>Two-city flow:</strong> a connected route between Hualien and Seoul, so nomads can extend stays and work between both bases.</li>
  <li><strong>Community access:</strong> the Hualien node enters Hoppers&rsquo; existing international nomad community.</li>
  <li><strong>Industry tie-ins:</strong> cross-border co-creation projects and residencies that link with local makers, businesses, and cultural brands.</li>
</ul>
<p>The Cloud Hub is built as a sandbox for urban innovation and industry transformation — a venue where industry, academia, and research can pilot new technologies and service models in real conditions.</p>
`.trim(),
    },
  },
  // 2) First batch of digital nomad residents
  {
    slug: 'residency-first-batch-2026',
    coverFilename: 'IMG_1720.png',
    publishedAt: '2026-03-25T10:00:00.000Z',
    zh: {
      title: '公告｜雲基地 115 年度第一梯次數位遊牧者進駐名單',
      excerpt: '第一梯次徵選作業順利完成，五位入選者來自希臘、日本、印度、臺灣與德國，跨足科技、設計、行銷與內容創作。',
      body: `
<p>本計畫第一梯次數位遊牧者徵選作業已順利完成，感謝各界踴躍報名與支持！入選者來自多元專業領域，涵蓋科技、設計、行銷及內容創作等，展現豐富的國際視野與創新能量。</p>
<p>👏 讓我們誠摯熱情歡迎來自全球各地的進駐者們 👏</p>
<ul>
  <li>希臘 🇬🇷　Ni***ta&nbsp;Ko***li</li>
  <li>日本 🇯🇵　Se***ko&nbsp;Ya***hi</li>
  <li>印度 🇮🇳　An***ur&nbsp;Tr***hi</li>
  <li>臺灣 🇹🇼　王***明</li>
  <li>德國 🇩🇪　SE***KE&nbsp;HA***KE&nbsp;HE***NG</li>
</ul>
<p>請入選者留意錄取通知電子郵件，並依通知辦理後續報到事宜；未入選者亦感謝參與，誠摯邀請持續關注後續梯次招募資訊。</p>
`.trim(),
    },
    en: {
      title: 'First Batch of Selected Digital Nomads · 2026 Residency',
      excerpt: 'Five residents from Greece, Japan, India, Taiwan, and Germany — spanning tech, design, marketing, and content creation — join the first cohort.',
      body: `
<p>📢 Announcement | First Batch of Selected Digital Nomads for the Cloud Hub 2026 Residency Programme</p>
<p>The selection process for the first group of digital nomads has been successfully completed. We sincerely thank everyone for their enthusiastic applications and support. The selected participants come from diverse professional backgrounds — tech, design, marketing, and content creation — and bring strong international perspective and creative energy.</p>
<p>👏 Let us warmly welcome our selected residents from around the world! 👏</p>
<ul>
  <li>Greece 🇬🇷&nbsp;&nbsp;Ni***ta&nbsp;Ko***li</li>
  <li>Japan 🇯🇵&nbsp;&nbsp;Se***ko&nbsp;Ya***hi</li>
  <li>India 🇮🇳&nbsp;&nbsp;An***ur&nbsp;Tr***hi</li>
  <li>Taiwan 🇹🇼&nbsp;&nbsp;Wa***ng&nbsp;Ka***ng</li>
  <li>Germany 🇩🇪&nbsp;&nbsp;Se***ke&nbsp;Ha***ke&nbsp;He***ng</li>
</ul>
<p>Selected applicants are kindly requested to check their admission notification emails and follow the onboarding instructions. For those not selected, we sincerely appreciate your participation and warmly encourage you to stay tuned for future cohorts.</p>
`.trim(),
    },
  },
  // 3) Hualien 33 May meetup — Threads workshop
  {
    slug: 'hualien33-may-threads-2026',
    coverFilename: '海報-1.png',
    publishedAt: '2026-05-05T10:00:00.000Z',
    zh: {
      title: '五月三三小聚｜Threads 經營實戰',
      excerpt: '5/20 邀請 Threads 品牌策略顧問 Fianne 有魚帶你拆解經營心法，找到品牌定位、學會演算法與發文節奏。',
      body: `
<p>📢 <strong>花蓮雲基地 ☁️ 免費課程</strong>　#Threads經營　#三三小聚　#社群行銷　#自由工作者必學</p>
<p>在這個社群競爭白熱化的時代，Threads 已成為個人品牌搶佔流量的新戰場。五月三三小聚特別邀請 Threads 品牌策略顧問 <strong>Fianne 有魚</strong>，憑藉 8 年整合行銷實戰經驗，帶領大家系統化拆解經營心法，打造真實的品牌影響力。</p>
<h3>✨ 課程亮點</h3>
<ul>
  <li><strong>找到品牌定位：</strong>從核心價值出發，梳理出專屬的內容方向，讓受眾一眼就記住是誰。</li>
  <li><strong>拆解演算法與發文節奏：</strong>理解 Threads 平台邏輯，用持續發文與主動海巡的雙引擎，自然會讓對的人看見你。</li>
</ul>
<h3>📅 活動資訊</h3>
<ul>
  <li>時間：2026 / 5 / 20（三）18:30 – 20:00</li>
  <li>地點：花蓮雲基地（花蓮縣花蓮市府前路 3 號）</li>
  <li>報名：<a href="https://forms.gle/MzXYdgN2dx88Wv5q8">forms.gle/MzXYdgN2dx88Wv5q8</a></li>
</ul>
<p>更多資訊請鎖定本網站或 <strong>花蓮雲基地 Hualiencloudhub – HCH</strong>。</p>
`.trim(),
    },
    en: {
      title: 'May Hualien 33 Meetup ｜ Threads in Practice',
      excerpt: 'May 20 — Threads strategist Fianne walks you through positioning, the algorithm, and a posting cadence that finds your audience.',
      body: `
<p>📢 <strong>Free workshop at Hualien Cloud Hub.</strong>　#Threads　#Hualien33　#community　#freelancers</p>
<p>Threads is now a frontline for personal brands fighting for attention. The May edition of Hualien 33 hosts Threads strategist <strong>Fianne</strong>, who brings eight years of integrated-marketing experience to break down — step by step — what actually works on the platform.</p>
<h3>What we&rsquo;ll cover</h3>
<ul>
  <li><strong>Find your positioning:</strong> start from your core values, find the content lane that&rsquo;s yours, and become recognisable on first read.</li>
  <li><strong>Read the algorithm, set a cadence:</strong> understand Threads&rsquo; platform logic, then run the two-engine play of consistent posting plus active engagement.</li>
</ul>
<h3>When &amp; where</h3>
<ul>
  <li>Wed, May 20, 2026 — 18:30 to 20:00</li>
  <li>Hualien Cloud Hub — No. 3 Fuqian Road, Hualien City</li>
  <li>RSVP: <a href="https://forms.gle/MzXYdgN2dx88Wv5q8">forms.gle/MzXYdgN2dx88Wv5q8</a></li>
</ul>
<p>Updates land on this site and on <strong>Hualien Cloud Hub – HCH</strong>.</p>
`.trim(),
    },
  },
]

async function findMediaIdByFilename(payload: any, filename: string): Promise<string | number | null> {
  const r = await payload.find({
    collection: 'media',
    where: { filename: { equals: filename } },
    limit: 1,
    depth: 0,
  })
  return r.docs[0]?.id ?? null
}

async function findPostIdBySlug(payload: any, slug: string): Promise<string | number | null> {
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
      console.warn(`  ! cover '${item.coverFilename}' not found in media; skipping ${item.slug}`)
      continue
    }

    const existingId = await findPostIdBySlug(payload, item.slug)

    // Step 1 — base record (zh-TW locale by default)
    const baseData = {
      type: 'news' as const,
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
        locale: 'zh-TW' as Locale,
        data: baseData as any,
      })
      postId = existingId
      console.log(`  ✎ updated zh — posts#${postId} ${item.slug}`)
    } else {
      const created = await payload.create({
        collection: 'posts',
        locale: 'zh-TW' as Locale,
        data: baseData as any,
      })
      postId = created.id
      console.log(`  + created zh — posts#${postId} ${item.slug}`)
    }

    // Step 2 — en locale overrides
    await payload.update({
      collection: 'posts',
      id: postId,
      locale: 'en' as Locale,
      data: {
        title: item.en.title,
        excerpt: item.en.excerpt,
        legacyHtml: item.en.body,
      } as any,
    })
    console.log(`  ✎ updated en — posts#${postId} ${item.slug}`)
  }

  console.log('\n🎉 news seeding complete')
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
