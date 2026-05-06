/**
 * Final pass:
 *  1) More aggressive URL rewrite (handle -scaled / -scaled-eN+ / -edited / prefix match).
 *  2) Curate post 812 zh-TW body — strip the duplicated English half.
 *  3) Curate move-in zh-TW body — strip leftover bilingual bullets and provide
 *     clean Chinese 申請須知 content.
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import payloadConfig from '../src/payload.config.js'

async function buildIndex(payload: any) {
  const all = await payload.find({ collection: 'media', limit: 0, depth: 0 })
  const byFilename = new Map<string, string>()
  const byBase = new Map<string, string>()
  for (const m of all.docs as Array<{ filename?: string; url?: string }>) {
    if (!m.filename || !m.url) continue
    byFilename.set(m.filename, m.url)
    const ext = m.filename.match(/\.[a-z]+$/i)?.[0] ?? ''
    const noExt = ext ? m.filename.slice(0, -ext.length) : m.filename
    const base = noExt
      .replace(/-scaled-e\d+$/i, '')
      .replace(/-scaled$/i, '')
      .replace(/-edited(?:-\d+)?$/i, '')
    // Prefer the first one we see for a given base; longer "base" candidates
    // overwrite shorter only if not already present.
    if (!byBase.has(base + ext)) byBase.set(base + ext, m.url)
    if (!byBase.has(base)) byBase.set(base, m.url)
  }
  return { byFilename, byBase }
}

function lookup(
  filename: string,
  byFilename: Map<string, string>,
  byBase: Map<string, string>,
): string | undefined {
  if (byFilename.has(filename)) return byFilename.get(filename)
  const noSize = filename.replace(/-(\d{2,5})x(\d{2,5})(?=\.[a-z]+$)/i, '')
  if (byFilename.has(noSize)) return byFilename.get(noSize)
  if (byBase.has(noSize)) return byBase.get(noSize)
  const ext = noSize.match(/\.[a-z]+$/i)?.[0] ?? ''
  const noExt = ext ? noSize.slice(0, -ext.length) : noSize
  if (byBase.has(noExt)) return byBase.get(noExt)
  return undefined
}

function rewriteImageUrls(
  html: string,
  byFilename: Map<string, string>,
  byBase: Map<string, string>,
): string {
  return html.replace(
    /https?:\/\/(?:www\.)?hualien\.cloud\/wp-content\/uploads\/[^"'\s)<>]+/g,
    (oldUrl) => {
      const filename = decodeURIComponent(oldUrl.split('/').pop() ?? '')
      const newUrl = lookup(filename, byFilename, byBase)
      return newUrl ?? oldUrl
    },
  )
}

const POST_812_ZH = `
<p>✦ <strong>每月第三個星期三，我們相聚</strong> ✦</p>
<p>你有多久，沒有真正「下班」了？<br />一邊旅行、一邊工作，聽起來很自由——但只有數位遊牧者自己知道：</p>
<ul>
  <li>不斷換城市，很難建立深度的關係；</li>
  <li>隨時隨地可以工作，卻變成隨時隨地都在工作；</li>
  <li>一整天盯著螢幕，身體僵硬、時差混亂；</li>
  <li>圈子裡瀰漫著「我要做更多」的焦慮，不允許自己慢下來；</li>
  <li>每到一個新地方就要重新適應，內心常常感到漂浮和失控。</li>
</ul>
<p>看似自由的生活底下，藏著疲憊。</p>
<p>這個三月，三三小聚邀請你按下暫停鍵。冥想，不需要固定地點，不需要任何器材，只需要你的身體和呼吸——它是你在不斷移動的生活中，唯一可以帶著走的「家」。</p>
<p>冥想師「丹尼爾先生」擅長將身心靈知識落地實踐，用溫暖、包容的引導方式，帶你在外在不斷變動的生活中，找到一個穩定的內在定錨。讓大腦真正休息，重新感受「此刻、此地」的自己，而不是永遠活在下一個目的地的計畫裡。</p>
<h3>📅 活動資訊</h3>
<ul>
  <li>日期：2026 年 3 月 18 日（三）18:30–20:00</li>
  <li>地點：花蓮雲基地（花蓮縣花蓮市府前路 3 號）</li>
  <li>主辦單位：花蓮縣政府</li>
  <li>執行單位：遊遊股份有限公司</li>
</ul>
`.trim()

const MOVE_IN_ZH = `
<h2>數位遊牧進駐空間</h2>
<p>我們提供以週、以月為單位的駐留空間，給遠端工作者、創作者、團隊、駐留藝術家。一張桌、一張床、一段在花蓮做事的時間。</p>

<h3>空間簡介</h3>
<ul>
  <li>個人工作室（私人房間）</li>
  <li>共創空間（共用辦公桌與會議區）</li>
  <li>戶外空間（與在地社群共用的庭院）</li>
  <li>雲咖啡（週間早午到下午茶時段）</li>
  <li>獨立衛浴、空調、高速網路</li>
  <li>步行可達在地便利設施</li>
  <li>每月遊牧者交流聚會</li>
  <li>可預約私人會議室</li>
  <li>駐點人員平日現場協助</li>
</ul>

<h3>申請須知</h3>
<ul>
  <li>遵守館內公約與安全規範。</li>
  <li>進駐期間請愛惜公共空間與設備，未經允許勿自行更動配置。</li>
  <li>有任何重大事件或設備異常，請第一時間與駐點人員聯絡。</li>
  <li>申請以三天兩夜為基本單位，亦接受週、月為單位的中長期駐留。</li>
  <li>主辦單位將依申請者背景、駐留動機、貢獻計畫進行審核。</li>
</ul>

<h3>申請表單</h3>
<p>請來信 <a href="mailto:hello@hualien.cloud">hello@hualien.cloud</a>，附上你的姓名、駐留期間、簡介，以及希望在花蓮做的事。</p>
`.trim()

async function main() {
  const payload = await getPayload({ config: payloadConfig as any })
  const { byFilename, byBase } = await buildIndex(payload)
  console.log(`media index: ${byFilename.size} filenames + ${byBase.size} base keys`)

  // --- 1) Sweep again with stronger lookup ---
  let totalRewrites = 0
  for (const collection of ['pages', 'posts'] as const) {
    for (const locale of ['zh-TW', 'en'] as const) {
      const all = await payload.find({ collection, limit: 0, locale })
      for (const doc of all.docs as Array<{ id: string | number; legacyHtml?: string }>) {
        const before = doc.legacyHtml ?? ''
        if (!before.includes('hualien.cloud')) continue
        const after = rewriteImageUrls(before, byFilename, byBase)
        if (after !== before) {
          await payload.update({
            collection,
            id: doc.id,
            locale,
            data: { legacyHtml: after } as any,
          })
          const diff = (before.match(/hualien\.cloud/g) ?? []).length -
            (after.match(/hualien\.cloud/g) ?? []).length
          totalRewrites += diff
          console.log(`  ✓ ${collection}#${doc.id} [${locale}] rewrote ${diff} URLs`)
        } else {
          const remaining = (before.match(/hualien\.cloud/g) ?? []).length
          console.log(`  - ${collection}#${doc.id} [${locale}] unchanged (${remaining} URLs left unmatched)`)
        }
      }
    }
  }
  console.log(`Total URLs rewritten this pass: ${totalRewrites}`)

  // --- 2) Post 812 zh body ---
  const post812 = await payload.find({
    collection: 'posts',
    where: { slug: { equals: '812' } },
    limit: 1,
  })
  if (post812.docs[0]) {
    await payload.update({
      collection: 'posts',
      id: post812.docs[0].id,
      locale: 'zh-TW',
      data: { legacyHtml: POST_812_ZH } as any,
    })
    console.log('✓ post#812 zh body recurated (English half stripped)')
  }

  // --- 3) Move-in zh body ---
  const moveIn = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'move-in' } },
    limit: 1,
  })
  if (moveIn.docs[0]) {
    await payload.update({
      collection: 'pages',
      id: moveIn.docs[0].id,
      locale: 'zh-TW',
      data: { legacyHtml: MOVE_IN_ZH } as any,
    })
    console.log('✓ pages/move-in zh body recurated')
  }

  console.log('\n🎉 final fix complete')
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
